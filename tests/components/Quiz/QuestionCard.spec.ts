import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import QuestionCard from '../../../app/components/Quiz/QuestionCard.vue'

// Mock useUserStore
const mockToggleFavorite = vi.fn()
const mockToggleBlocked = vi.fn()

vi.mock('~/stores/user', () => ({
    useUserStore: () => ({
        favorites: ['fav-id'],
        blocked: ['block-id'],
        settings: {
            showFurigana: true,
            showMeaning: true
        },
        toggleFavorite: mockToggleFavorite,
        toggleBlocked: mockToggleBlocked
    })
}))

describe('QuestionCard', () => {
    const defaultProps = {
        question: {
            wordId: 'test-id',
            questionText: 'Test Question',
            choices: ['A', 'B', 'C', 'D'],
            correctAnswer: 'A',
            level: 'N5',
            type: 'jp-en',
            hint: 'Test Hint',
            detail: {
                reading: 'reading',
                meaning: 'meaning'
            }
        },
        currentNumber: 1,
        totalNumber: 10,
        showAnswer: false,
        selectedChoice: null
    }

    it('renders question text and progress', () => {
        const wrapper = shallowMount(QuestionCard, {
            props: defaultProps
        })

        expect(wrapper.text()).toContain('Test Question')
        expect(wrapper.text()).toContain('Question 1 / 10')
    })

    it('shows hint when shouldShowHint is true', () => {
        const wrapper = shallowMount(QuestionCard, {
            props: defaultProps
        })

        expect(wrapper.text()).toContain('Test Hint')
    })

    it('emits select event when selectChoice is called', async () => {
        const wrapper = shallowMount(QuestionCard, {
            props: defaultProps
        })

        // Call the selectChoice method directly
        await wrapper.vm.selectChoice('A')

        expect(wrapper.emitted('select')).toBeTruthy()
        expect(wrapper.emitted('select')![0]).toEqual(['A'])
    })

    it('shows answer details when showAnswer is true', () => {
        const wrapper = shallowMount(QuestionCard, {
            props: {
                ...defaultProps,
                showAnswer: true,
                selectedChoice: 'B'
            }
        })

        expect(wrapper.text()).toContain('Correct Answer:')
        expect(wrapper.text()).toContain('reading')
        expect(wrapper.text()).toContain('meaning')
    })

    it('does not emit select when showAnswer is true', async () => {
        const wrapper = shallowMount(QuestionCard, {
            props: {
                ...defaultProps,
                showAnswer: true
            }
        })

        await wrapper.vm.selectChoice('A')

        expect(wrapper.emitted('select')).toBeFalsy()
    })
})
