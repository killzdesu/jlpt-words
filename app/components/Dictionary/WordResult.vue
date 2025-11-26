<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-start group">
    <div>
      <div class="flex items-baseline gap-2 mb-1">
        <h3 class="text-xl font-bold text-gray-900">{{ word.word }}</h3>
        <span class="text-sm text-gray-500 font-mono">{{ word.reading }}</span>
      </div>
      <p class="text-gray-700">{{ word.meaning }}</p>
      <span class="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-500 rounded">
        {{ word.level }}
      </span>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="userStore.toggleFavorite(word.id)"
        class="p-2 rounded-full hover:bg-pink-50 transition-all duration-200"
        :class="isFavorite ? 'text-secondary opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'"
        title="Add to Favorites"
      >
        <span v-if="isFavorite">❤️</span>
        <span v-else>🤍</span>
      </button>
      <button 
        @click="userStore.toggleBlocked(word.id)"
        class="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
        :class="isBlocked ? 'text-red-500 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'"
        title="Block Word"
      >
        🚫
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '~/stores/user';
import type { Word } from '~/composables/useWords';

const props = defineProps<{
  word: Word;
}>();

const userStore = useUserStore();

const isFavorite = computed(() => userStore.favorites.includes(props.word.id));
const isBlocked = computed(() => userStore.blocked.includes(props.word.id));
</script>
