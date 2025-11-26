<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-neutral hover:shadow-md transition-shadow flex justify-between items-start group">
    <div>
      <div class="flex items-baseline gap-2 mb-1">
        <h3 class="text-xl font-bold text-text">{{ word.word }}</h3>
        <span class="text-sm text-tertiary font-mono">{{ word.reading }}</span>
      </div>
      <p class="text-text">{{ word.meaning }}</p>
      <span class="inline-block mt-2 px-2 py-0.5 bg-neutral text-xs font-medium text-tertiary rounded">
        {{ word.level }}
      </span>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="userStore.toggleFavorite(word.id)"
        class="p-2 rounded-full hover:bg-secondary/20 transition-all duration-200"
        :class="isFavorite ? 'text-secondary opacity-100' : 'text-tertiary/30 opacity-0 group-hover:opacity-100'"
        title="Add to Favorites"
      >
        <span v-if="isFavorite">❤️</span>
        <span v-else>🤍</span>
      </button>
      <button 
        @click="userStore.toggleBlocked(word.id)"
        class="p-2 rounded-full hover:bg-neutral transition-all duration-200"
        :class="isBlocked ? 'text-red-500 opacity-100' : 'text-tertiary/30 opacity-0 group-hover:opacity-100'"
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
