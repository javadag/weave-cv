import { ref, unref, watch, type Ref } from "vue"
import type { TSectionsOrder } from "~/utils/preview/core/layoutGenerator"
import { generateBlocks } from "~/utils/preview/core/pageOrchestrator"
import { paginate } from "~/utils/preview/core/pagination"
import type { TBlocks } from "~/utils/preview/core/types"

const DEBOUNCE_DELAY = 20

export function useGeneratePages(sectionsOrder: Ref<TSectionsOrder>) {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const previewStore = usePreviewStore()

  const { core } = storeToRefs(resumeStore)
  const { configs } = storeToRefs(configsStore)
  const { blocks } = storeToRefs(previewStore)

  const pages = ref<TBlocks[][]>([[]])

  const updatePages = () => {
    const page = generateBlocks(unref(sectionsOrder))

    if (!blocks.value) return

    pages.value = paginate({
      blocks: blocks.value,
      page
    })
  }

  previewStore.setUpdateHeightCallback(useDebounceFn(updatePages, DEBOUNCE_DELAY))

  watch(
    [
      () => unref(sectionsOrder),
      core,
      () => configs.value.general.layout.verticalMargin,
      () => configs.value.general.layout.horizontalMargin,
      () => configs.value.general.layout.size
    ],
    updatePages,
    {
      deep: true,
      immediate: true
    }
  )

  return pages
}
