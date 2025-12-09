<template>
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
    <h1 class="text-3xl font-bold text-primary mb-8 border-b pb-4">Settings</h1>

    <div class="space-y-8">
      <section>
        <h2 class="text-xl font-semibold text-text mb-4">Application</h2>
        <div class="flex items-center justify-between py-2">
          <span class="text-tertiary">Theme Color</span>
          <div class="flex gap-2">
            <div class="w-6 h-6 rounded-full bg-primary cursor-pointer ring-2 ring-offset-2 ring-primary"></div>
            <div class="w-6 h-6 rounded-full bg-secondary cursor-pointer"></div>
          </div>
        </div>
        <p class="text-sm text-tertiary mt-2">Currently fixed to Deep Royal Blue & Blush Pink.</p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-text mb-4">Data Management</h2>
        <div class="space-y-4">
          <button @click="clearData" class="w-full py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
            Reset All Data (Favorites & Blocked)
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-text mb-4">Quiz Preferences</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-neutral transition-colors">
            <span class="text-text">Show Reading (Furigana) in JP Quiz</span>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="userStore.settings.showFurigana" class="sr-only peer" @change="userStore.saveState">
              <div class="w-11 h-6 bg-neutral peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-tertiary/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-neutral transition-colors">
            <span class="text-text">Show Meaning in Kanji Quiz</span>
            <div class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="userStore.settings.showMeaning" class="sr-only peer" @change="userStore.saveState">
              <div class="w-11 h-6 bg-neutral peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-tertiary/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </label>
        </div>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-text mb-4">Dictionary Preference</h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-neutral transition-colors">
            <div>
              <span class="text-text block">Kanji Example Source</span>
              <span class="text-xs text-tertiary">Choose where to get example words for Kanji</span>
            </div>
            <div class="flex items-center gap-2 bg-neutral p-1 rounded-lg">
               <button 
                class="px-3 py-1 rounded-md text-sm font-medium transition-all"
                :class="(userStore.settings.kanjiExampleSource || 'jlpt') === 'jlpt' ? 'bg-white shadow text-primary' : 'text-tertiary hover:text-text'"
                @click.stop="userStore.updateSettings({ kanjiExampleSource: 'jlpt' })"
               >
                 JLPT (N5-N1)
               </button>
               <button 
                class="px-3 py-1 rounded-md text-sm font-medium transition-all"
                :class="userStore.settings.kanjiExampleSource === 'jpdb' ? 'bg-white shadow text-primary' : 'text-tertiary hover:text-text'"
                @click.stop="userStore.updateSettings({ kanjiExampleSource: 'jpdb' })"
               >
                 JPDB (200k+)
               </button>
            </div>
          </label>
        </div>
      </section>

      <section class="pt-8 border-t">
        <h2 class="text-xl font-semibold text-text mb-4">Credits</h2>
        <div class="bg-neutral p-4 rounded-lg">
          <p class="text-text font-medium">Author: Jui Lims</p>
          <p class="text-tertiary text-sm mt-1">JLPT Words & Quiz Application</p>
          <p class="text-tertiary text-sm mt-1">Data source: JLPT Resources</p>
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
