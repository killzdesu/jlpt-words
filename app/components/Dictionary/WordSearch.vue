<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <input 
          v-model="query"
          type="text" 
          placeholder="Search (English, Kanji, Kana, Romaji)..."
          class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          @input="emitSearch"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-gray-500 self-center mr-2">Level:</span>
        <button 
          v-for="level in levels" 
          :key="level"
          @click="toggleLevel(level)"
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors border"
          :class="selectedLevels.includes(level) 
            ? 'bg-primary text-white border-primary' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'"
        >
          {{ level.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  initialQuery?: string;
}>();

const emit = defineEmits<{
  (e: 'search', payload: { query: string; levels: string[] }): void;
}>();

const query = ref(props.initialQuery || '');
const levels = ['n1', 'n2', 'n3', 'n4', 'n5'];
const selectedLevels = ref<string[]>(['n5']); // Default to N5

const toggleLevel = (level: string) => {
  if (selectedLevels.value.includes(level)) {
    selectedLevels.value = selectedLevels.value.filter(l => l !== level);
  } else {
    selectedLevels.value.push(level);
  }
  emitSearch();
};

const emitSearch = () => {
  emit('search', {
    query: query.value,
    levels: selectedLevels.value
  });
};

// Initial emit
onMounted(() => {
  emitSearch();
});
</script>
