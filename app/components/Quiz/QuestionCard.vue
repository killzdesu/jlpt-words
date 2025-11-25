<template>
  <div class="max-w-2xl mx-auto w-full">
    <!-- Progress Bar -->
    <div class="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
      <span>Question {{ currentNumber }} / {{ totalNumber }}</span>
      <span>{{ Math.round((currentNumber / totalNumber) * 100) }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
      <div class="bg-primary h-2.5 rounded-full transition-all duration-500" :style="{ width: `${(currentNumber / totalNumber) * 100}%` }"></div>
    </div>

    <!-- Question Card -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <!-- Question Header -->
      <div class="bg-gray-50 p-8 text-center border-b border-gray-100 relative">
        <span class="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-white border rounded text-gray-500">
          {{ question.level }}
        </span>
        
        <h2 class="text-4xl font-bold text-gray-900 mb-2">{{ question.questionText }}</h2>
        
        <!-- Conditional Hint Display -->
        <p v-if="shouldShowHint" class="text-gray-500 text-lg">{{ question.hint }}</p>

        <!-- Action Buttons -->
        <div class="absolute top-4 left-4 flex gap-2">
          <button 
            @click.stop="toggleFavorite"
            class="p-1.5 rounded-full bg-white border hover:bg-pink-50 transition-colors"
            :class="isFavorite ? 'text-secondary border-secondary' : 'text-gray-300 border-gray-200'"
          >
            <span v-if="isFavorite">❤️</span>
            <span v-else>🤍</span>
          </button>
          <button 
            @click.stop="toggleBlocked"
            class="p-1.5 rounded-full bg-white border hover:bg-gray-100 transition-colors"
            :class="isBlocked ? 'text-red-500 border-red-500' : 'text-gray-300 border-gray-200'"
          >
            🚫
          </button>
        </div>
      </div>

      <!-- Choices -->
      <div class="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        <button 
          v-for="(choice, index) in question.choices" 
          :key="index"
          @click="selectChoice(choice)"
          :disabled="showAnswer"
          class="p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group"
          :class="getChoiceClass(choice)"
        >
          <span class="font-medium text-lg relative z-10">{{ choice }}</span>
          
          <!-- Feedback Icon -->
          <span v-if="showAnswer && choice === question.correctAnswer" class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl z-10">✅</span>
          <span v-if="showAnswer && selectedChoice === choice && choice !== question.correctAnswer" class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl z-10">❌</span>
        </button>
      </div>

      <!-- Answer Detail -->
      <div v-if="showAnswer" class="bg-blue-50 p-6 border-t border-blue-100 animate-fade-in">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-blue-900 mb-1">Correct Answer:</h3>
            <p class="text-xl text-blue-800">{{ question.correctAnswer }}</p>
            <div class="mt-2 text-blue-700 text-sm space-y-1">
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
        <div class="mt-4 pt-4 border-t border-blue-200">
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

const props = defineProps<{
  question: any;
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
    return 'border-gray-200 hover:border-primary hover:bg-primary/5';
  }
  if (choice === props.question.correctAnswer) {
    return 'border-green-500 bg-green-50 text-green-900';
  }
  if (choice === props.selectedChoice) {
    return 'border-red-500 bg-red-50 text-red-900';
  }
  return 'border-gray-200 opacity-50';
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
