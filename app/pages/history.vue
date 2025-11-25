<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">History</h1>
      <NuxtLink to="/" class="text-primary hover:text-primary-dark font-medium flex items-center gap-2">
        <span>←</span> Back to Home
      </NuxtLink>
    </div>

    <div v-if="history.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
      <span class="text-6xl mb-4 block">📜</span>
      <h3 class="text-xl font-bold text-gray-800 mb-2">No History Yet</h3>
      <p class="text-gray-500 mb-6">Start a quiz to track your progress!</p>
      <NuxtLink to="/quiz" class="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
        Start Quiz
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
        :class="{ 'ring-2 ring-primary/20': expandedIndex === index }"
      >
        <!-- Header / Summary Row -->
        <div 
          @click="toggleExpand(index)"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center gap-4">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              :class="item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
            >
              {{ item.isCorrect ? '✓' : '✗' }}
            </div>
            <div>
              <p class="font-bold text-gray-900 text-lg">{{ item.questionText }}</p>
              <p class="text-sm text-gray-500">
                {{ item.correctAnswer }}
                <span v-if="!item.isCorrect" class="text-red-500 ml-2">
                  (You: {{ item.userAnswer }})
                </span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <span class="text-xs text-gray-400 hidden sm:inline-block">{{ formatDate(item.timestamp) }}</span>
             <span class="text-gray-400 transform transition-transform duration-300" :class="{ 'rotate-180': expandedIndex === index }">▼</span>
          </div>
        </div>

        <!-- Expanded Details -->
        <div v-if="expandedIndex === index" class="border-t border-gray-100 bg-gray-50/50 p-4">
          <div class="flex flex-wrap gap-2 mb-4">
            <button 
              @click.stop="toggleFavorite(item.wordId)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              :class="isFavorite(item.wordId) ? 'bg-yellow-100 text-yellow-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              <span>{{ isFavorite(item.wordId) ? '★' : '☆' }}</span>
              {{ isFavorite(item.wordId) ? 'Favorited' : 'Add to Favorites' }}
            </button>
            
            <button 
              @click.stop="toggleBlocked(item.wordId)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              :class="isBlocked(item.wordId) ? 'bg-red-100 text-red-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'"
            >
              <span>{{ isBlocked(item.wordId) ? '🚫' : '⭕' }}</span>
              {{ isBlocked(item.wordId) ? 'Blocked' : 'Block Word' }}
            </button>
          </div>

          <KanjiDetail :word="item.wordText" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import KanjiDetail from '~/components/Quiz/KanjiDetail.vue';

const userStore = useUserStore();
const history = computed(() => userStore.history);
const expandedIndex = ref<number | null>(null);

const toggleExpand = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

const isFavorite = (wordId: string) => userStore.favorites.includes(wordId);
const isBlocked = (wordId: string) => userStore.blocked.includes(wordId);

const toggleFavorite = (wordId: string) => userStore.toggleFavorite(wordId);
const toggleBlocked = (wordId: string) => userStore.toggleBlocked(wordId);

const formatDate = (timestamp: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString();
};

useHead({
  title: 'History - JLPT Master'
});
</script>
