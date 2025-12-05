<template>
  <div class="max-w-4xl mx-auto py-0 md:py-6">
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin text-4xl">⏳</div>
      <p class="mt-2 text-tertiary">Loading quiz data...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <transition name="fade" mode="out-in">
        <!-- State: Settings -->
        <QuizSetting 
          v-if="gameState === 'setting'" 
          @start="generateQuiz" 
        />

        <!-- State: Playing -->
        <QuestionCard 
          v-else-if="gameState === 'playing' && currentQuestion"
          :question="currentQuestion"
          :current-number="currentIndex + 1"
          :total-number="questions.length"
          :show-answer="showAnswer"
          :selected-choice="selectedChoice"
          @select="handleAnswer"
          @next="nextQuestion"
        >
          <template #kanji-detail>
            <KanjiDetail :word="currentQuestion.wordText" />
          </template>
        </QuestionCard>

        <!-- State: Summary -->
        <QuizSummary 
          v-else-if="gameState === 'summary'"
          :results="results"
          @retry="resetQuiz"
        />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWords } from '~/composables/useWords';
import { useUserStore } from '~/stores/user';
import QuizSetting from '~/components/Quiz/QuizSetting.vue';
import QuestionCard from '~/components/Quiz/QuestionCard.vue';
import KanjiDetail from '~/components/Quiz/KanjiDetail.vue';
import QuizSummary from '~/components/Quiz/QuizSummary.vue';

import type { Word, Kanji } from '~/composables/useWords';
import type { Question } from '~/types';

const { words, kanjiList, loading, error, loadWords, loadKanji } = useWords();
const userStore = useUserStore();

type GameState = 'setting' | 'playing' | 'summary';
const gameState = ref<GameState>('setting');

const questions = ref<Question[]>([]);
const currentIndex = ref(0);
const showAnswer = ref(false);
const selectedChoice = ref<string | null>(null);
const results = ref<boolean[]>([]);

const currentQuestion = computed(() => questions.value[currentIndex.value]);

onMounted(async () => {
  await Promise.all([loadWords(), loadKanji()]);
});

const generateQuiz = () => {
  const settings = userStore.settings;
  const count = settings.quizCount;
  const levels = settings.jlptLevels.map(l => l.toUpperCase());
  
  let pool: (Word | Kanji)[] = [];

  if (settings.quizType === 'kanji-reading') {
    // Filter Kanji
    pool = kanjiList.value.filter(k => levels.includes(k.level));
    // If pool is too small, maybe fallback or warn?
    if (pool.length < count) {
       // If strict filtering yields few results, use what we have
    }
  } else {
    // Filter Words
    pool = words.value.filter(w => levels.includes(w.level));
    
    if (settings.onlyFavorites) {
      pool = pool.filter(w => 'id' in w && userStore.favorites.includes(w.id));
    }
    if (settings.excludeBlocked) {
      pool = pool.filter(w => 'id' in w && !userStore.blocked.includes(w.id));
    }
  }

  if (pool.length === 0) {
    alert('No words/kanji found with current settings!');
    return;
  }

  // Shuffle pool
  pool = pool.sort(() => Math.random() - 0.5);
  
  // Select questions
  const selectedItems = pool.slice(0, count);

  questions.value = selectedItems.map(item => {
    // Generate choices
    const isKanjiItem = (i: Word | Kanji): i is Kanji => 'kanji' in i;
    
    const formatKanjiReading = (reading: string) => {
      return reading.replace(/-/g, '.').replace(/\|/g, ', ');
    };

    const getItemText = (i: Word | Kanji) => isKanjiItem(i) ? i.kanji : i.word;
    const getItemMeaning = (i: Word | Kanji) => i.meaning;
    const getItemReading = (i: Word | Kanji) => isKanjiItem(i) ? formatKanjiReading(`${i.onyomi} / ${i.kunyomi}`) : i.reading;

    const correctAnswer = isKanjiItem(item)
      ? getItemReading(item)
      : (settings.quizType === 'jp-en' ? item.meaning : item.word);
    
    const questionText = isKanjiItem(item)
      ? item.kanji 
      : (settings.quizType === 'jp-en' ? item.word : item.meaning);

    const hint = isKanjiItem(item) ? item.meaning : (settings.quizType === 'jp-en' ? item.reading : '');

    // Generate distractors
    const distractors = pool
      .filter(i => i !== item)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(i => {
        if (isKanjiItem(i)) return formatKanjiReading(`${i.onyomi} / ${i.kunyomi}`);
        return settings.quizType === 'jp-en' ? i.meaning : i.word;
      });

    const choices = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);

    return {
      wordId: isKanjiItem(item) ? item.kanji : item.id,
      wordText: isKanjiItem(item) ? item.kanji : item.word,
      level: item.level,
      questionText,
      correctAnswer,
      choices,
      hint,
      type: settings.quizType,
      detail: {
        reading: getItemReading(item),
        meaning: item.meaning
      }
    };
  });

  currentIndex.value = 0;
  results.value = [];
  gameState.value = 'playing';
};

const handleAnswer = (answer: string) => {
  if (showAnswer.value) return;
  
  if (!currentQuestion.value) return;

  const isCorrect = answer === currentQuestion.value.correctAnswer;
  if (isCorrect) {
    // Score tracking if needed, currently just results array
  }
  
  // Record history
  userStore.addToHistory({
    question: currentQuestion.value.questionText,
    answer: answer,
    correctAnswer: currentQuestion.value.correctAnswer,
    correct: isCorrect,
    date: new Date().toISOString(),
    // Additional metadata
    wordId: currentQuestion.value.wordId,
    wordText: currentQuestion.value.wordText,
    level: currentQuestion.value.level,
    type: currentQuestion.value.type,
    detail: currentQuestion.value.detail
  });

  selectedChoice.value = answer;
  showAnswer.value = true;
  results.value.push(isCorrect);
};

const nextQuestion = () => {
  showAnswer.value = false;
  selectedChoice.value = null;
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    gameState.value = 'summary';
  }
};

const resetQuiz = () => {
  gameState.value = 'setting';
  questions.value = [];
  results.value = [];
};

useHead({
  title: 'Quiz - JLPT Master'
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
