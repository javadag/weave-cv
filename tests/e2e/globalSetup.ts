import { chromium } from '@playwright/test'
import { resolve } from 'node:path'

const authDir = resolve(__dirname, '.auth')
const authFile = resolve(authDir, 'user.json')

async function globalSetup() {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  if (!email || !password) {
    console.warn('Skipping global auth setup: E2E_EMAIL and E2E_PASSWORD not set')
    return
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' })
  await page.getByLabel('Email Address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('**/dashboard')

  await page.context().storageState({ path: authFile })
  await browser.close()
}

export default globalSetup
