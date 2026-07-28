import type { Page } from '@playwright/test'

export async function login(page: Page) {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  if (!email || !password) {
    throw new Error('E2E_EMAIL and E2E_PASSWORD env vars are required for auth tests')
  }

  await page.goto('/login', { waitUntil: 'hydration' })
  await page.getByLabel('Email Address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/dashboard')
}
