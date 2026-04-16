import type { TCoreSectionType } from "~/utils/schemas/content.schema"

// Fields that the generic editor can render
export type EditorField =
  | "title"
  | "subtitle"
  | "description"
  | "url"
  | "startDate"
  | "endDate"
  | "present"
  | "location"
  | "showDateDay"

export interface FieldConfig {
  field: EditorField
  label: string
  placeholder?: string
}

export const SECTION_FIELDS_CONFIG: Record<TCoreSectionType, FieldConfig[]> = {
  // Basic sections
  summary: [{ field: "description", label: "Description", placeholder: "Enter details..." }],
  skills: [
    { field: "title", label: "Skill", placeholder: "e.g. JavaScript" },
    { field: "description", label: "Description", placeholder: "Enter details..." }
  ],
  languages: [
    { field: "title", label: "Language", placeholder: "e.g. English" },
    { field: "description", label: "Proficiency", placeholder: "e.g. Native, Fluent, Intermediate" }
  ],
  certificates: [
    { field: "title", label: "Certificate", placeholder: "e.g. AWS Certified Developer" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ],

  // Advanced sections
  experiences: [
    { field: "title", label: "Job Title", placeholder: "e.g. Senior Software Engineer" },
    { field: "subtitle", label: "Company", placeholder: "e.g. Google" },
    { field: "startDate", label: "Start Date", placeholder: "e.g. 2020-01-01" },
    { field: "endDate", label: "End Date", placeholder: "e.g. 2022-12-31" },
    { field: "present", label: "Present" },
    { field: "showDateDay", label: "Full Date" },
    { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ],
  educations: [
    { field: "title", label: "Degree", placeholder: "e.g. Bachelor of Science" },
    { field: "subtitle", label: "Institution", placeholder: "e.g. Stanford University" },
    { field: "startDate", label: "Start Date", placeholder: "e.g. 2016-09-01" },
    { field: "endDate", label: "End Date", placeholder: "e.g. 2020-05-31" },
    { field: "present", label: "Present" },
    { field: "showDateDay", label: "Full Date" },
    { field: "location", label: "Location", placeholder: "e.g. Stanford, CA" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ],
  projects: [
    { field: "title", label: "Project Name", placeholder: "e.g. E-commerce Platform" },
    { field: "subtitle", label: "Role/Organization", placeholder: "e.g. Lead Developer" },
    { field: "startDate", label: "Start Date", placeholder: "e.g. 2021-01-01" },
    { field: "endDate", label: "End Date", placeholder: "e.g. 2021-12-31" },
    { field: "showDateDay", label: "Full Date" },
    { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ],
  awards: [
    { field: "title", label: "Award Name", placeholder: "e.g. Employee of the Year" },
    { field: "subtitle", label: "Organization", placeholder: "e.g. Tech Corp" },
    { field: "endDate", label: "Date Received", placeholder: "e.g. 2023-12-31" },
    { field: "showDateDay", label: "Full Date" },
    { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ],
  courses: [
    { field: "title", label: "Course Name", placeholder: "e.g. Machine Learning Fundamentals" },
    { field: "subtitle", label: "Provider", placeholder: "e.g. Coursera" },
    { field: "endDate", label: "Completion Date", placeholder: "e.g. 2023-06-30" },
    { field: "showDateDay", label: "Full Date" },
    { field: "description", label: "Description", placeholder: "Enter details..." },
    { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
  ]
}
