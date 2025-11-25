<template>
  <div class="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
    <h2 class="text-2xl font-bold text-primary mb-6">Quiz Settings</h2>
    
    <div class="space-y-6">
      <!-- Number of Questions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
        <input 
          v-model.number="settings.quizCount" 
          type="number" 
          min="5" 
          max="50" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
        />
      </div>

      <!-- Quiz Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Quiz Type</label>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors" :class="settings.quizType === 'jp-en' ? 'border-primary bg-primary/5' : 'border-gray-200'">
            <input type="radio" v-model="settings.quizType" value="jp-en" class="text-primary focus:ring-primary" />
            <span>🇯🇵-🇺🇸 Japanese Quiz</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors" :class="settings.quizType === 'en-jp' ? 'border-primary bg-primary/5' : 'border-gray-200'">
            <input type="radio" v-model="settings.quizType" value="en-jp" class="text-primary focus:ring-primary" />
            <span>🇺🇸-🇯🇵 English Quiz</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors" :class="settings.quizType === 'kanji-reading' ? 'border-primary bg-primary/5' : 'border-gray-200'">
            <input type="radio" v-model="settings.quizType" value="kanji-reading" class="text-primary focus:ring-primary" />
            <span>🈳 Kanji Quiz</span>
          </label>
        </div>
      </div>

      <!-- JLPT Levels -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">JLPT Levels</label>
        <div class="flex flex-wrap gap-3">
          <label 
            v-for="level in ['n1', 'n2', 'n3', 'n4', 'n5']" 
            :key="level"
            class="cursor-pointer"
          >
            <input type="checkbox" :value="level" v-model="settings.jlptLevels" class="hidden" />
            <span 
              class="inline-block px-4 py-2 rounded-full border text-sm font-medium transition-all select-none"
              :class="settings.jlptLevels.includes(level) 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
            >
              {{ level.toUpperCase() }}
            </span>
          </label>
        </div>
        <p v-if="settings.jlptLevels.length === 0" class="text-red-500 text-xs mt-1">Please select at least one level.</p>
      </div>

      <!-- Options -->
      <div class="space-y-3">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" v-model="settings.onlyFavorites" class="rounded text-primary focus:ring-primary" />
          <span class="text-gray-700">Only Favorites</span>
        </label>
        <label class="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" v-model="settings.excludeBlocked" class="rounded text-primary focus:ring-primary" />
          <span class="text-gray-700">Exclude Blocked Words</span>
        </label>
      </div>

      <button 
        @click="startQuiz"
        :disabled="!isValid"
        class="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Start Quiz
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '~/stores/user';

const emit = defineEmits(['start']);
const userStore = useUserStore();

// Local state initialized from store
const settings = ref({ ...userStore.settings });

// Watch for changes and update store
watch(settings, (newSettings) => {
  userStore.updateSettings(newSettings);
}, { deep: true });

const isValid = computed(() => {
  return settings.value.jlptLevels.length > 0 && settings.value.quizCount > 0;
});

const startQuiz = () => {
  if (isValid.value) {
    emit('start');
  }
};
</script>
