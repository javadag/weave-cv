import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { LaunchOptions } from "puppeteer-core"
import { PAPER_SIZES, type TPaperSize } from "~/constants/papers"
import { buildFontCss } from "~/utils/preview/core/fontUtils"
import { requireAuth } from "../utils/auth"
import { checkRateLimit } from "../utils/rateLimit"

let tailwindCssCache: string | null = null

const loadTailwindCss = async (baseUrl?: string) => {
  if (tailwindCssCache) return tailwindCssCache

  // Try using Nitro storage (works in serverless environments like Vercel)
  try {
    const storage = useStorage()
    const cssContent = await storage.getItem("public:tailwind-pdf.css")
    if (cssContent) {
      tailwindCssCache = typeof cssContent === "string" ? cssContent : cssContent.toString()
      return tailwindCssCache
    }
  } catch (error) {
    // Fall through to file system approach
    console.warn("Failed to load CSS from Nitro storage, trying file system:", error)
  }

  // Fallback: Try different path resolution strategies
  const possiblePaths = [
    // Vercel/serverless: Nitro outputs public files here
    path.join(process.cwd(), ".output", "public", "tailwind-pdf.css"),
    // Alternative Vercel path
    path.join(process.cwd(), "public", "tailwind-pdf.css"),
    // Local development: relative to project root
    path.join(process.cwd(), "public", "tailwind-pdf.css"),
    // Alternative: relative to current file location (for local dev)
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../../public/tailwind-pdf.css")
  ]

  for (const filePath of possiblePaths) {
    try {
      tailwindCssCache = await readFile(filePath, "utf8")
      return tailwindCssCache
    } catch {
      // Try next path
      continue
    }
  }

  // Final fallback: Fetch from public URL (works in all environments)
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/tailwind-pdf.css`)
      if (response.ok) {
        tailwindCssCache = await response.text()
        return tailwindCssCache
      }
    } catch (error) {
      console.warn("Failed to fetch CSS from public URL:", error)
    }
  }

  throw new Error("Could not find tailwind-pdf.css file in any expected location")
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  // 10 PDF exports per 10 minutes per user — each spawns a headless browser
  checkRateLimit(`pdf:${user.id}`, 10, 10 * 60 * 1000)

  let browser:
    | Awaited<ReturnType<typeof import("puppeteer").launch>>
    | Awaited<ReturnType<typeof import("puppeteer-core").launch>>
    | undefined

  try {
    const body = (await readBody(event)) as { html: string; format: TPaperSize; fontFamily: string }
    const { html, format, fontFamily } = body

    if (!html) {
      throw createError({
        statusCode: 400,
        statusMessage: "HTML content is required"
      })
    }

    const isVercel = !!process.env.VERCEL_ENV
    let puppeteer: typeof import("puppeteer") | typeof import("puppeteer-core")

    const launchOptions: LaunchOptions = {
      headless: true,
      args: isVercel ? [] : ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"]
    }

    if (isVercel) {
      const chromiumModule = await import("@sparticuz/chromium")
      const chromium = chromiumModule.default
      puppeteer = await import("puppeteer-core")
      launchOptions.executablePath = await chromium.executablePath()
      launchOptions.args = [...chromium.args, "--no-sandbox", "--disable-web-security", "--disable-setuid-sandbox"]
    } else {
      puppeteer = await import("puppeteer")
    }

    browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()

    const paperSize = PAPER_SIZES[format] || PAPER_SIZES.A4

    await page.setViewport({
      width: paperSize.w,
      height: paperSize.h,
      deviceScaleFactor: 1
    })

    const host = getHeader(event, "host") || "localhost:3000"
    const protocol = getHeader(event, "x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
    const baseUrl = `${protocol}://${host}`
    const fontCss = buildFontCss(fontFamily, baseUrl)

    const tailwindCss = await loadTailwindCss(baseUrl)

    const wrappedHtml = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${fontCss}
            ${tailwindCss}
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          </style>
        </head>
        <body>${html}</body>
      </html>`

    await page.setContent(wrappedHtml, {
      waitUntil: "networkidle0",
      timeout: 30_000
    })

    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready
    })
    await new Promise((resolve) => setTimeout(resolve, 500))

    const pdf = await page.pdf({
      width: `${paperSize.w}mm`,
      height: `${paperSize.h}mm`,
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
    })

    setHeader(event, "Content-Type", "application/pdf")
    setHeader(event, "Content-Disposition", `attachment; filename="resume.pdf"`)
    return pdf
  } catch (error: unknown) {
    console.error("PDF generation error:", error)
    const err = error as { statusCode?: number; statusMessage?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Failed to generate PDF"
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
})
