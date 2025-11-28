import { ref } from 'vue';
import { parseCSV } from '~/utils/csvParser';
import { toRomaji } from 'wanakana';

export interface Word {
    id: string;
    word: string;
    reading: string;
    meaning: string;
    level: string;
    romaji: string;
}

export interface Kanji {
    kanji: string;
    onyomi: string;
    kunyomi: string;
    meaning: string;
    level: string;
}

export const useWords = () => {
    const words = ref<Word[]>([]);
    const kanjiList = ref<Kanji[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const loadWords = async () => {
        if (words.value.length > 0) return; // Already loaded
        loading.value = true;
        error.value = null;
        try {
            const levels = ['n1', 'n2', 'n3', 'n4', 'n5'];
            const allWords: Word[] = [];

            for (const level of levels) {
                try {
                    const response = await fetch(`/jlpt/${level}.csv`);
                    if (!response.ok) throw new Error(`Failed to load ${level}.csv`);
                    const text = await response.text();
                    const parsed = await parseCSV<any>(text);

                    const mapped = parsed.map((row: any, index: number) => ({
                        id: `${level}-${index}`,
                        word: row.expression,
                        reading: row.reading,
                        meaning: row.meaning,
                        level: level.toUpperCase(),
                        romaji: row.reading ? toRomaji(row.reading) : ''
                    }));

                    allWords.push(...mapped);
                } catch (e) {
                    console.error(e);
                }
            }
            words.value = allWords;
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const loadKanji = async () => {
        if (kanjiList.value.length > 0) return; // Already loaded
        try {
            const response = await fetch('/jlpt/joyo.csv');
            if (!response.ok) throw new Error('Failed to load joyo.csv');
            const text = await response.text();
            const parsed = await parseCSV<any>(text);

            kanjiList.value = parsed.map((row: any) => ({
                kanji: row.kanji,
                onyomi: row.on ? row.on.replace(/-/g, '.').replace(/\|/g, ', ') : '',
                kunyomi: row.kun ? row.kun.replace(/-/g, '.').replace(/\|/g, ', ') : '',
                meaning: row.meanings,
                level: row.jlpt ? `N${row.jlpt}` : 'Joyo'
            }));
        } catch (e) {
            console.error(e);
        }
    };

    return {
        words,
        kanjiList,
        loading,
        error,
        loadWords,
        loadKanji
    };
};
