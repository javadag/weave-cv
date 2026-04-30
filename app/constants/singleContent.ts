import { SECTIONS_REGISTRY } from "~/constants/sections/registry"
import type { TAdvancedContent, TBasicContent } from "~/utils/schemas/content.schema"

/* Used for adding new content to sections */

export const SUMMARY_ITEM = SECTIONS_REGISTRY.summary.singleItem as Omit<TBasicContent, "id">
export const SKILL_ITEM = SECTIONS_REGISTRY.skills.singleItem as Omit<TBasicContent, "id">
export const LANGUAGE_ITEM = SECTIONS_REGISTRY.languages.singleItem as Omit<TBasicContent, "id">
export const CERTIFICATE_ITEM = SECTIONS_REGISTRY.certificates.singleItem as Omit<TBasicContent, "id">
export const EXPERIENCE_ITEM = SECTIONS_REGISTRY.experiences.singleItem as Omit<TAdvancedContent, "id">
export const EDUCATION_ITEM = SECTIONS_REGISTRY.educations.singleItem as Omit<TAdvancedContent, "id">
export const PROJECT_ITEM = SECTIONS_REGISTRY.projects.singleItem as Omit<TAdvancedContent, "id">
export const AWARD_ITEM = SECTIONS_REGISTRY.awards.singleItem as Omit<TAdvancedContent, "id">
export const COURSE_ITEM = SECTIONS_REGISTRY.courses.singleItem as Omit<TAdvancedContent, "id">

export const BASIC_SECTION_ITEM = {
  skills: SKILL_ITEM,
  summary: SUMMARY_ITEM,
  languages: LANGUAGE_ITEM,
  certificates: CERTIFICATE_ITEM
}

export const ADVANCED_SECTION_ITEM = {
  educations: EDUCATION_ITEM,
  experiences: EXPERIENCE_ITEM,
  projects: PROJECT_ITEM,
  awards: AWARD_ITEM,
  courses: COURSE_ITEM
}
