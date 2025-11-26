<template>
  <div class="min-h-screen bg-neutral flex flex-col font-sans text-text">
    <header class="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight flex items-center gap-2">
          <img src="/pwa-192x192.png" alt="Logo" class="w-8 h-8 rounded-full bg-white p-0.5" />
          <span>JLPT Words</span>
        </NuxtLink>
        <nav class="hidden md:flex space-x-6">
          <NuxtLink to="/quiz" class="hover:text-secondary transition-colors font-medium">Quiz</NuxtLink>
          <NuxtLink to="/dictionary" class="hover:text-secondary transition-colors font-medium">Dictionary</NuxtLink>
          <NuxtLink to="/words" class="hover:text-secondary transition-colors font-medium">Word List</NuxtLink>
          <NuxtLink to="/settings" class="hover:text-secondary transition-colors font-medium">Settings</NuxtLink>
        </nav>
        <!-- Mobile Menu Button (Placeholder) -->
        <button class="md:hidden text-2xl hidden">
          ☰
        </button>
        <!-- To Do: Mobile Menu -->
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-4 md:py-8">
      <slot />
    </main>

    <footer class="bg-text text-neutral py-2 md:py-4 text-center text-sm">
      <p>&copy; {{ new Date().getFullYear() }} Jui Lims. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-secondary;
}
</style>
