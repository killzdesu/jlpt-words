/**
 * JPDB Web Worker
 * Fetches, decompresses, and parses JPDB data, then inserts into IndexedDB
 */

const DB_NAME = 'jpdb-db';
const DB_VERSION = 1;
const STORE_NAME = 'frequencies';

// Initialize IndexedDB in worker context
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'word' });
                store.createIndex('reading', 'reading', { unique: false });
            }
        };
    });
}

// Insert entries in chunks to avoid blocking
async function insertEntriesChunked(db, entries, chunkSize = 5000) {
    const totalChunks = Math.ceil(entries.length / chunkSize);

    for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        const currentChunk = Math.floor(i / chunkSize) + 1;

        await new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            transaction.onerror = () => reject(transaction.error);
            transaction.oncomplete = () => resolve();

            for (const entry of chunk) {
                store.put(entry);
            }
        });

        // Report progress
        self.postMessage({
            type: 'progress',
            current: currentChunk,
            total: totalChunks,
            percentage: Math.round((currentChunk / totalChunks) * 100)
        });
    }
}

// Main worker logic
self.onmessage = async (event) => {
    const { action } = event.data;

    if (action === 'load') {
        try {
            self.postMessage({ type: 'status', message: 'Fetching JPDB data...' });

            // Fetch data from server API route (handles brotli decompression)
            const response = await fetch('/api/jpdb');

            if (!response.ok) {
                throw new Error(`Failed to fetch JPDB data: ${response.status}`);
            }

            self.postMessage({ type: 'status', message: 'Parsing data...' });

            // Parse JSON - browser already decompressed brotli
            const data = await response.json();

            // Data format: [headers, [[word, reading, freq, value], ...]]
            const rawEntries = data[1];

            // Transform to our format
            const entries = rawEntries.map(([word, reading, frequency]) => ({
                word,
                reading,
                frequency
            }));

            self.postMessage({
                type: 'status',
                message: `Storing ${entries.length.toLocaleString()} entries...`
            });

            // Initialize DB and insert
            const db = await initDB();
            await insertEntriesChunked(db, entries);

            self.postMessage({
                type: 'complete',
                count: entries.length
            });

        } catch (error) {
            self.postMessage({
                type: 'error',
                message: error instanceof Error ? error.message : String(error)
            });
        }
    }
};
