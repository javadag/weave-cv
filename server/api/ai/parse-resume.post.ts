import Groq from "groq-sdk"
import { TEMPLATE_MINIMALIST } from "~/constants/templates"
import { requireAuth } from "../../utils/auth"
import { checkRateLimit } from "../../utils/rateLimit"

const PROMPT = `You are a resume parser. Extract structured data from the resume text below and return ONLY valid JSON matching this exact schema (use empty strings/arrays for missing fields, never null for strings):

{
  "name": "full name",
  "jobTitle": "professional title",
  "email": "email address",
  "phone": "phone number",
  "location": "city, country or region",
  "linkedin": "linkedin profile URL or username",
  "github": "github profile URL or username",
  "website": "personal website URL",
  "summary": "professional summary as plain text",
  "experiences": [
    {
      "title": "job title",
      "company": "company name",
      "location": "city or remote",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "present": true or false,
      "description": "responsibilities and achievements as plain text, one sentence or bullet per line"
    }
  ],
  "educations": [
    {
      "degree": "degree name",
      "institution": "school name",
      "location": "city",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "present": false,
      "description": "relevant details as plain text"
    }
  ],
  "projects": [
    {
      "title": "project name",
      "subtitle": "tech stack or role",
      "url": "project URL or empty string",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "present": false,
      "description": "what the project does as plain text"
    }
  ],
  "skills": [
    { "category": "category name", "items": "comma-separated list of skills" }
  ],
  "languages": [
    { "name": "language name", "proficiency": "proficiency level" }
  ],
  "certificates": [
    { "title": "certificate name", "issuer": "issuing organization" }
  ],
  "courses": [
    {
      "title": "course name",
      "provider": "platform or school",
      "date": "YYYY-MM-DD or empty string"
    }
  ],
  "awards": [
    {
      "title": "award name",
      "issuer": "organization",
      "date": "YYYY-MM-DD or empty string",
      "description": "brief description"
    }
  ]
}`

function uid() {
  return crypto.randomUUID()
}

function toHtml(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
  if (lines.length === 0) return ""
  if (lines.length === 1) return `<p>${lines[0]}</p>`
  return `<ul>${lines.map((l) => `<li><p>${l}</p></li>`).join("")}</ul>`
}

