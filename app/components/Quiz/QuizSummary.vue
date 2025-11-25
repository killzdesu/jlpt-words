<template>
  <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center space-y-8 animate-fade-in">
    <h2 class="text-3xl font-bold text-primary">Quiz Complete! 🎉</h2>
    
    <div class="text-6xl font-extrabold text-secondary">
      {{ score }} / {{ total }}
    </div>
    
    <p class="text-gray-600 text-lg">
      {{ feedbackMessage }}
    </p>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ correctCount }}</div>
        <div class="text-sm text-green-800">Correct</div>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <div class="text-2xl font-bold text-red-600">{{ total - correctCount }}</div>
        <div class="text-sm text-red-800">Wrong</div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <button 
        @click="$emit('retry')"
        class="w-full py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 transition-colors"
      >
        Play Again
      </button>
      <NuxtLink 
        to="/"
        class="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors block"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  results: boolean[];
}>();

const emit = defineEmits(['retry']);

const total = computed(() => props.results.length);
const correctCount = computed(() => props.results.filter(r => r).length);
const score = computed(() => correctCount.value);

const feedbackMessage = computed(() => {
  const percentage = (correctCount.value / total.value) * 100;
  if (percentage === 100) return "Perfect! You're a master! 🏆";
  if (percentage >= 80) return "Great job! Keep it up! 🌟";
  if (percentage >= 60) return "Good effort! A bit more practice! 💪";
  return "Keep practicing! You'll get there! 📚";
});
</script>
