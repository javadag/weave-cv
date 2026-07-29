import OpenAI from "openai"
import { TEMPLATES } from "~/constants/templates"
import { PARSE_RESUME_PROMPT } from "../../utils/ai/prompts/parseResume"
import { requireAuth } from "../../utils/auth"
import { checkRateLimit } from "../../utils/rateLimit"

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

interface ParsedExperience {
  title?: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  present?: boolean
  description?: string
}

interface ParsedEducation {
  degree?: string
  institution?: string
  location?: string
  startDate?: string
  endDate?: string
  present?: boolean
  description?: string
}

interface ParsedProject {
  title?: string
  subtitle?: string
  url?: string
  startDate?: string
  endDate?: string
  present?: boolean
  description?: string
}

interface ParsedSkill {
  category?: string
  items?: string
}

interface ParsedLanguage {
  name?: string
  proficiency?: string
}

interface ParsedCertificate {
  title?: string
  issuer?: string
}

interface ParsedCourse {
  title?: string
  provider?: string
  date?: string
}

interface ParsedAward {
  title?: string
  issuer?: string
  date?: string
  description?: string
}

interface ParsedResume {
  name?: string
  jobTitle?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
  experiences?: ParsedExperience[]
  educations?: ParsedEducation[]
  projects?: ParsedProject[]
  skills?: ParsedSkill[]
  languages?: ParsedLanguage[]
  certificates?: ParsedCertificate[]
  courses?: ParsedCourse[]
  awards?: ParsedAward[]
}

function buildContent(parsed: ParsedResume) {
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
      contents: (parsed.experiences ?? []).map((e: ParsedExperience) => ({
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
      contents: (parsed.educations ?? []).map((e: ParsedEducation) => ({
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
      contents: (parsed.projects ?? []).map((p: ParsedProject) => ({
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
      contents: (parsed.skills ?? []).map((s: ParsedSkill) => ({
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
      contents: (parsed.languages ?? []).map((l: ParsedLanguage) => ({
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
      contents: (parsed.certificates ?? []).map((c: ParsedCertificate) => ({
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
      contents: (parsed.courses ?? []).map((c: ParsedCourse) => ({
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
      contents: (parsed.awards ?? []).map((a: ParsedAward) => ({
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

  const { text } = await readBody<{
    text: string
  }>(event)

  if (!text?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "text is required" })
  }

  checkRateLimit(`ai:${user.id}`, 5, 60 * 60 * 1000)

  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI parsing not configured — add DEEPSEEK_API_KEY to your environment"
    })
  }

  const truncated = text.length > 30_000 ? text.slice(0, 30_000) : text

  let parsed: ParsedResume
  try {
    const openai = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" })

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        { role: "system", content: PARSE_RESUME_PROMPT },
        { role: "user", content: `Resume text:\n${truncated}` }
      ]
    })

    const raw = completion.choices[0]?.message?.content

    if (!raw) throw new Error("Empty response from model")

    parsed = JSON.parse(raw) as unknown as ParsedResume
  } catch (error) {
    if ((error as { status?: number }).status === 401 || (error as { code?: string }).code === "invalid_api_key") {
      throw createError({ statusCode: 401, statusMessage: "Invalid API key" })
    }
    console.error(error)
    throw createError({ statusCode: 422, statusMessage: "Could not parse resume — try a text-based PDF" })
  }

  const content = buildContent(parsed)

  return {
    title: parsed.name || "Imported Resume",
    content,
    configs: TEMPLATES[0]!.configs
  }
})
