import type { TAdvancedSectionConfigs, TBasicSectionConfigs } from "~/utils/schemas/configs/sectionsConfigs.schema"
import type {
  TAdvancedContentInput,
  TAdvancedSectionType,
  TBasicContent,
  TBasicSectionType,
  TCoreSectionType
} from "~/utils/schemas/content.schema"

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
  | "subRoles"

export interface FieldConfig {
  field: EditorField
  label: string
  placeholder?: string
}

export type SectionConfigOption =
  | "variant"
  | "separator"
  | "titleStyle"
  | "titleSubtitleVariant"
  | "dateLocationVariant"
  | "subTitleFirst"
  | "linkInTitle"
  | "grids"
  | "typography"

interface CommonDescriptor {
  label: string
  icon: string
  fields: FieldConfig[]
  configOptions: SectionConfigOption[]
}

export interface BasicSectionDescriptor extends CommonDescriptor {
  type: TBasicSectionType
  kind: "basic"
  defaultConfig: TBasicSectionConfigs
  dummyData: TBasicContent[]
  singleItem: Omit<TBasicContent, "id">
}

export interface AdvancedSectionDescriptor extends CommonDescriptor {
  type: TAdvancedSectionType
  kind: "advanced"
  defaultConfig: TAdvancedSectionConfigs
  dummyData: TAdvancedContentInput[]
  singleItem: Omit<TAdvancedContentInput, "id">
}

export type SectionDescriptor = BasicSectionDescriptor | AdvancedSectionDescriptor

const ADVANCED_STACKED: TAdvancedSectionConfigs = {
  variant: "stacked",
  separator: "pipe",
  dateLocationVariant: "stacked",
  titleSubtitleVariant: "stacked",
  subTitleFirst: false,
  linkInTitle: true
}

const ADVANCED_CONTENT_FIRST: TAdvancedSectionConfigs = {
  variant: "contentFirst",
  separator: "pipe",
  dateLocationVariant: "stacked",
  titleSubtitleVariant: "stacked",
  subTitleFirst: false,
  linkInTitle: true
}

const ADVANCED_DATE_FIRST: TAdvancedSectionConfigs = {
  variant: "dateFirst",
  separator: "pipe",
  dateLocationVariant: "stacked",
  titleSubtitleVariant: "stacked",
  subTitleFirst: false,
  linkInTitle: true
}

const BASIC_OPTIONS: SectionConfigOption[] = ["variant", "separator", "grids", "titleStyle", "typography"]
const ADVANCED_OPTIONS: SectionConfigOption[] = [
  "variant",
  "separator",
  "titleSubtitleVariant",
  "dateLocationVariant",
  "subTitleFirst",
  "linkInTitle",
  "typography"
]

