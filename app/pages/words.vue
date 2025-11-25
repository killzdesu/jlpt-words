<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold text-primary">My Words</h1>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button 
        @click="activeTab = 'favorites'"
        class="px-6 py-3 font-medium text-sm transition-colors border-b-2"
        :class="activeTab === 'favorites' 
          ? 'border-primary text-primary' 
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Favorites ({{ favoriteWords.length }})
      </button>
      <button 
        @click="activeTab = 'blocked'"
        class="px-6 py-3 font-medium text-sm transition-colors border-b-2"
        :class="activeTab === 'blocked' 
          ? 'border-red-500 text-red-500' 
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Blocked ({{ blockedWords.length }})
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin text-4xl">⏳</div>
      <p class="mt-2 text-gray-500">Loading words...</p>
    </div>

    <div v-else class="space-y-4">
      <div v-if="activeTab === 'favorites'">
        <div v-if="favoriteWords.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p class="text-gray-500">You haven't added any words to favorites yet.</p>
          <NuxtLink to="/dictionary" class="text-primary hover:underline mt-2 inline-block">Go to Dictionary</NuxtLink>
        </div>
        <div v-else class="grid gap-4">
          <WordResult 
            v-for="word in favoriteWords" 
            :key="word.id" 
            :word="word" 
          />
        </div>
      </div>

      <div v-if="activeTab === 'blocked'">
        <div v-if="blockedWords.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p class="text-gray-500">You haven't blocked any words yet.</p>
        </div>
        <div v-else class="grid gap-4">
          <WordResult 
            v-for="word in blockedWords" 
            :key="word.id" 
            :word="word" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useWords } from '~/composables/useWords';
import WordResult from '~/components/Dictionary/WordResult.vue';

const activeTab = ref<'favorites' | 'blocked'>('favorites');
const userStore = useUserStore();
const { words, loading, loadWords } = useWords();

onMounted(() => {
  loadWords();
});

const favoriteWords = computed(() => {
  if (!words.value) return [];
  return words.value.filter(w => userStore.favorites.includes(w.id));
});

const blockedWords = computed(() => {
  if (!words.value) return [];
  return words.value.filter(w => userStore.blocked.includes(w.id));
});

useHead({
  title: 'My Words - JLPT Master'
});
</script>
