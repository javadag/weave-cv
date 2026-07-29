import { ref, unref, watch, type Ref } from "vue"
import type { TSectionsOrder } from "~/utils/preview/core/layoutGenerator"
import { generateBlocks } from "~/utils/preview/core/pageOrchestrator"
import { paginate } from "~/utils/preview/core/pagination"
import type { TPages } from "~/utils/preview/core/types"

const DEBOUNCE_DELAY = 20

export function useGeneratePages(sectionsOrder: Ref<TSectionsOrder>) {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const previewStore = usePreviewStore()

  const { core } = storeToRefs(resumeStore)
  const { configs } = storeToRefs(configsStore)
  const { blocks } = storeToRefs(previewStore)

  const pages = ref<TPages>([[]])

  const updatePages = () => {
    // eslint-disable-next-line unicorn/no-declarations-before-early-exit -- page must be generated before the guard; pagination needs it even when blocks are null
    const page = generateBlocks(unref(sectionsOrder))

    if (!blocks.value) return

    pages.value = paginate({
      blocks: blocks.value,
      page
    })
  }

  const debouncedUpdatePages = useDebounceFn(updatePages, DEBOUNCE_DELAY)

  // Re-paginate when any block's height changes
  watch(blocks, debouncedUpdatePages, { deep: true })

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
