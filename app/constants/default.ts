import { SECTIONS_REGISTRY } from "~/constants/sections/registry"
import { ConfigsSchema, type TConfigs } from "~/utils/schemas/configs/configs.schema"

const sectionDefaults = Object.fromEntries(
  Object.entries(SECTIONS_REGISTRY).map(([key, descriptor]) => [key, descriptor.defaultConfig])
)

export const DEFAULT_CONFIGS: TConfigs = ConfigsSchema.parse({
  general: {
    layout: {
      columns: "1",
      contentLayout: { title: {}, subtitle: {}, contentFirstWidth: {}, dateFirstWidth: {} },
      columnsWidth: {},
      order: { twoCol: {} }
    },
    headings: { icon: {} },
    links: { icon: {} },
    typography: {},
    colors: { primary: {}, secondary: {} }
  },
  personal: {
    main: { title: {}, subtitle: {} },
    details: { icon: {} }
  },
  ...sectionDefaults
})
