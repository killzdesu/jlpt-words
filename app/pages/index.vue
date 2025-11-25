<template>
  <div class="flex flex-col items-center justify-center space-y-12 py-12">
    <div class="text-center space-y-4 max-w-2xl">
      <h1 class="text-5xl font-extrabold text-primary tracking-tight">
        Master Japanese <span class="text-secondary">Effortlessly</span>
      </h1>
      <p class="text-xl text-gray-600 leading-relaxed">
        Prepare for the JLPT with our comprehensive quiz and dictionary tools. 
        Practice words, kanji, and track your progress.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
      <NuxtLink to="/quiz" class="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center">
        <div class="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl z-0"></div>
        <span class="text-4xl mb-1 relative z-10">🎯</span>
        <h2 class="text-xl font-bold text-gray-800 relative z-10">Start Quiz</h2>
        <p class="text-sm text-gray-500 relative z-10">Test your knowledge</p>
      </NuxtLink>

      <NuxtLink to="/history" class="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center">
        <div class="absolute inset-0 bg-secondary/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl z-0"></div>
        <span class="text-4xl mb-1 relative z-10">📜</span>
        <h2 class="text-xl font-bold text-gray-800 relative z-10">History</h2>
        <p class="text-sm text-gray-500 relative z-10">Review past questions</p>
      </NuxtLink>

      <NuxtLink to="/dictionary" class="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center">
        <div class="absolute inset-0 bg-secondary/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl z-0"></div>
        <span class="text-4xl mb-1 relative z-10">📖</span>
        <h2 class="text-xl font-bold text-gray-800 relative z-10">Dictionary</h2>
        <p class="text-sm text-gray-500 relative z-10">Search words & kanji</p>
      </NuxtLink>

      <NuxtLink to="/words" class="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center">
        <div class="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl z-0"></div>
        <span class="text-4xl mb-1 relative z-10">⭐</span>
        <h2 class="text-xl font-bold text-gray-800 relative z-10">Word List</h2>
        <p class="text-sm text-gray-500 relative z-10">Favorites & Blocked</p>
      </NuxtLink>

      <NuxtLink to="/settings" class="col-span-1 sm:col-span-2 group relative overflow-hidden bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-center gap-3">
        <div class="absolute inset-0 bg-gray-50 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-2xl z-0"></div>
        <span class="text-2xl relative z-10">⚙️</span>
        <span class="font-medium text-gray-700 relative z-10">Settings</span>
      </NuxtLink>
    </div>

    <div class="mt-8 text-center">
      <p class="text-xs text-gray-400">v1.0.1</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Home - JLPT Master',
  meta: [
    { name: 'description', content: 'Japanese learning application for JLPT preparation.' }
  ]
})
</script>
