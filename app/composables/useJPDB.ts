/**
 * JPDB Composable
 * Provides word frequency data with automatic caching via IndexedDB
 */

import { ref, readonly } from 'vue';
import {
    initDB,
    getFrequency as dbGetFrequency,
    getFrequencies as dbGetFrequencies,
    hasData,
    clearData,
    getCount
} from '~/services/jpdb-db';

const VERSION_KEY = 'jpdb-version';

// Shared state across all component instances
const isReady = ref(false);
const isLoading = ref(false);
const loadingStatus = ref('');
const loadingProgress = ref(0);
const error = ref<string | null>(null);
const entryCount = ref(0);

// In-memory cache for frequently accessed words
const frequencyCache = new Map<string, number | null>();

let initPromise: Promise<void> | null = null;

/**
 * Check version and initialize JPDB data
 */
async function initialize(): Promise<void> {
    // Skip on server-side
    if (typeof window === 'undefined') return;

    // Prevent multiple simultaneous initializations
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            isLoading.value = true;
            error.value = null;

            // Check current version (browser only)
            const storedVersion = localStorage.getItem(VERSION_KEY);

            // Fetch latest version
            let latestVersion: string;
            try {
                const response = await fetch('/JPDB/version.json');
                latestVersion = (await response.text()).trim();
            } catch {
                // If we can't fetch version but have data, use cached data
                if (storedVersion && await hasData()) {
                    isReady.value = true;
                    entryCount.value = await getCount();
                    return;
                }
                throw new Error('Failed to fetch JPDB version');
            }

            // Check if we need to update
            const needsUpdate = !storedVersion || storedVersion !== latestVersion || !(await hasData());

            if (!needsUpdate) {
                // Data is up to date
                isReady.value = true;
                entryCount.value = await getCount();
                return;
            }

            // Clear old data if version changed
            if (storedVersion && storedVersion !== latestVersion) {
                loadingStatus.value = 'Updating database...';
                await clearData();
                frequencyCache.clear();
            }

            // Load data via Web Worker
            await loadDataViaWorker();

            // Store new version
            localStorage.setItem(VERSION_KEY, latestVersion);
            isReady.value = true;
            entryCount.value = await getCount();

        } catch (e) {
            error.value = e instanceof Error ? e.message : String(e);
            console.error('JPDB initialization failed:', e);
        } finally {
            isLoading.value = false;
            loadingStatus.value = '';
            loadingProgress.value = 0;
        }
    })();

    return initPromise;
}

/**
 * Load data using Web Worker
 */
function loadDataViaWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('/workers/jpdb-worker.js');

        worker.onmessage = (event) => {
            const { type, message, percentage, count } = event.data;

            switch (type) {
                case 'status':
                    loadingStatus.value = message;
                    break;
                case 'progress':
                    loadingProgress.value = percentage;
                    break;
                case 'complete':
                    entryCount.value = count;
                    worker.terminate();
                    resolve();
                    break;
                case 'error':
                    worker.terminate();
                    reject(new Error(message));
                    break;
            }
        };

        worker.onerror = (e) => {
            worker.terminate();
            reject(new Error(e.message));
        };

        worker.postMessage({ action: 'load' });
    });
}

/**
 * Get frequency for a single word
 */
async function getFrequency(word: string): Promise<number | null> {
    // Check cache first
    if (frequencyCache.has(word)) {
        return frequencyCache.get(word) ?? null;
    }

    // Ensure DB is ready
    await initDB();

    const freq = await dbGetFrequency(word);
    frequencyCache.set(word, freq);
    return freq;
}

/**
 * Get frequencies for multiple words (batch operation)
 */
async function getFrequencies(words: string[]): Promise<Map<string, number>> {
    await initDB();

    // Check which words need DB lookup
    const uncached: string[] = [];
    const results = new Map<string, number>();

    for (const word of words) {
        if (frequencyCache.has(word)) {
            const freq = frequencyCache.get(word);
            if (freq !== null && freq !== undefined) {
                results.set(word, freq);
            }
        } else {
            uncached.push(word);
        }
    }

    // Fetch uncached words
    if (uncached.length > 0) {
        const dbResults = await dbGetFrequencies(uncached);
        for (const [word, freq] of dbResults) {
            frequencyCache.set(word, freq);
            results.set(word, freq);
        }
        // Cache misses too
        for (const word of uncached) {
            if (!dbResults.has(word)) {
                frequencyCache.set(word, null);
            }
        }
    }

    return results;
}

/**
 * Force reload data (useful for debugging)
 */
async function forceReload(): Promise<void> {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(VERSION_KEY);
    await clearData();
    frequencyCache.clear();
    isReady.value = false;
    initPromise = null;
    await initialize();
}

export function useJPDB() {
    // Start initialization on first use (browser only)
    if (typeof window !== 'undefined' && !initPromise && !isReady.value) {
        initialize();
    }

    return {
        isReady: readonly(isReady),
        isLoading: readonly(isLoading),
        loadingStatus: readonly(loadingStatus),
        loadingProgress: readonly(loadingProgress),
        error: readonly(error),
        entryCount: readonly(entryCount),
        getFrequency,
        getFrequencies,
        forceReload,
        initialize
    };
}
