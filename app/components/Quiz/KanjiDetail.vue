<template>
  <div class="space-y-4 mt-4">
    <div 
      v-for="(k, index) in kanjiDetails" 
      :key="index"
      class="bg-white p-4 rounded-lg border border-neutral shadow-sm"
    >
      <div class="flex items-center justify-between mb-2 border-b pb-2">
        <div class="flex items-center gap-4">
          <span class="text-3xl font-bold text-primary">{{ k.kanji }}</span>
          <span class="text-xs px-2 py-1 bg-neutral rounded-full text-tertiary font-medium">{{ k.level || 'Joyo' }}</span>
        </div>
        <button 
          @click="openExamples(k.kanji)"
          class="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
        >
          <span>Example Words</span>
          <Icon name="mingcute:comment-line" size="14" />
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span class="text-tertiary text-xs uppercase tracking-wider block mb-0.5">Onyomi</span>
          <p class="font-medium text-text">{{ k.onyomi || '-' }}</p>
        </div>
        <div>
          <span class="text-tertiary text-xs uppercase tracking-wider block mb-0.5">Kunyomi</span>
          <p class="font-medium text-text">{{ k.kunyomi || '-' }}</p>
        </div>
        <div class="sm:col-span-2">
          <span class="text-tertiary text-xs uppercase tracking-wider block mb-0.5">Meaning</span>
          <p class="font-medium text-text">{{ k.meaning }}</p>
        </div>
      </div>
    </div>
    <div v-if="kanjiDetails.length === 0" class="text-center py-4 text-tertiary italic bg-neutral/50 rounded-lg border border-dashed border-tertiary/30">
      No Kanji details available for this word.
    </div>

    <!-- Example Words Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <template #title>
        Words with <span class="text-primary">{{ selectedKanji }}</span>
      </template>
      
      <div v-if="loadingExamples" class="py-8 flex justify-center text-primary">
        <svg class="animate-spin -ml-1 mr-3 h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="exampleWords.length === 0" class="py-6 text-center text-tertiary">
        No examples found.
      </div>
      
      <div v-else class="space-y-3">
        <div 
          v-for="(word, wIdx) in displayedExamples" 
          :key="wIdx"
          class="flex items-start justify-between p-2 rounded-lg hover:bg-neutral/50 transition-colors"
        >
          <div>
            <div class="flex items-baseline gap-2">
              <span class="font-bold text-lg text-text">{{ word.word }}</span>
              <span class="text-sm text-tertiary">({{ word.reading }})</span>
            </div>
            <p v-if="word.meaning" class="text-sm text-text/80 mt-1">{{ word.meaning }}</p>
          </div>
          <div v-if="word.frequency" class="text-xs px-2 py-0.5 bg-neutral text-tertiary rounded">
            #{{ word.frequency.toLocaleString() }}
          </div>
        </div>

        <button 
          v-if="displayedCount < exampleWords.length"
          @click="loadMore"
          class="w-full py-2 mt-4 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/20 hover:border-primary/50"
        >
          See more ({{ exampleWords.length - displayedCount }} remaining)
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWords, type Kanji, type Word } from '~/composables/useWords';
import { useJPDB } from '~/composables/useJPDB';
import { useUserStore } from '~/stores/user';
import Modal from '~/components/UI/Modal.vue';

const props = defineProps<{
  word: string; // The Japanese word containing Kanji
}>();

const { kanjiList, loadKanji, words, loadWords } = useWords();
const { getFrequencies, searchWords } = useJPDB();
const userStore = useUserStore();

await loadKanji();

// State for Modal
const showModal = ref(false);
const selectedKanji = ref('');
const exampleWords = ref<Array<{ word: string; reading: string; meaning?: string; frequency?: number }>>([]);
const displayedCount = ref(10);
const loadingExamples = ref(false);

const kanjiDetails = computed(() => {
  if (!kanjiList.value || kanjiList.value.length === 0) return [];
  if (!props.word) return [];
  
  const result: Kanji[] = [];
  const seen = new Set();

  for (const char of props.word) {
    if (/[\u4e00-\u9faf]/.test(char)) {
      if (seen.has(char)) continue;
      seen.add(char);

      const found = kanjiList.value.find(k => k.kanji === char);
      if (found) {
        result.push(found);
      }
    }
  }
  return result;
});

const displayedExamples = computed(() => {
  return exampleWords.value.slice(0, displayedCount.value);
});

const loadMore = () => {
  displayedCount.value += 5;
};

const openExamples = async (kanji: string) => {
  selectedKanji.value = kanji;
  showModal.value = true;
  loadingExamples.value = true;
  exampleWords.value = [];
  displayedCount.value = 10;

  try {
    const source = userStore.settings.kanjiExampleSource;
    let results = [];

    if (source === 'jlpt') {
      await loadWords();
      // Filter words containing the kanji (exclude exact match of single char if desired, but user req said "not includes the exact the kanji itself" which implies the word itself shouldn't be just the kanji? 
      // User req: "The words shown were not includes the exact the kanji itself" -> Likely means exclude the single character word if it exists? Or maybe just exclude the query kanji if it's a word?
      // I'll interpret "not includes the exact the kanji itself" as: if I click "日", don't show "日" (day) as an example.
      
      const distinctWords = words.value.filter(w => w.word.includes(kanji) && w.word !== kanji);
      
      // Get frequencies
      const wordList = distinctWords.map(w => w.word);
      const frequencies = await getFrequencies(wordList);
      
      results = distinctWords.map(w => ({
        word: w.word,
        reading: w.reading,
        meaning: w.meaning,
        frequency: frequencies.get(w.word) ?? 999999
      }));

    } else {
        // JPDB Source
        const searchResults = await searchWords(kanji, 100); // Fetch more then paginate locally
        results = searchResults.map(r => ({
            word: r.word,
            reading: r.reading,
            meaning: '', // JPDB source doesn't have meanings in the worker data currently
            frequency: r.frequency
        }));
    }

    // Sort by frequency (ascending)
    results.sort((a, b) => (a.frequency || 999999) - (b.frequency || 999999));
    
    exampleWords.value = results;

  } catch (e) {
    console.error(e);
  } finally {
    loadingExamples.value = false;
  }
};
</script>
