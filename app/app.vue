<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.loadState();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
