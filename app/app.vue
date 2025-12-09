<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useHead } from '#app';
import { useJPDB } from '~/composables/useJPDB';
import Toast from '~/components/UI/Toast.vue';

const userStore = useUserStore();

// Initialize JPDB data on app start
const jpdb = useJPDB();

useHead({
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' },
    { rel: 'icon', href: '/favicon.ico' }
  ],
  meta: [
    { name: 'theme-color', content: '#1A1A7A' },
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
  <Toast />
</template>

