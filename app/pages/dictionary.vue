<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-primary">Dictionary</h1>
    
    <WordSearch @search="handleSearch" />

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin text-4xl">⏳</div>
      <p class="mt-2 text-tertiary">Loading dictionary...</p>
    </div>

    <div v-else-if="error" class="text-center py-12 text-red-500">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div class="flex justify-between items-center text-sm text-tertiary px-1">
        <span>Found {{ filteredWords.length }} words</span>
        <span v-if="filteredWords.length > displayLimit">Showing first {{ displayLimit }}</span>
      </div>

      <div class="grid gap-4">
        <WordResult 
          v-for="word in displayedWords" 
          :key="word.id" 
          :word="word" 
        />
      </div>
      
      <div v-if="filteredWords.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-tertiary/30">
        <p class="text-tertiary">No words found matching your criteria.</p>
      </div>

      <div v-if="filteredWords.length > displayLimit" class="text-center pt-4">
        <button 
          @click="displayLimit += 50"
          class="px-6 py-2 bg-white border border-tertiary/30 rounded-full hover:bg-neutral transition-colors text-sm font-medium"
        >
          Load More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWords } from '~/composables/useWords';
import WordSearch from '~/components/Dictionary/WordSearch.vue';
import WordResult from '~/components/Dictionary/WordResult.vue';

const { words, loading, error, loadWords } = useWords();

const searchQuery = ref('');
const searchLevels = ref<string[]>([]);
const displayLimit = ref(50);

onMounted(() => {
  loadWords();
});

const handleSearch = ({ query, levels }: { query: string; levels: string[] }) => {
  searchQuery.value = query.toLowerCase();
  searchLevels.value = levels;
  displayLimit.value = 50; // Reset limit on search
};

const filteredWords = computed(() => {
  if (!words.value) return [];
  
  let result = words.value;

  // Filter by level
  if (searchLevels.value.length > 0) {
    result = result.filter(w => searchLevels.value.includes(w.level.toLowerCase()));
  }

  // Filter by query
  if (searchQuery.value) {
    const q = searchQuery.value;
    result = result.filter(w => 
      w.word.toLowerCase().includes(q) || 
      w.reading.toLowerCase().includes(q) || 
      w.meaning.toLowerCase().includes(q) ||
      (w.romaji || '').toLowerCase().includes(q)
    );
  }

  return result;
});

const displayedWords = computed(() => {
  return filteredWords.value.slice(0, displayLimit.value);
});

useHead({
  title: 'Dictionary - JLPT Master'
});
</script>
