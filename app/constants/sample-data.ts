import { DEFAULT_CONFIGS } from "~/constants/default"
import { DUMMY_CORE_SECTIONS, DUMMY_PERSONAL_SECTION, DUMMY_TITLE } from "~/constants/dummyData"

const sectionKeys = Object.keys(DUMMY_CORE_SECTIONS)

export const SAMPLE_RESUME = {
  title: DUMMY_TITLE,
  content: {
    personal: DUMMY_PERSONAL_SECTION,
    core: DUMMY_CORE_SECTIONS
  },
  configs: {
    ...DEFAULT_CONFIGS,
    general: {
      ...DEFAULT_CONFIGS.general,
      layout: {
        ...DEFAULT_CONFIGS.general.layout,
        order: {
          twoCol: {
            left: sectionKeys.filter((k) =>
              ["summary", "experiences", "languages", "certificates", "courses", "custom"].includes(k)
            ),
            right: sectionKeys.filter(
              (k) =>
                !["summary", "experiences", "languages", "certificates", "courses", "custom"].includes(k)
            )
          },
          oneCol: sectionKeys
        }
      }
    }
  }
}
