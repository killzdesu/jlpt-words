import { test, expect } from '@playwright/test'

test.describe('Quiz Flow', () => {
    test('should navigate to quiz page', async ({ page }) => {
        await page.goto('/')

        // Wait for home page to load - check for the h1
        await expect(page.locator('h1')).toContainText('Master Japanese')

        // Click on Start Quiz link
        await page.click('a[href="/quiz"]')

        // Wait for quiz page to load - check for loading or QuizSetting component
        await expect(page).toHaveURL(/.*quiz/)
    })

    test('should start quiz and answer a question', async ({ page }) => {
        await page.goto('/quiz')

        // Wait for data to load (loading state might appear)
        await page.waitForTimeout(2000)

        // Click Start Quiz button (look for the button in QuizSetting component)
        const startButton = page.getByRole('button', { name: /start/i }).first()
        await startButton.click()

        // Wait for first question to appear
        await page.waitForTimeout(1000)

        // Check if we're in playing state by looking for "Question 1"
        const questionText = page.locator('text=/Question \\d+/')
        await expect(questionText).toBeVisible({ timeout: 10000 })

        // Click the first choice button in the grid
        const choiceButtons = page.locator('.grid button')
        const firstChoice = choiceButtons.first()
        await firstChoice.click()

        // Wait for answer to be shown
        await page.waitForTimeout(500)

        // Check if "Correct Answer" or answer details are shown
        const answerSection = page.locator('text=Correct Answer')
        await expect(answerSection).toBeVisible({ timeout: 5000 })
    })

    test('should complete quiz and show summary', async ({ page }) => {
        await page.goto('/quiz')

        // Wait for page to load
        await page.waitForTimeout(2000)

        // Set number of questions to 5
        const questionInput = page.locator('input[type="number"]')
        await questionInput.clear()
        await questionInput.fill('5')
        await page.waitForTimeout(1000)

        // Start quiz
        const startButton = page.getByRole('button', { name: /start/i }).first()
        await startButton.click()

        // Wait longer for quiz to start
        await page.waitForTimeout(2000)

        // Answer 5 questions
        for (let i = 0; i < 5; i++) {
            console.log(`Answering question ${i + 1}/5`)

            // Wait for Question X text to be visible
            const questionNum = page.locator(`text=/Question ${i + 1}/`)
            await expect(questionNum).toBeVisible({ timeout: 10000 })

            // Wait a bit after question appears
            await page.waitForTimeout(500)

            // Click first choice
            const choices = page.locator('.grid button')
            await choices.first().click()

            // Wait for answer to appear with longer timeout
            const answerSection = page.locator('text=Correct Answer')
            await expect(answerSection).toBeVisible({ timeout: 10000 })

            // Wait longer before clicking next (increased from 500ms to 1000ms)
            await page.waitForTimeout(1000)

            // Click Next button
            const nextButton = page.getByRole('button', { name: /next/i })
            await expect(nextButton).toBeVisible({ timeout: 5000 })
            await nextButton.click()

            // Wait after clicking next (increased from 500ms to 800ms)
            await page.waitForTimeout(800)
        }

        // Should show Quiz Summary after all questions
        await expect(page.locator('text=Quiz Complete')).toBeVisible({ timeout: 10000 })
    })
})
