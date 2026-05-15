import { Resend } from "resend"

type FeedbackBody = {
  type: "bug" | "feedback" | "feature"
  message: string
  email?: string
  website?: string
  url?: string
  userAgent?: string
}

const VALID_TYPES = new Set(["bug", "feedback", "feature"])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string) {
  return s.replaceAll(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": {
        return "&amp;"
      }
      case "<": {
        return "&lt;"
      }
      case ">": {
        return "&gt;"
      }
      case '"': {
        return "&quot;"
      }
      default: {
        return "&#39;"
      }
    }
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody<FeedbackBody>(event)

  if (body.website && body.website.trim() !== "") {
    return { ok: true }
  }

  const message = (body.message || "").trim()
  if (message.length < 5) {
    throw createError({ statusCode: 400, statusMessage: "Message too short" })
  }
  if (message.length > 5000) {
    throw createError({ statusCode: 400, statusMessage: "Message too long" })
  }
  if (!VALID_TYPES.has(body.type)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid type" })
  }
  if (body.email && !EMAIL_RE.test(body.email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" })
  }

  const config = useRuntimeConfig()

  if (!config.resendApiKey || !config.feedbackToEmail || !config.feedbackFromEmail) {
    throw createError({ statusCode: 500, statusMessage: "Feedback email is not configured" })
  }

  const resend = new Resend(config.resendApiKey)

  const subject = `[Weave CV ${body.type}] ${message.slice(0, 60)}`
  const html = `
    <p><b>Type:</b> ${escapeHtml(body.type)}</p>
    <p><b>From:</b> ${body.email ? escapeHtml(body.email) : "(anonymous)"}</p>
    <p><b>URL:</b> ${body.url ? escapeHtml(body.url) : "-"}</p>
    <p><b>User-Agent:</b> ${body.userAgent ? escapeHtml(body.userAgent) : "-"}</p>
    <hr/>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
  `

  const { error } = await resend.emails.send({
    from: config.feedbackFromEmail,
    to: config.feedbackToEmail,
    replyTo: body.email || undefined,
    subject,
    html
  })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: "Email send failed" })
  }

  return { ok: true }
})