export const SECTIONS_REGISTRY: Record<TCoreSectionType, SectionDescriptor> = {
  summary: {
    type: "summary",
    kind: "basic",
    label: "Summary",
    icon: "i-lucide-book-open",
    fields: [{ field: "description", label: "Description", placeholder: "Enter details..." }],
    configOptions: [],
    defaultConfig: { variant: "inline", grids: 1, separator: "pipe", titleStyle: "colon" },
    dummyData: [
      {
        id: "summary-1",
        isHidden: false,
        title: "Summary",
        description:
          "<p>Dedicated software engineer with expertise in full-stack development and cloud architecture. Proven track record of delivering scalable solutions and leading technical teams in fast-paced environments. Passionate about creating innovative solutions that solve real-world problems.</p>"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "Summary",
      description:
        "<p>Dedicated software engineer with expertise in full-stack development and cloud architecture. Proven track record of delivering scalable solutions and leading technical teams in fast-paced environments.</p>"
    }
  },
  skills: {
    type: "skills",
    kind: "basic",
    label: "Skills",
    icon: "i-lucide-wrench",
    fields: [
      { field: "title", label: "Skill", placeholder: "e.g. JavaScript" },
      { field: "description", label: "Description", placeholder: "Enter details..." }
    ],
    configOptions: BASIC_OPTIONS,
    defaultConfig: { variant: "inline", grids: 4, separator: "pipe", titleStyle: "colon" },
    dummyData: [
      {
        id: "skill-1",
        title: "Backend Technologies",
        isHidden: false,
        description:
          "<ul><li><p>Node.js</p></li><li><p>Python</p></li><li><p>Go</p></li><li><p>Java</p></li><li><p>PostgreSQL</p></li><li><p>Redis</p></li><li><p>GraphQL</p></li><li><p>REST APIs</p></li></ul>"
      },
      {
        id: "skill-2",
        title: "Frontend Frameworks",
        isHidden: false,
        description:
          "<ul><li><p>React</p></li><li><p>Vue.js</p></li><li><p>Angular</p></li><li><p>TypeScript</p></li><li><p>Next.js</p></li><li><p>Nuxt.js</p></li><li><p>Tailwind CSS</p></li><li><p>SCSS/SASS</p></li></ul>"
      },
      {
        id: "skill-3",
        title: "Cloud & DevOps",
        isHidden: false,
        description:
          "<ul><li><p>AWS (EC2, S3, Lambda, RDS)</p></li><li><p>Google Cloud Platform</p></li><li><p>Docker</p></li><li><p>Kubernetes</p></li><li><p>Terraform</p></li><li><p>Jenkins</p></li><li><p>GitHub Actions</p></li><li><p>CI/CD Pipelines</p></li></ul>"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "Backend Technologies",
      description: "<p>Node.js, Python, Go, PostgreSQL, Redis</p>"
    }
  },
  languages: {
    type: "languages",
    kind: "basic",
    label: "Languages",
    icon: "i-lucide-globe",
    fields: [
      { field: "title", label: "Language", placeholder: "e.g. English" },
      { field: "description", label: "Proficiency", placeholder: "e.g. Native, Fluent, Intermediate" }
    ],
    configOptions: BASIC_OPTIONS,
    defaultConfig: { variant: "stacked", grids: 1, separator: "pipe", titleStyle: "colon" },
    dummyData: [
      {
        id: "language-1",
        isHidden: false,
        title: "English",
        description: "<p>Native proficiency. Fluent in both written and spoken communication.</p>"
      },
      {
        id: "language-2",
        isHidden: false,
        title: "French",
        description: "<p>Conversational. Can communicate effectively in professional and social settings.</p>"
      }
    ],
    singleItem: { isHidden: false, title: "French", description: "<p>Conversational</p>" }
  },
  certificates: {
    type: "certificates",
    kind: "basic",
    label: "Certificates",
    icon: "i-lucide-award",
    fields: [
      { field: "title", label: "Certificate", placeholder: "e.g. AWS Certified Developer" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
    ],
    configOptions: BASIC_OPTIONS,
    defaultConfig: { variant: "inline", grids: 1, separator: "pipe", titleStyle: "dash" },
    dummyData: [
      {
        id: "certificate-1",
        isHidden: false,
        title: "Certificate Title",
        description:
          "<p>Professional certification in cloud architecture and deployment. Validated expertise in designing and deploying scalable systems on AWS.</p>",
        url: "https://aws.amazon.com/certification/"
      },
      {
        id: "certificate-2",
        isHidden: false,
        title: "Certificate Title",
        description:
          "<p>Advanced certification in Google Cloud Platform development. Demonstrates ability to build and deploy applications on GCP.</p>",
        url: "https://cloud.google.com/certification"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "AWS Solutions Architect",
      description: "<p>Professional certification in cloud architecture and deployment</p>"
    }
  },
  experiences: {
    type: "experiences",
    kind: "advanced",
    label: "Experience",
    icon: "i-lucide-briefcase",
    fields: [
      { field: "title", label: "Job Title", placeholder: "e.g. Senior Software Engineer" },
      { field: "subtitle", label: "Company", placeholder: "e.g. Google" },
      { field: "startDate", label: "Start Date", placeholder: "e.g. 2020-01-01" },
      { field: "endDate", label: "End Date", placeholder: "e.g. 2022-12-31" },
      { field: "present", label: "Present" },
      { field: "showDateDay", label: "Full Date" },
      { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" },
      { field: "subRoles", label: "Additional Roles" }
    ],
    configOptions: ADVANCED_OPTIONS,
    defaultConfig: ADVANCED_STACKED,
    dummyData: [
      {
        id: "experience-1",
        isHidden: false,
        subtitle: "Amazon",
        title: "Software Engineer",
        startDate: "2022-03-01",
        endDate: "2024-03-01",
        present: true,
        showDateDay: true,
        location: "Seattle, WA",
        description:
          "<ul><li><p>Led development of microservices architecture serving 100K+ daily users.</p></li><li><p>Mentored junior developers and established code review best practices.</p></li><li><p>Implemented CI/CD pipelines reducing deployment time by 60%.</p></li><li><p>Architected scalable solutions using AWS, Docker, and Kubernetes.</p></li></ul>"
      },
      {
        id: "experience-2",
        isHidden: false,
        subtitle: "Google",
        title: "Senior Software Engineer",
        startDate: "2020-07-01",
        endDate: "2022-02-01",
        present: false,
        showDateDay: true,
        location: "San Francisco, CA",
        description:
          "<ul><li><p>Developed RESTful APIs using Node.js and Express framework.</p></li><li><p>Built responsive frontend applications with React and TypeScript.</p></li><li><p>Collaborated with UX designers to implement pixel-perfect interfaces.</p></li><li><p>Optimized database queries improving response time by 40%.</p></li></ul>"
      }
    ],
    singleItem: {
      isHidden: false,
      url: "https://innovatecorp.com",
      subtitle: "InnovateCorp Solutions",
      title: "Senior Software Engineer",
      startDate: "2022-03-01",
      endDate: "2024-08-01",
      present: false,
      showDateDay: true,
      location: "Austin, TX",
      description:
        "<ul><li><p>Led development of microservices architecture serving 100K+ daily users.</p></li><li><p>Mentored junior developers and established code review best practices.</p></li><li><p>Implemented CI/CD pipelines reducing deployment time by 60%.</p></li></ul>"
    }
  },
  educations: {
    type: "educations",
    kind: "advanced",
    label: "Education",
    icon: "i-lucide-graduation-cap",
    fields: [
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
    configOptions: ADVANCED_OPTIONS,
    defaultConfig: ADVANCED_STACKED,
    dummyData: [
      {
        id: "education-1",
        isHidden: false,
        subtitle: "Stanford University",
        title: "Master of Science in Computer Science",
        startDate: "2017-09-01",
        endDate: "2019-05-01",
        present: false,
        showDateDay: true,
        location: "Stanford, CA",
        description:
          "<ul><li><p>Specialized in distributed systems and machine learning applications</p></li><li><p>Graduated Magna Cum Laude with GPA 3.8/4.0</p></li><li><p>Relevant coursework: Advanced Algorithms, Cloud Computing, Distributed Systems</p></li></ul>"
      }
    ],
    singleItem: {
      isHidden: false,
      subtitle: "Stanford University",
      title: "Master of Science in Software Engineering",
      startDate: "2017-09-01",
      endDate: "2019-05-01",
      showDateDay: true,
      location: "Stanford, CA",
      description:
        "<ul><li><p>Specialized in distributed systems and machine learning applications</p></li><li><p>Graduated Magna Cum Laude with GPA 3.8/4.0</p></li></ul>"
    }
  },
  projects: {
    type: "projects",
    kind: "advanced",
    label: "Projects",
    icon: "i-lucide-folder-open",
    fields: [
      {
        field: "title",
        label: "editor.form.project.title.label",
        placeholder: "editor.form.project.title.placeholder"
      },
      {
        field: "subtitle",
        label: "editor.form.project.subtitle.label",
        placeholder: "editor.form.project.subtitle.placeholder"
      },
      { field: "startDate", label: "Start Date", placeholder: "e.g. 2021-01-01" },
      { field: "endDate", label: "End Date", placeholder: "e.g. 2021-12-31" },
      { field: "showDateDay", label: "Full Date" },
      { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
    ],
    configOptions: ADVANCED_OPTIONS,
    defaultConfig: ADVANCED_DATE_FIRST,
    dummyData: [
      {
        id: "project-1",
        title: "CloudSync Platform",
        subtitle: "Enterprise Data Synchronization",
        isHidden: false,
        startDate: "2023-01-01",
        endDate: "2023-12-01",
        present: false,
        showDateDay: true,
        location: "Remote",
        url: "https://cloudsync.enterprise.com",
        description:
          "<ul><li><p>Architected real-time data synchronization platform for enterprise clients.</p></li><li><p>Implemented advanced conflict resolution algorithms with 99.9% accuracy.</p></li><li><p>Scaled to handle 1M+ concurrent connections using Kubernetes.</p></li><li><p>Built with Node.js, PostgreSQL, Redis, and deployed on AWS.</p></li></ul>"
      }
    ],
    singleItem: {
      title: "CloudSync Platform",
      subtitle: "Enterprise Data Synchronization",
      isHidden: false,
      startDate: "2023-01-01",
      endDate: "2023-12-01",
      showDateDay: true,
      url: "https://cloudsync.enterprise.com",
      description:
        "<ul><li><p>Architected real-time data synchronization platform for enterprise clients.</p></li><li><p>Implemented advanced conflict resolution algorithms with 99.9% accuracy.</p></li><li><p>Scaled to handle 1M+ concurrent connections using Kubernetes.</p></li></ul>"
    }
  },
  awards: {
    type: "awards",
    kind: "advanced",
    label: "Awards",
    icon: "i-lucide-trophy",
    fields: [
      { field: "title", label: "Award Name", placeholder: "e.g. Employee of the Year" },
      { field: "subtitle", label: "Organization", placeholder: "e.g. Tech Corp" },
      { field: "endDate", label: "Date Received", placeholder: "e.g. 2023-12-31" },
      { field: "showDateDay", label: "Full Date" },
      { field: "location", label: "Location", placeholder: "e.g. San Francisco, CA" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
    ],
    configOptions: ADVANCED_OPTIONS,
    defaultConfig: ADVANCED_CONTENT_FIRST,
    dummyData: [
      {
        id: "award-1",
        isHidden: false,
        title: "Excellence in Innovation",
        subtitle: "Tech Industry Awards",
        startDate: "2023-11-01",
        endDate: "2023-11-01",
        present: false,
        showDateDay: true,
        location: "San Francisco, CA",
        url: "https://techindustryawards.com",
        description:
          "<p>Recognized for outstanding contribution to open-source projects and community building. Awarded for leading innovative solutions in distributed systems.</p>"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "Excellence in Innovation",
      subtitle: "Tech Industry Awards",
      startDate: "2023-11-01",
      endDate: "2023-11-01",
      present: false,
      showDateDay: true,
      location: "San Francisco, CA",
      description: "<p>Recognized for outstanding contribution to open-source projects and community building</p>"
    }
  },
  courses: {
    type: "courses",
    kind: "advanced",
    label: "Courses",
    icon: "i-lucide-book",
    fields: [
      { field: "title", label: "Course Name", placeholder: "e.g. Machine Learning Fundamentals" },
      { field: "subtitle", label: "Provider", placeholder: "e.g. Coursera" },
      { field: "endDate", label: "Completion Date", placeholder: "e.g. 2023-06-30" },
      { field: "showDateDay", label: "Full Date" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
    ],
    configOptions: ADVANCED_OPTIONS,
    defaultConfig: ADVANCED_CONTENT_FIRST,
    dummyData: [
      {
        id: "course-1",
        isHidden: false,
        title: "Advanced React Patterns",
        subtitle: "Frontend Masters",
        startDate: "2023-06-01",
        endDate: "2023-08-01",
        present: false,
        showDateDay: true,
        location: "Online",
        url: "https://frontendmasters.com",
        description:
          "<ul><li><p>Mastered advanced React concepts including hooks, context, and performance optimization</p></li><li><p>Built complex applications using modern React ecosystem tools</p></li><li><p>Learned state management patterns with Redux and Zustand</p></li></ul>"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "Advanced React Patterns",
      subtitle: "Frontend Masters",
      startDate: "2023-06-01",
      endDate: "2023-08-01",
      present: false,
      showDateDay: true,
      location: "Online",
      description:
        "<ul><li><p>Mastered advanced React concepts including hooks, context, and performance optimization</p></li><li><p>Built complex applications using modern React ecosystem tools</p></li></ul>"
    }
  },
  custom: {
    type: "custom",
    kind: "basic",
    label: "Custom Section",
    icon: "i-lucide-file-text",
    fields: [
      { field: "title", label: "Title", placeholder: "e.g. Publication title" },
      { field: "description", label: "Description", placeholder: "Enter details..." },
      { field: "url", label: "URL", placeholder: "e.g. https://example.com" }
    ],
    configOptions: BASIC_OPTIONS,
    defaultConfig: { variant: "stacked", grids: 1, separator: "pipe", titleStyle: "none" },
    dummyData: [
      {
        id: "custom-1",
        isHidden: false,
        title: "Item Title",
        description: "<p>Add a description for this item.</p>"
      }
    ],
    singleItem: {
      isHidden: false,
      title: "",
      description: "<p></p>"
    }
  }
}
