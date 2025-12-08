import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useWords } from '../../../app/composables/useWords'

// Mock global fetch
global.fetch = vi.fn()

// Mock csvParser
vi.mock('~/utils/csvParser', () => ({
    parseCSV: vi.fn((text) => {
        // Simple mock implementation that returns an array based on input
        if (text.includes('expression')) {
            return Promise.resolve([
                { expression: 'test', reading: 'tesuto', meaning: 'test meaning', tags: 'n5' }
            ])
        }
        if (text.includes('kanji')) {
            return Promise.resolve([
                { kanji: '日', on: 'nich', kun: 'hi', meanings: 'day', jlpt: '5' }
            ])
        }
        return Promise.resolve([])
    })
}))

describe('useWords', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes with empty state', () => {
        const { words, loading, error } = useWords()
        expect(words.value).toEqual([])
        expect(loading.value).toBe(false)
        expect(error.value).toBe(null)
    })

    it('loadWords fetches and parses data', async () => {
        const { words, loadWords, loading } = useWords()

            // Mock fetch response
            ; (global.fetch as any).mockResolvedValue({
                ok: true,
                text: () => Promise.resolve('expression,reading,meaning,tags\ntest,tesuto,test meaning,n5'),
            })

        const promise = loadWords()
        expect(loading.value).toBe(true)
        await promise
        expect(loading.value).toBe(false)

        expect(words.value.length).toBeGreaterThan(0)
        expect(words.value[0]).toMatchObject({
            word: 'test',
            reading: 'tesuto',
            meaning: 'test meaning',
            level: 'N1', // Because the loop goes through n1..n5 and we mock the response for all calls. 
            // Actually, the mock response is the same for all calls, so it will add the same word 5 times with different levels?
            // Wait, the loop is: for (const level of levels) ...
            // And we push to allWords.
            // The level in the object comes from the loop variable `level`.
            // So we expect 5 items if fetch succeeds for all 5 levels.
        })
    })

    it('loadKanji fetches and parses data', async () => {
        const { kanjiList, loadKanji } = useWords()

            ; (global.fetch as any).mockResolvedValue({
                ok: true,
                text: () => Promise.resolve('kanji,on,kun,meanings,jlpt\n日,nich,hi,day,5')
            })

        await loadKanji()
        expect(kanjiList.value.length).toBe(1)
        expect(kanjiList.value[0]).toMatchObject({
            kanji: '日',
            meaning: 'day',
            level: 'N5'
        })
    })
})
