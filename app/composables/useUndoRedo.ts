/* eslint-disable unicorn/prefer-structured-clone */
import type { TConfigs } from "~/utils/schemas/configs/configs.schema"
import type { TCoreSections, TPersonalContent } from "~/utils/schemas/content.schema"

const MAX_HISTORY = 30
const DEBOUNCE_MS = 500

type Snapshot = {
  personal: TPersonalContent
  core: TCoreSections
  configs: TConfigs
}

export function useUndoRedo() {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const { personal, core } = storeToRefs(resumeStore)
  const { configs } = storeToRefs(configsStore)

  const stack: Snapshot[] = []
  const pointer = ref(-1)
  let isRestoring = false
  let initialized = false
  let timer: ReturnType<typeof setTimeout> | null = null

  const takeSnapshot = (): Snapshot => ({
    personal: JSON.parse(JSON.stringify(personal.value)),
    core: JSON.parse(JSON.stringify(core.value)),
    configs: JSON.parse(JSON.stringify(configs.value))
  })

  const commit = () => {
    if (pointer.value < stack.length - 1) {
      stack.splice(pointer.value + 1)
    }
    stack.push(takeSnapshot())
    if (stack.length > MAX_HISTORY) stack.shift()
    pointer.value = stack.length - 1
  }

  const scheduleCommit = () => {
    if (isRestoring || !initialized) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      commit()
    }, DEBOUNCE_MS)
  }

  const flushPending = () => {
    if (!timer) return
    clearTimeout(timer)
    timer = null
    commit()
  }

  watch([personal, core, configs], scheduleCommit, { deep: true })

  watch([personal, core], ([p, c]) => {
    if (p && c && !initialized) {
      nextTick(() => {
        initialized = true
        stack.length = 0
        stack.push(takeSnapshot())
        pointer.value = 0
      })
    }
  })

  const canUndo = computed(() => pointer.value > 0)
  const canRedo = computed(() => pointer.value < stack.length - 1)

  const applySnapshot = (snap: Snapshot) => {
    isRestoring = true
    resumeStore.setContent({ personal: snap.personal, core: snap.core })
    configsStore.setConfigs(snap.configs)
    nextTick(() => {
      isRestoring = false
    })
  }

  const undo = () => {
    flushPending()
    if (!canUndo.value) return
    pointer.value--
    applySnapshot(stack[pointer.value]!)
  }

  const redo = () => {
    flushPending()
    if (!canRedo.value) return
    pointer.value++
    applySnapshot(stack[pointer.value]!)
  }

  return { canUndo, canRedo, undo, redo }
}
