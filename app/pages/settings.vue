<template>
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold text-primary mb-8 border-b pb-4">Settings</h1>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Application</h2>
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-600">Theme Color</span>
          <div class="flex gap-2">
            <div class="w-6 h-6 rounded-full bg-primary cursor-pointer ring-2 ring-offset-2 ring-primary"></div>
            <div class="w-6 h-6 rounded-full bg-secondary cursor-pointer"></div>
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">Currently fixed to Navy Blue & Soft Rose Pink.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Data Management</h2>
        <div class="space-y-4">
          <button @click="clearData" class="w-full py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
            Reset All Data (Favorites & Blocked)
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quiz Preferences</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <span class="text-gray-700">Show Reading (Furigana) in JP Quiz</span>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="userStore.settings.showFurigana" class="sr-only peer" @change="userStore.saveState">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <span class="text-gray-700">Show Meaning in Kanji Quiz</span>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="userStore.settings.showMeaning" class="sr-only peer" @change="userStore.saveState">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </label>
        </div>
      </section>

      <section class="pt-8 border-t">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Credits</h2>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-700 font-medium">Author: Jui Lims</p>
          <p class="text-gray-500 text-sm mt-1">JLPT Words & Quiz Application</p>
          <p class="text-gray-500 text-sm mt-1">Data source: JLPT Resources</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const clearData = () => {
  if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
    userStore.$reset();
    userStore.saveState();
    alert('Data reset successfully.');
  }
};
</script>
