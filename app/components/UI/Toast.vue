<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto max-w-sm w-full bg-white rounded-lg shadow-lg border overflow-hidden"
          :class="borderClass(toast.type)"
        >
          <div class="flex items-start gap-3 p-4">
            <div class="flex-shrink-0">
              <Icon 
                :name="iconName(toast.type)" 
                class="w-5 h-5"
                :class="iconClass(toast.type)"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text">
                {{ toast.message }}
              </p>
            </div>
            <button
              @click="removeToast(toast.id)"
              class="flex-shrink-0 p-1 rounded-full hover:bg-neutral transition-colors"
            >
              <Icon name="mingcute:close-line" class="w-4 h-4 text-tertiary" />
            </button>
          </div>
          <div 
            class="h-1 transition-all duration-300"
            :class="progressClass(toast.type)"
            :style="{ 
              animation: `shrink ${toast.duration}ms linear forwards`
            }"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '~/composables/useToast';

const { toasts, removeToast } = useToast();

function iconName(type: ToastType): string {
  const icons: Record<ToastType, string> = {
    success: 'mingcute:check-circle-fill',
    error: 'mingcute:close-circle-fill',
    warning: 'mingcute:alert-fill',
    info: 'mingcute:information-fill'
  };
  return icons[type];
}

function iconClass(type: ToastType): string {
  const classes: Record<ToastType, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };
  return classes[type];
}

function borderClass(type: ToastType): string {
  const classes: Record<ToastType, string> = {
    success: 'border-green-200',
    error: 'border-red-200',
    warning: 'border-amber-200',
    info: 'border-blue-200'
  };
  return classes[type];
}

function progressClass(type: ToastType): string {
  const classes: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  return classes[type];
}
</script>

<style scoped>
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
