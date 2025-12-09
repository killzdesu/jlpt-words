<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-text">History</h1>
      <NuxtLink to="/" class="text-primary hover:text-primary-dark font-medium flex items-center gap-2">
        <span>←</span> Back to Home
      </NuxtLink>
    </div>

    <div v-if="history.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm border border-neutral">
      <span class="text-6xl mb-4 block">📜</span>
      <h3 class="text-xl font-bold text-text mb-2">No History Yet</h3>
      <p class="text-tertiary mb-6">Start a quiz to track your progress!</p>
      <NuxtLink to="/quiz" class="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
        Start Quiz
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="bg-white rounded-xl shadow-sm border border-neutral overflow-hidden transition-all duration-300"
        :class="{ 'ring-2 ring-primary/20': expandedIndex === index }"
      >
        <!-- Header / Summary Row -->
        <div 
          @click="toggleExpand(index)"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral transition-colors"
        >
          <div class="flex items-center gap-4">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              :class="item.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
            >
              {{ item.correct ? '✓' : '✗' }}
            </div>
            <div>
              <p class="font-bold text-text text-lg">{{ item.question }}</p>
              <p class="text-sm text-tertiary">
                {{ item.correctAnswer }}
                <span v-if="!item.correct" class="text-red-500 ml-2">
                  (You: {{ item.answer }})
                </span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <span class="text-xs text-tertiary hidden sm:inline-block">{{ formatDate(item.date) }}</span>
             <span class="text-tertiary transform transition-transform duration-300" :class="{ 'rotate-180': expandedIndex === index }">▼</span>
          </div>
        </div>

        <!-- Expanded Details -->
        <div v-if="expandedIndex === index" class="border-t border-neutral bg-neutral/50 p-4">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
            <!-- Left: Actions -->
            <div class="flex gap-2">
              <button 
                @click.stop="toggleFavorite(item.wordId)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                :class="isFavorite(item.wordId) ? 'bg-yellow-100 text-yellow-700' : 'bg-white border border-neutral text-tertiary hover:bg-neutral'"
              >
                <Icon :name="isFavorite(item.wordId) ? 'mingcute:star-fill' : 'mingcute:star-line'" />
                {{ isFavorite(item.wordId) ? 'Favorited' : 'Add to Favorites' }}
              </button>
              
              <button 
                @click.stop="toggleBlocked(item.wordId)"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                :class="isBlocked(item.wordId) ? 'bg-red-100 text-red-700' : 'bg-white border border-neutral text-tertiary hover:bg-neutral'"
              >
                <Icon :name="isBlocked(item.wordId) ? 'mingcute:close-circle-fill' : 'mingcute:close-circle-line'" />
                {{ isBlocked(item.wordId) ? 'Blocked' : 'Block Word' }}
              </button>
            </div>

            <!-- Right: Badges -->
            <div class="flex items-center gap-2">
              <span v-if="item.level" class="inline-block px-2 py-0.5 bg-neutral text-xs font-medium text-tertiary rounded border border-neutral-dark/10">
                {{ item.level }}
              </span>
              <span 
                v-if="currentFrequency !== null" 
                class="inline-block px-2 py-0.5 bg-primary/10 text-xs font-medium text-primary rounded border border-primary/20"
                title="JPDB Frequency Rank"
              >
                #{{ currentFrequency.toLocaleString() }}
              </span>
            </div>
          </div>

          <KanjiDetail :word="item.wordText" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useJPDB } from '~/composables/useJPDB';
import KanjiDetail from '~/components/Quiz/KanjiDetail.vue';

const userStore = useUserStore();
const { getFrequency, isReady } = useJPDB();
const history = computed(() => userStore.history);
const expandedIndex = ref<number | null>(null);
const currentFrequency = ref<number | null>(null);

const toggleExpand = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

// Fetch frequency when expanded index changes
watch(expandedIndex, async (newIndex) => {
  currentFrequency.value = null; // Reset
  if (newIndex !== null && history.value[newIndex]) {
    const item = history.value[newIndex];
    // Only fetch for words, not pure kanji questions if they don't have word text
    if (item.wordText && isReady.value) {
      currentFrequency.value = await getFrequency(item.wordText);
    }
  }
});

const isFavorite = (wordId: string) => userStore.favorites.includes(wordId);
const isBlocked = (wordId: string) => userStore.blocked.includes(wordId);

const toggleFavorite = (wordId: string) => userStore.toggleFavorite(wordId);
const toggleBlocked = (wordId: string) => userStore.toggleBlocked(wordId);

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
};

useHead({
  title: 'History - JLPT Master'
});
</script>
