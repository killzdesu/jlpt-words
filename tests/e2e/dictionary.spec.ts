import { test, expect } from '@playwright/test'

test.describe('Dictionary Search', () => {
    test('should navigate to dictionary page', async ({ page }) => {
        await page.goto('/')

        // Click on Dictionary link
        await page.click('a[href="/dictionary"]')

        // Wait for dictionary page to load
        await expect(page).toHaveURL(/.*dictionary/)

        // Wait for page to load data
        await page.waitForTimeout(1500)

        // Check if search input is visible
        const searchInput = page.locator('input[type="text"]')
        await expect(searchInput).toBeVisible()
    })

    test('should search for a word', async ({ page }) => {
        await page.goto('/dictionary')

        // Wait for data to load
        await page.waitForTimeout(2000)

        // Deselect all levels except N3
        // By default N5 is selected, so we need to click it to deselect
        const n5Button = page.getByRole('button').filter({ hasText: 'N5' })
        await n5Button.click()
        await page.waitForTimeout(300)

        // Select only N3
        const n3Button = page.getByRole('button').filter({ hasText: 'N3' })
        await n3Button.click()
        await page.waitForTimeout(300)

        // Type in search input
        const searchInput = page.locator('input[type="text"]')
        await searchInput.fill('日本')

        // Wait for search results
        await page.waitForTimeout(1000)

        // Check that results text is shown (Found X words)
        const resultsText = page.locator('text=/Found \\d+ words/')
        await expect(resultsText).toBeVisible()

        // Results should be visible (WordResult components use bg-white rounded-lg)
        const results = page.locator('.bg-white.rounded-lg')
        const count = await results.count()

        // Should have at least one result
        expect(count).toBeGreaterThan(0)
    })

    test('should filter by JLPT level', async ({ page }) => {
        await page.goto('/dictionary')

        // Wait for data to load
        await page.waitForTimeout(1500)

        // Find and click N5 button
        const levelButtons = page.getByRole('button')
        const n5Button = levelButtons.filter({ hasText: 'N5' })

        // Check if button exists and has the active class
        await expect(n5Button).toBeVisible()

        // Button should have bg-primary class indicating it's selected
        const classes = await n5Button.getAttribute('class')
        expect(classes).toContain('bg-primary')
    })

    test('should search using English', async ({ page }) => {
        await page.goto('/dictionary')

        // Wait for data to load
        await page.waitForTimeout(2000)

        // Type English word
        const searchInput = page.locator('input[type="text"]')
        await searchInput.fill('Japan')

        // Wait for search
        await page.waitForTimeout(1000)

        // Should have results counter visible
        const resultsText = page.locator('text=/Found \\d+ words/')
        await expect(resultsText).toBeVisible()
    })
})
