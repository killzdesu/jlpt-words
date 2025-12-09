<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-bold text-text">
          <slot name="title">Modal Title</slot>
        </h3>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center hover:bg-neutral rounded-full transition-colors text-tertiary hover:text-text"
        >
          <Icon name="mingcute:close-line" size="20" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-4 overflow-y-auto">
        <slot></slot>
      </div>

      <!-- Footer (Optional) -->
      <div v-if="$slots.footer" class="p-4 border-t bg-neutral/30">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

defineEmits(['close']);
</script>
