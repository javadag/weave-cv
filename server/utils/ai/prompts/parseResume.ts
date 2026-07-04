export const PARSE_RESUME_PROMPT = `You are a resume parser. Extract structured data from the resume text below and return ONLY valid JSON matching this exact schema (use empty strings/arrays for missing fields, never null for strings):

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
