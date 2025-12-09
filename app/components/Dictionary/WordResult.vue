<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-neutral hover:shadow-md transition-shadow flex justify-between items-start group">
    <div>
      <div class="flex items-baseline gap-2 mb-1">
        <h3 class="text-xl font-bold text-text">{{ word.word }}</h3>
        <span class="text-sm text-tertiary font-mono">{{ word.reading }}</span>
      </div>
      <p class="text-text">{{ word.meaning }}</p>
      <div class="flex items-center gap-2 mt-2">
        <span class="inline-block px-2 py-0.5 bg-neutral text-xs font-medium text-tertiary rounded">
          {{ word.level }}
        </span>
        <span 
          v-if="frequency !== null" 
          class="inline-block px-2 py-0.5 bg-primary/10 text-xs font-medium text-primary rounded"
          title="JPDB Frequency Rank"
        >
          #{{ frequency.toLocaleString() }}
        </span>
      </div>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="userStore.toggleFavorite(word.id)"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-50 transition-all duration-200"
        :class="isFavorite ? 'text-yellow-500 opacity-100' : 'text-tertiary/30 opacity-0 group-hover:opacity-100'"
        title="Add to Favorites"
      >
        <Icon :name="isFavorite ? 'mingcute:star-fill' : 'mingcute:star-line'" />
      </button>
      <button 
        @click="userStore.toggleBlocked(word.id)"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral transition-all duration-200"
        :class="isBlocked ? 'text-red-500 opacity-100' : 'text-tertiary/30 opacity-0 group-hover:opacity-100'"
        title="Block Word"
      >
        <Icon :name="isBlocked ? 'mingcute:close-circle-fill' : 'mingcute:close-circle-line'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useJPDB } from '~/composables/useJPDB';
import type { Word } from '~/composables/useWords';

const props = defineProps<{
  word: Word;
}>();

const userStore = useUserStore();
const { getFrequency, isReady } = useJPDB();

const frequency = ref<number | null>(null);

const isFavorite = computed(() => userStore.favorites.includes(props.word.id));
const isBlocked = computed(() => userStore.blocked.includes(props.word.id));

// Fetch frequency when JPDB is ready or word changes
watch(
  [() => props.word.word, isReady],
  async ([word, ready]) => {
    if (ready && word) {
      frequency.value = await getFrequency(word);
    }
  },
  { immediate: true }
);
</script>

