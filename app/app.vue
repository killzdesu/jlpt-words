<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useHead } from '#app';

const userStore = useUserStore();

useHead({
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'icon', href: '/favicon.ico' }
  ],
  meta: [
    { name: 'theme-color', content: '#2D2363' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  ],
});

onMounted(() => {
  userStore.loadState();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
