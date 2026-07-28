import { test, expect } from '@nuxt/test-utils/playwright'
import { login } from './helpers/auth'

test.use({ storageState: './tests/e2e/.auth/user.json' })

test.describe('Editor', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('loads with editor layout', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    const firstCard = page.locator('[data-testid="resume-card"]').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await page.waitForURL('**/editor/**')
      await expect(page.locator('#editor-toolbar')).toBeVisible()
      await expect(page.locator('#editor-sections')).toBeVisible()
      await expect(page.locator('#editor-preview')).toBeVisible()
    }
  })

  test('section forms panel is navigable', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    const firstCard = page.locator('[data-testid="resume-card"]').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await page.waitForURL('**/editor/**')
      const sectionsPanel = page.locator('#editor-sections')
      await expect(sectionsPanel).toBeVisible()
      await expect(sectionsPanel.getByText(/personal/i)).toBeVisible()
    }
  })

  test('config panel is visible', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    const firstCard = page.locator('[data-testid="resume-card"]').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await page.waitForURL('**/editor/**')
      await expect(page.locator('#editor-configs')).toBeVisible()
    }
  })

  test('resume title is editable', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    const firstCard = page.locator('[data-testid="resume-card"]').first()
    if (await firstCard.isVisible()) {
      await firstCard.click()
      await page.waitForURL('**/editor/**')
      const titleInput = page.locator('#editor-toolbar input[type="text"]').first()
      await expect(titleInput).toBeVisible()
      await titleInput.clear()
      await titleInput.fill('My Updated Resume')
      await expect(titleInput).toHaveValue('My Updated Resume')
    }
  })
})
