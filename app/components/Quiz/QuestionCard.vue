<template>
  <div class="max-w-2xl mx-auto w-full">
    <!-- Progress Bar -->
    <div class="mb-2 md:mb-4 flex justify-between items-center text-sm font-medium text-tertiary">
      <span>Question {{ currentNumber }} / {{ totalNumber }}</span>
      <span>{{ Math.round((currentNumber / totalNumber) * 100) }}%</span>
    </div>
    <div class="w-full bg-neutral rounded-full h-2.5 mb-4 md:mb-8">
      <div class="bg-primary h-2.5 rounded-full transition-all duration-500" :style="{ width: `${(currentNumber / totalNumber) * 100}%` }"></div>
    </div>

    <!-- Question Card -->
    <div class="bg-white rounded-2xl shadow-lg border border-neutral overflow-hidden">
      <!-- Question Header -->
      <div class="bg-neutral p-4 md:p-8 text-center border-b border-neutral relative">
        <span class="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-white border rounded text-tertiary">
          {{ question.level }}
        </span>
        
        <h2 class="text-2xl md:text-4xl font-bold text-text mb-2">{{ question.questionText }}</h2>
        
        <!-- Conditional Hint Display -->
        <p v-if="shouldShowHint" class="text-tertiary text-base md:text-lg">{{ question.hint }}</p>

        <!-- Action Buttons -->
        <div class="absolute top-4 left-4 flex gap-2">
          <button 
            @click.stop="toggleFavorite"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-yellow-50 transition-colors"
            :class="isFavorite ? 'text-yellow-500 border-yellow-500' : 'text-tertiary/50 border-neutral'"
          >
            <Icon :name="isFavorite ? 'mingcute:star-fill' : 'mingcute:star-line'" />
          </button>
          <button 
            @click.stop="toggleBlocked"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:bg-neutral transition-colors"
            :class="isBlocked ? 'text-red-500 border-red-500' : 'text-tertiary/50 border-neutral'"
          >
            <Icon :name="isBlocked ? 'mingcute:close-circle-fill' : 'mingcute:close-circle-line'" />
          </button>
        </div>
      </div>

      <!-- Choices -->
      <div class="p-4 md:p-6 grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-2">
        <button 
          v-for="(choice, index) in question.choices" 
          :key="index"
          @click="selectChoice(choice)"
          :disabled="showAnswer"
          class="p-3 md:p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group"
          :class="getChoiceClass(choice)"
        >
          <span class="font-medium text-base md:text-lg relative z-10">{{ choice }}</span>
          
          <!-- Feedback Icon -->
          <span v-if="showAnswer && choice === question.correctAnswer" class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl z-10">✅</span>
          <span v-if="showAnswer && selectedChoice === choice && choice !== question.correctAnswer" class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl z-10">❌</span>
        </button>
      </div>

      <!-- Answer Detail -->
      <div v-if="showAnswer" class="bg-primary/5 p-6 border-t border-primary/10 animate-fade-in">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-primary mb-1">Correct Answer:</h3>
            <p class="text-xl text-primary">{{ question.correctAnswer }}</p>
            <div class="mt-2 text-primary/80 text-sm space-y-1">
              <p><span class="font-semibold">Reading:</span> {{ question.detail.reading }}</p>
              <p><span class="font-semibold">Meaning:</span> {{ question.detail.meaning }}</p>
            </div>
          </div>
          <button 
            @click="$emit('next')"
            class="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-colors font-medium"
          >
            Next ➡️
          </button>
        </div>
        
        <!-- Kanji Detail Toggle -->
        <div class="mt-4 pt-4 border-t border-primary/10">
          <button 
            @click="showKanjiDetail = !showKanjiDetail"
            class="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <span>{{ showKanjiDetail ? 'Hide' : 'Show' }} Kanji Details</span>
            <span>{{ showKanjiDetail ? '▲' : '▼' }}</span>
          </button>
          
          <div v-if="showKanjiDetail" class="mt-4">
             <slot name="kanji-detail" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import type { Question } from '~/types';

const props = defineProps<{
  question: Question;
  currentNumber: number;
  totalNumber: number;
  showAnswer: boolean;
  selectedChoice: string | null;
}>();

const emit = defineEmits(['select', 'next']);
const userStore = useUserStore();
const showKanjiDetail = ref(false);

const isFavorite = computed(() => userStore.favorites.includes(props.question.wordId));
const isBlocked = computed(() => userStore.blocked.includes(props.question.wordId));

const shouldShowHint = computed(() => {
  if (props.question.type === 'jp-en') {
    return userStore.settings.showFurigana;
  }
  if (props.question.type === 'kanji-reading') {
    return userStore.settings.showMeaning;
  }
  return false; // Don't show hint for en-jp by default or if not configured
});

const toggleFavorite = () => userStore.toggleFavorite(props.question.wordId);
const toggleBlocked = () => userStore.toggleBlocked(props.question.wordId);

const selectChoice = (choice: string) => {
  if (!props.showAnswer) {
    emit('select', choice);
    showKanjiDetail.value = false; // Reset for next question
  }
};

const getChoiceClass = (choice: string) => {
  if (!props.showAnswer) {
    return 'border-neutral hover:border-primary hover:bg-primary/5';
  }
  if (choice === props.question.correctAnswer) {
    return 'border-green-500 bg-green-50 text-green-900';
  }
  if (choice === props.selectedChoice) {
    return 'border-red-500 bg-red-50 text-red-900';
  }
  return 'border-neutral opacity-50';
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
