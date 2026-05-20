import { SECTIONS_REGISTRY } from "~/constants/sections/registry"
import type { TAdvancedContent, TBasicContent, TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

export const DUMMY_TITLE = "Untitled Resume"

export const DUMMY_PERSONAL_SECTION: TPersonalContent = {
  title: "Sarah Johnson",
  subtitle: "Senior Software Engineer",
  photo: {
    url: ""
  },
  details: [
    { value: "sarah.johnson@email.com", isHidden: false, type: "email", url: "mailto:sarah.johnson@email.com" },
    { value: "+1 555 987 6543", isHidden: false, type: "phone", url: "tel:+15559876543" },
    { value: "sarah-johnson-dev", isHidden: false, type: "linkedin", url: "https://linkedin.com/in/sarah-johnson-dev" },
    { value: "sarah-johnson", isHidden: false, type: "github", url: "https://github.com/sarah-johnson" }
  ]
}

export const DUMMY_SUMMARY_DATA = SECTIONS_REGISTRY.summary.dummyData as TBasicContent[]
export const DUMMY_SKILL_DATA = SECTIONS_REGISTRY.skills.dummyData as TBasicContent[]
export const DUMMY_LANGUAGE_DATA = SECTIONS_REGISTRY.languages.dummyData as TBasicContent[]
export const DUMMY_CERTIFICATE_DATA = SECTIONS_REGISTRY.certificates.dummyData as TBasicContent[]
export const DUMMY_EXPERIENCE_DATA = SECTIONS_REGISTRY.experiences.dummyData as TAdvancedContent[]
export const DUMMY_EDUCATION_DATA = SECTIONS_REGISTRY.educations.dummyData as TAdvancedContent[]
export const DUMMY_PROJECT_DATA = SECTIONS_REGISTRY.projects.dummyData as TAdvancedContent[]
export const DUMMY_AWARD_DATA = SECTIONS_REGISTRY.awards.dummyData as TAdvancedContent[]
export const DUMMY_COURSE_DATA = SECTIONS_REGISTRY.courses.dummyData as TAdvancedContent[]

export const DUMMY_CORE_SECTIONS: TCoreSections = Object.fromEntries(
  Object.entries(SECTIONS_REGISTRY).map(([key, descriptor]) => [
    key,
    {
      type: descriptor.type,
      title: descriptor.label,
      isTitleVisible: true,
      isSectionVisible: true,
      contents: descriptor.dummyData
    }
  ])
) as TCoreSections
