import { DUMMY_CORE_SECTIONS } from "~/constants/dummyData"
import type { TCoreSection, TCoreSectionType } from "~/utils/schemas/content.schema"

export function useEditorState() {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()

  function addSection(type: TCoreSectionType): { sectionKey: string } | undefined {
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

    resumeStore.$patch((state) => {
      state.core = {
        ...state.core,
        [sectionKey]: newSection
      }
    })

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
  }

  function removeSection(sectionKey: string) {
    resumeStore.$patch((state) => {
      if (!state.core) {
        return
      }

      const { [sectionKey]: _, ...rest } = state.core
      state.core = Object.keys(rest).length > 0 ? rest : null
    })

    const currentLeft = (configsStore.configs.general.layout.order.twoCol.left || []).filter((id) => id !== sectionKey)
    const currentRight = (configsStore.configs.general.layout.order.twoCol.right || []).filter(
      (id) => id !== sectionKey
    )
    configsStore.updateOrder("twoCol", { left: currentLeft, right: currentRight })

    const currentOrder = (configsStore.configs.general.layout.order.oneCol || []).filter((id) => id !== sectionKey)
    configsStore.updateOrder("oneCol", currentOrder)
  }

  return { addSection, removeSection }
}
