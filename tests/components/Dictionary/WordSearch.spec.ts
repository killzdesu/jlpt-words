import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WordSearch from '../../../app/components/Dictionary/WordSearch.vue'

// Mock useUserStore
const mockUpdateDictionarySettings = vi.fn()

vi.mock('~/stores/user', () => ({
    useUserStore: () => ({
        dictionarySettings: {
            levels: ['n5']
        },
        updateDictionarySettings: mockUpdateDictionarySettings
    })
}))

describe('WordSearch', () => {
    it('renders correctly', () => {
        const wrapper = mount(WordSearch)
        expect(wrapper.find('input').exists()).toBe(true)
        expect(wrapper.findAll('button').length).toBe(5) // 5 levels
    })

    it('emits search event on mount', () => {
        const wrapper = mount(WordSearch)
        expect(wrapper.emitted('search')).toBeTruthy()
        expect(wrapper.emitted('search')![0]).toEqual([{
            query: '',
            levels: ['n5']
        }])
    })

    it('emits search event when input changes', async () => {
        const wrapper = mount(WordSearch)
        const input = wrapper.find('input')
        await input.setValue('test')

        expect(wrapper.emitted('search')).toBeTruthy()
        // Last emit
        expect(wrapper.emitted('search')!.slice(-1)[0]).toEqual([{
            query: 'test',
            levels: ['n5']
        }])
    })

    it('toggles level and updates store', async () => {
        const wrapper = mount(WordSearch)
        const n5Button = wrapper.findAll('button').find(b => b.text() === 'N5')
        const n1Button = wrapper.findAll('button').find(b => b.text() === 'N1')

        // Toggle N5 off (it was on by default)
        await n5Button!.trigger('click')
        expect(mockUpdateDictionarySettings).toHaveBeenCalledWith({ levels: [] })
        expect(wrapper.emitted('search')!.slice(-1)[0]).toEqual([{
            query: '',
            levels: []
        }])

        // Toggle N1 on
        await n1Button!.trigger('click')
        expect(mockUpdateDictionarySettings).toHaveBeenCalledWith({ levels: ['n1'] })
        expect(wrapper.emitted('search')!.slice(-1)[0]).toEqual([{
            query: '',
            levels: ['n1']
        }])
    })
})
