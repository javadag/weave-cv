import { DUMMY_CORE_SECTIONS, DUMMY_TITLE } from "~/constants/dummyData"
import type { TCoreSection, TCoreSections, TCoreSectionType, TPersonalContent } from "~/utils/schemas/content.schema"

export type TResumeState = {
  title: string
  personal: TPersonalContent | null
  core: TCoreSections | null
}

export const useResumeStore = defineStore("resume", {
  state: (): TResumeState => ({
    personal: null,
    core: null,
    title: DUMMY_TITLE
  }),
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    setContent({ personal, core }: { core: TCoreSections; personal: TPersonalContent }) {
      this.personal = personal
      this.core = core
    },
    updatePersonal(key: keyof TPersonalContent, value: unknown) {
      this.$patch((state) => {
        if (!state.personal) return
        if (key === "details") {
          state.personal.details = value as TPersonalContent["details"]
        } else if (key === "photo") {
          state.personal.photo = value as TPersonalContent["photo"]
        } else {
          state.personal[key] = value as TPersonalContent[typeof key]
        }
      })
    },

    updateContent(path: string, value: unknown) {
      this.$patch((state) => {
        const pathParts = path.split(".")
        if (pathParts.length === 0) return

        // TODO: Fix this type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let target: any = state.core
        const startIndex = 0

        for (let i = startIndex; i < pathParts.length - 1; i++) {
          const key = pathParts[i]!
          const nextKey = pathParts[i + 1]

          if (Array.isArray(target[key])) {
            const array = target[key]
            const itemIndex = array.findIndex((item) => item.id === nextKey)
            if (itemIndex === -1) {
              target = target[key]
            } else {
              target = array[itemIndex]
              i++
            }
          } else {
            target = target[key]
          }
        }

        const finalKey = pathParts.at(-1)!
        target[finalKey] = value
      })
    },

    addSection(type: TCoreSectionType) {
      const sectionKey = `${type}-${crypto.randomUUID()}`

      const section = DUMMY_CORE_SECTIONS[type]

      if (!section) return

      const newSection = {
        title: section.title,
        isTitleVisible: true,
        isSectionVisible: true,
        type,
        contents: section.contents
      } as TCoreSection

      this.$patch((state) => {
        state.core = {
          ...state.core,
          [sectionKey]: newSection
        }
      })

      // Update order config with the section ID
      const configsStore = useConfigsStore()

      const currentLeft = [...(configsStore.configs.general.layout.order.twoCol.left || [])]
      const currentRight = [...(configsStore.configs.general.layout.order.twoCol.right || [])]

      if (!currentLeft.includes(sectionKey) && !currentRight.includes(sectionKey)) {
        currentLeft.push(sectionKey)
        configsStore.updateOrder("twoCol", { left: currentLeft, right: currentRight })
      }
      const currentOrder = [...(configsStore.configs.general.layout.order.oneCol || [])]
      if (!currentOrder.includes(sectionKey)) {
        currentOrder.push(sectionKey)
        configsStore.updateOrder("oneCol", currentOrder)
      }

      return { sectionKey }
    },

    removeSection(sectionKey: string) {
      this.$patch((state) => {
        if (state.core) {
          const { [sectionKey]: _, ...rest } = state.core
          state.core = Object.keys(rest).length > 0 ? rest : null
        }
      })

      // Update order config by removing the section ID
      const configsStore = useConfigsStore()

      const currentLeft = (configsStore.configs.general.layout.order.twoCol.left || []).filter(
        (id) => id !== sectionKey
      )
      const currentRight = (configsStore.configs.general.layout.order.twoCol.right || []).filter(
        (id) => id !== sectionKey
      )
      configsStore.updateOrder("twoCol", { left: currentLeft, right: currentRight })
      const currentOrder = (configsStore.configs.general.layout.order.oneCol || []).filter((id) => id !== sectionKey)
      configsStore.updateOrder("oneCol", currentOrder)
    }
  }
})
