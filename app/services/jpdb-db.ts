/**
 * JPDB IndexedDB Service
 * Handles local storage of word frequency data
 */

const DB_NAME = 'jpdb-db';
const DB_VERSION = 1;
const STORE_NAME = 'frequencies';

export interface JPDBEntry {
    word: string;
    reading: string;
    frequency: number;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize and get the database instance
 */
export async function initDB(): Promise<IDBDatabase> {
    if (dbInstance) return dbInstance;

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(dbInstance);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create store with word as key
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'word' });
                store.createIndex('reading', 'reading', { unique: false });
            }
        };
    });
}

/**
 * Get frequency for a word
 */
export async function getFrequency(word: string): Promise<number | null> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(word);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const result = request.result as JPDBEntry | undefined;
            resolve(result?.frequency ?? null);
        };
    });
}

/**
 * Get multiple frequencies at once (batch lookup)
 */
export async function getFrequencies(words: string[]): Promise<Map<string, number>> {
    const db = await initDB();
    const results = new Map<string, number>();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        let completed = 0;

        for (const word of words) {
            const request = store.get(word);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = request.result as JPDBEntry | undefined;
                if (result) {
                    results.set(word, result.frequency);
                }
                completed++;
                if (completed === words.length) {
                    resolve(results);
                }
            };
        }

        // Handle empty array case
        if (words.length === 0) {
            resolve(results);
        }
    });
}

/**
 * Insert entries in bulk (used by worker)
 */
export async function insertEntries(entries: JPDBEntry[]): Promise<void> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        transaction.onerror = () => reject(transaction.error);
        transaction.oncomplete = () => resolve();

        for (const entry of entries) {
            store.put(entry);
        }
    });
}

/**
 * Clear all data (used for version updates)
 */
export async function clearData(): Promise<void> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

/**
 * Check if database has data
 */
export async function hasData(): Promise<boolean> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.count();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result > 0);
    });
}

/**
 * Get entry count
 */
export async function getCount(): Promise<number> {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.count();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}
