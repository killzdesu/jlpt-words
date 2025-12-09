<template>
  <div class="space-y-4 mt-4">
    <div 
      v-for="(k, index) in kanjiDetails" 
      :key="index"
      class="bg-white p-4 rounded-lg border border-neutral shadow-sm"
    >
      <div class="flex items-center gap-4 mb-2 border-b pb-2">
        <span class="text-3xl font-bold text-primary">{{ k.kanji }}</span>
        <span class="text-xs px-2 py-1 bg-neutral rounded-full text-tertiary font-medium">{{ k.level || 'Joyo' }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWords, type Kanji } from '~/composables/useWords';

const props = defineProps<{
  word: string; // The Japanese word containing Kanji
}>();

const { kanjiList, loadKanji } = useWords();

await loadKanji();

const kanjiDetails = computed(() => {
  if (!kanjiList.value || kanjiList.value.length === 0) return [];
  if (!props.word) return [];
  
  const result: Kanji[] = [];
  const seen = new Set();

  for (const char of props.word) {
    // Check if char is Kanji (common range)
    if (/[\u4e00-\u9faf]/.test(char)) {
      if (seen.has(char)) continue; // Avoid duplicates if same kanji appears twice? Or maybe show both?
      // Let's show duplicates if they appear twice in context, but usually unique details are better.
      // Actually, for "people people" (hitobito), showing "hito" once is probably enough.
      seen.add(char);

      const found = kanjiList.value.find(k => k.kanji === char);
      if (found) {
        result.push(found);
      }
    }
  }
  return result;
});
</script>
