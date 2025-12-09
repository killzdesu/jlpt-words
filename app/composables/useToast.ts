/**
 * Toast Notification Composable
 * Provides app-wide toast notifications
 */

import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 1;

/**
 * Show a toast notification
 */
function showToast(message: string, type: ToastType = 'info', duration = 3000): number {
    const id = nextId++;

    toasts.value.push({
        id,
        message,
        type,
        duration
    });

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }

    return id;
}

/**
 * Remove a toast by ID
 */
function removeToast(id: number): void {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
        toasts.value.splice(index, 1);
    }
}

/**
 * Clear all toasts
 */
function clearToasts(): void {
    toasts.value = [];
}

// Convenience methods
const success = (message: string, duration?: number) => showToast(message, 'success', duration);
const error = (message: string, duration?: number) => showToast(message, 'error', duration);
const info = (message: string, duration?: number) => showToast(message, 'info', duration);
const warning = (message: string, duration?: number) => showToast(message, 'warning', duration);

export function useToast() {
    return {
        toasts: readonly(toasts),
        showToast,
        removeToast,
        clearToasts,
        success,
        error,
        info,
        warning
    };
}
