import { test, expect } from '@nuxt/test-utils/playwright'
import { login } from './helpers/auth'

test.use({ storageState: './tests/e2e/.auth/user.json' })

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('loads showing resume list or empty state', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    await expect(page.getByText(/my resumes/i)).toBeVisible()
    const hasCards = await page.locator('[data-testid="resume-card"]').count()
    const hasEmpty = await page.getByText(/create your first/i).isVisible().catch(() => false)
    expect(hasCards > 0 || hasEmpty).toBeTruthy()
  })

  test('create resume button opens template selection', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    await page.getByRole('button', { name: /create/i }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('resume card shows title and actions menu', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'hydration' })
    const firstCard = page.locator('[data-testid="resume-card"]').first()
    if (await firstCard.isVisible()) {
      await expect(firstCard).toBeVisible()
      await firstCard.getByRole('button').last().click()
      await expect(page.getByText(/duplicate/i)).toBeVisible()
      await expect(page.getByText(/delete/i)).toBeVisible()
    }
  })
})
