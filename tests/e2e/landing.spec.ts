import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Landing page', () => {
  test('loads with hero section visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'hydration' })
    await expect(page.locator('section').first()).toBeVisible()
    await expect(page.getByText(/résumé builder/i)).toBeVisible()
  })

  test('has try demo CTA linking to /try', async ({ page }) => {
    await page.goto('/', { waitUntil: 'hydration' })
    const tryLink = page.getByRole('link', { name: /try demo/i })
    await expect(tryLink).toBeVisible()
    await expect(tryLink).toHaveAttribute('href', '/try')
  })

  test('has build CTA linking to /dashboard', async ({ page }) => {
    await page.goto('/', { waitUntil: 'hydration' })
    const buildLink = page.getByRole('link', { name: /build my résumé/i }).first()
    await expect(buildLink).toBeVisible()
    await expect(buildLink).toHaveAttribute('href', '/dashboard')
  })

  test('renders features section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'hydration' })
    await expect(page.getByText(/refined templates/i)).toBeVisible()
    await expect(page.getByText(/drag & drop/i)).toBeVisible()
    await expect(page.getByText(/pixel-perfect pdf/i)).toBeVisible()
  })

  test('renders CTA section at bottom', async ({ page }) => {
    await page.goto('/', { waitUntil: 'hydration' })
    await expect(page.getByText(/start your résumé/i)).toBeVisible()
    await expect(page.getByText(/land the job/i)).toBeVisible()
  })
})