function normalizeUrl(raw: string, base: string): string | undefined {
  if (!raw) return undefined
  if (raw.startsWith("http")) return raw
  return `${base}${raw.replace(/^\//, "")}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildContent(parsed: any) {
  const personal = {
    title: parsed.name ?? "",
    subtitle: parsed.jobTitle ?? "",
    details: [
      parsed.email && { value: parsed.email, isHidden: false, type: "email", url: `mailto:${parsed.email}` },
      parsed.phone && { value: parsed.phone, isHidden: false, type: "phone" },
      parsed.location && { value: parsed.location, isHidden: false, type: "location" },
      parsed.linkedin && {
        value: parsed.linkedin.includes("linkedin.com")
          ? parsed.linkedin.split("/").findLast(Boolean)
          : parsed.linkedin,
        isHidden: false,
        type: "linkedin",
        url: normalizeUrl(parsed.linkedin, "https://linkedin.com/in/")
      },
      parsed.github && {
        value: parsed.github.includes("github.com") ? parsed.github.split("/").findLast(Boolean) : parsed.github,
        isHidden: false,
        type: "github",
        url: normalizeUrl(parsed.github, "https://github.com/")
      },
      parsed.website && { value: parsed.website, isHidden: false, type: "website", url: parsed.website }
    ].filter(Boolean)
  }

  const core = {
    summary: {
      type: "summary" as const,
      title: "Summary",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: parsed.summary
        ? [{ id: uid(), isHidden: false, title: "", description: `<p>${parsed.summary}</p>` }]
        : []
    },
    experiences: {
      type: "experiences" as const,
      title: "Experience",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.experiences ?? []).map((e: any) => ({
        id: uid(),
        isHidden: false,
        title: e.title ?? "",
        subtitle: e.company ?? "",
        location: e.location ?? "",
        startDate: e.startDate || null,
        endDate: e.endDate || null,
        present: e.present ?? false,
        showDateDay: false,
        description: toHtml(e.description ?? "")
      }))
    },
    educations: {
      type: "educations" as const,
      title: "Education",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.educations ?? []).map((e: any) => ({
        id: uid(),
        isHidden: false,
        title: e.degree ?? "",
        subtitle: e.institution ?? "",
        location: e.location ?? "",
        startDate: e.startDate || null,
        endDate: e.endDate || null,
        present: e.present ?? false,
        showDateDay: false,
        description: toHtml(e.description ?? "")
      }))
    },
    projects: {
      type: "projects" as const,
      title: "Projects",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.projects ?? []).map((p: any) => ({
        id: uid(),
        isHidden: false,
        title: p.title ?? "",
        subtitle: p.subtitle ?? "",
        location: "",
        startDate: p.startDate || null,
        endDate: p.endDate || null,
        present: p.present ?? false,
        showDateDay: false,
        description: toHtml(p.description ?? ""),
        url: p.url || undefined
      }))
    },
    skills: {
      type: "skills" as const,
      title: "Skills",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.skills ?? []).map((s: any) => ({
        id: uid(),
        isHidden: false,
        title: s.category ?? "Skills",
        description: `<p>${s.items ?? ""}</p>`
      }))
    },
    languages: {
      type: "languages" as const,
      title: "Languages",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.languages ?? []).map((l: any) => ({
        id: uid(),
        isHidden: false,
        title: l.name ?? "",
        description: l.proficiency ? `<p>${l.proficiency}</p>` : ""
      }))
    },
    certificates: {
      type: "certificates" as const,
      title: "Certificates",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.certificates ?? []).map((c: any) => ({
        id: uid(),
        isHidden: false,
        title: c.title ?? "",
        description: c.issuer ? `<p>${c.issuer}</p>` : ""
      }))
    },
    courses: {
      type: "courses" as const,
      title: "Courses",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.courses ?? []).map((c: any) => ({
        id: uid(),
        isHidden: false,
        title: c.title ?? "",
        subtitle: c.provider ?? "",
        location: "",
        startDate: c.date || null,
        endDate: null,
        present: false,
        showDateDay: false,
        description: ""
      }))
    },
    awards: {
      type: "awards" as const,
      title: "Awards",
      isTitleVisible: true,
      isSectionVisible: true,
      contents: (parsed.awards ?? []).map((a: any) => ({
        id: uid(),
        isHidden: false,
        title: a.title ?? "",
        subtitle: a.issuer ?? "",
        location: "",
        startDate: a.date || null,
        endDate: null,
        present: false,
        showDateDay: false,
        description: toHtml(a.description ?? "")
      }))
    }
  }

  return { personal, core }
}

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  // 5 AI parses per hour per user — each call hits a paid external API
  checkRateLimit(`ai:${user.id}`, 5, 60 * 60 * 1000)

  const { text } = await readBody<{ text: string }>(event)

  if (!text?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "text is required" })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI parsing not configured — add GROQ_API_KEY to your environment"
    })
  }

  const groq = new Groq({ apiKey })

  // Truncate to avoid exceeding context (30k chars covers any real CV)
  const truncated = text.length > 30_000 ? text.slice(0, 30_000) : text

  let parsed: unknown
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: `Resume text:\n${truncated}` }
      ]
    })
    const raw = completion.choices[0]?.message?.content
    if (!raw) throw new Error("Empty response from model")
    parsed = JSON.parse(raw)
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 422, statusMessage: "Could not parse resume — try a text-based PDF" })
  }

  const content = buildContent(parsed)

  return {
    title: (parsed as { name?: string }).name || "Imported Resume",
    content,
    configs: TEMPLATE_MINIMALIST.configs
  }
})
