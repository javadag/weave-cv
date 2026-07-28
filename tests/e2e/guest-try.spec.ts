import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Guest try mode', () => {
  test('loads with editor layout', async ({ page }) => {
    await page.goto('/try', { waitUntil: 'hydration' })
    await expect(page.locator('#editor-toolbar')).toBeVisible()
  })

  test('shows guest CTA banner', async ({ page }) => {
    await page.goto('/try', { waitUntil: 'hydration' })
    await expect(page.getByText(/sign up/i).first()).toBeVisible()
  })

  test('resume preview renders', async ({ page }) => {
    await page.goto('/try', { waitUntil: 'hydration' })
    await expect(page.locator('#editor-preview')).toBeVisible()
  })

  test('section forms are visible', async ({ page }) => {
    await page.goto('/try', { waitUntil: 'hydration' })
    await expect(page.locator('#editor-sections')).toBeVisible()
  })
})
