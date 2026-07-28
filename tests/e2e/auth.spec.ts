import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Auth flows', () => {
  test.describe('Login page', () => {
    test('renders email and password fields', async ({ page }) => {
      await page.goto('/login', { waitUntil: 'hydration' })
      await expect(page.getByLabel('Email Address')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('shows validation error on empty submission', async ({ page }) => {
      await page.goto('/login', { waitUntil: 'hydration' })
      await page.getByRole('button', { name: /sign in/i }).click()
      await expect(page.getByText(/please enter your email/i)).toBeVisible()
    })

    test('shows error on invalid credentials', async ({ page }) => {
      await page.goto('/login', { waitUntil: 'hydration' })
      await page.getByLabel('Email Address').fill('invalid@example.com')
      await page.getByLabel('Password').fill('wrongpassword')
      await page.getByRole('button', { name: /sign in/i }).click()
      await expect(page.locator('[role="alert"]')).toBeVisible()
    })

    test('has link to register page', async ({ page }) => {
      await page.goto('/login', { waitUntil: 'hydration' })
      const registerLink = page.getByRole('link', { name: /sign up for free/i })
      await expect(registerLink).toBeVisible()
      await expect(registerLink).toHaveAttribute('href', '/register')
    })

    test('has link to forgot password page', async ({ page }) => {
      await page.goto('/login', { waitUntil: 'hydration' })
      const forgotLink = page.getByRole('link', { name: /forgot password/i })
      await expect(forgotLink).toBeVisible()
      await expect(forgotLink).toHaveAttribute('href', '/forgot-password')
    })
  })

  test.describe('Register page', () => {
    test('renders all required fields', async ({ page }) => {
      await page.goto('/register', { waitUntil: 'hydration' })
      await expect(page.getByLabel('Email Address')).toBeVisible()
      await expect(page.getByLabel('Password')).toBeVisible()
      await expect(page.getByLabel('Confirm Password')).toBeVisible()
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    test('shows error when passwords do not match', async ({ page }) => {
      await page.goto('/register', { waitUntil: 'hydration' })
      await page.getByLabel('Email Address').fill('test@example.com')
      await page.getByLabel('Password').fill('password123')
      await page.getByLabel('Confirm Password').fill('different456')
      await page.getByRole('button', { name: /create account/i }).click()
      await expect(page.locator('[role="alert"]')).toBeVisible()
    })

    test('has link to login page', async ({ page }) => {
      await page.goto('/register', { waitUntil: 'hydration' })
      const loginLink = page.getByRole('link', { name: /sign in here/i })
      await expect(loginLink).toBeVisible()
      await expect(loginLink).toHaveAttribute('href', '/login')
    })
  })

  test.describe('Forgot password page', () => {
    test('renders email field and submit button', async ({ page }) => {
      await page.goto('/forgot-password', { waitUntil: 'hydration' })
      await expect(page.getByLabel('Email Address')).toBeVisible()
      await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
    })

    test('shows error on empty submission', async ({ page }) => {
      await page.goto('/forgot-password', { waitUntil: 'hydration' })
      await page.getByRole('button', { name: /send/i }).click()
      await expect(page.locator('[role="alert"]')).toBeVisible()
    })
  })
})
