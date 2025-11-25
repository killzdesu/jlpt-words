<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
    <header class="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span class="text-3xl">🇯🇵</span>
          <span>JLPT Master</span>
        </NuxtLink>
        <nav class="hidden md:flex space-x-6">
          <NuxtLink to="/quiz" class="hover:text-secondary transition-colors font-medium">Quiz</NuxtLink>
          <NuxtLink to="/dictionary" class="hover:text-secondary transition-colors font-medium">Dictionary</NuxtLink>
          <NuxtLink to="/words" class="hover:text-secondary transition-colors font-medium">Word List</NuxtLink>
          <NuxtLink to="/settings" class="hover:text-secondary transition-colors font-medium">Settings</NuxtLink>
        </nav>
        <!-- Mobile Menu Button (Placeholder) -->
        <button class="md:hidden text-2xl">
          ☰
        </button>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-gray-800 text-gray-400 py-6 text-center text-sm">
      <p>&copy; {{ new Date().getFullYear() }} Jui Lims. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-secondary;
}
</style>
