import type { HonestyLevel } from "../providers"

export const HONESTY_BLOCK: Record<HonestyLevel, string> = {
  faithful:
    "HONESTY: Faithful. Reword, reframe, and highlight only what is genuinely in the resume. Never add facts.",
  balanced:
    "HONESTY: Balanced. Weak but defensible phrasing is allowed; never invent new facts about the candidate.",
  bold:
    "HONESTY: Bold. You may add plausible details to make the entry stronger. Every fact NOT grounded in the resume MUST be listed in that suggestion's addedFacts array so the UI can flag it for review."
}