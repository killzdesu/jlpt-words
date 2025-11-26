import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        favorites: [] as string[],
        blocked: [] as string[],
        history: [] as any[], // Store answered questions
        settings: {
            quizCount: 10,
            quizType: 'jp-en',
            jlptLevels: ['n5'],
            onlyFavorites: false,
            excludeBlocked: true,
            showFurigana: true,
            showMeaning: true,
        },
    }),
    actions: {
        addToHistory(item: any) {
            this.history.unshift(item);
            if (this.history.length > 100) {
                this.history.pop(); // Keep last 100 items
            }
            this.saveState();
        },
        toggleFavorite(wordId: string) {
            if (this.favorites.includes(wordId)) {
                this.favorites = this.favorites.filter(id => id !== wordId);
            } else {
                this.favorites.push(wordId);
                this.blocked = this.blocked.filter(id => id !== wordId);
            }
            this.saveState();
        },
        toggleBlocked(wordId: string) {
            if (this.blocked.includes(wordId)) {
                this.blocked = this.blocked.filter(id => id !== wordId);
            } else {
                this.blocked.push(wordId);
                this.favorites = this.favorites.filter(id => id !== wordId);
            }
            this.saveState();
        },
        updateSettings(newSettings: Partial<typeof this.settings>) {
            this.settings = { ...this.settings, ...newSettings };
            this.saveState();
        },
        saveState() {
            if (import.meta.client) {
                localStorage.setItem('jlpt-user-store', JSON.stringify(this.$state));
            }
        },
        loadState() {
            if (import.meta.client) {
                const stored = localStorage.getItem('jlpt-user-store');
                if (stored) {
                    this.$state = JSON.parse(stored);
                }
            }
        }
    },
});
