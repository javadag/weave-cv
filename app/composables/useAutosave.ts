import { onBeforeRouteLeave } from "vue-router"

const SAVE_DEBOUNCE_MS = 2 * 1000
const AUTOSAVE_INTERVAL_MS = 30 * 1000
const storageKey = (id: string) => `autosave_${id}`

export function useAutosave(resumeId: Ref<string>) {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const { title, personal, core } = storeToRefs(resumeStore)
  const { configs } = storeToRefs(configsStore)
  const toast = useToast()
  const { initialized } = useStoreReady()

  const isOnline = useOnline()
  const isDirty = ref(false)
  const isSaving = ref(false)
  const lastSavedAt = ref<Date | null>(null)
  const hasPendingOfflineChanges = ref(false)

  let revision = 0
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let saveTail: Promise<boolean> = Promise.resolve(true)

  const getPayload = () => ({
    title: title.value,
    content: { personal: personal.value, core: core.value },
    configs: configs.value
  })

  const runSave = async (): Promise<boolean> => {
    isSaving.value = true
    const savedRevision = revision
    try {
      await $fetch(`/api/resumes/${resumeId.value}`, {
        method: "PUT",
        body: getPayload()
      })
      // Only treat the save as done if nothing changed while it was in flight,
      // otherwise a stale response would clear the dirty flag for newer edits.
      if (revision === savedRevision) {
        isDirty.value = false
        lastSavedAt.value = new Date()
        localStorage.removeItem(storageKey(resumeId.value))
        hasPendingOfflineChanges.value = false
      }
      return true
    } catch {
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Serialize saves so concurrent requests can never drop newer changes.
  const saveToServer = (): Promise<boolean> => {
    const tail = saveTail
    const result = (async () => {
      await tail
      return runSave()
    })()
    saveTail = result
    return result
  }

  const saveOffline = () => {
    localStorage.setItem(
      storageKey(resumeId.value),
      JSON.stringify({ payload: getPayload(), savedAt: new Date().toISOString() })
    )
    hasPendingOfflineChanges.value = true
    isDirty.value = false
  }

  const backgroundSave = async (shouldShowSyncToast = false) => {
    if (!isDirty.value && !hasPendingOfflineChanges.value) return
    if (isOnline.value) {
      const ok = await saveToServer()
      if (ok && shouldShowSyncToast) {
        toast.add({ title: "Back online", description: "Offline changes have been synced", color: "success" })
      }
    } else {
      saveOffline()
    }
  }

  const scheduleSave = (delay = SAVE_DEBOUNCE_MS) => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveTimer = null
      backgroundSave()
    }, delay)
  }

  const flushPendingSave = () => {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
    backgroundSave()
  }

  // Called by the save button — always saves current state
  const save = async (): Promise<boolean> => {
    if (isOnline.value) return saveToServer()
    saveOffline()
    return false
  }

  // Track dirty state — skip changes from initial store population
  watch(
    [title, personal, core, configs],
    () => {
      if (!initialized.value) return
      revision++
      isDirty.value = true
      scheduleSave()
    },
    { deep: true }
  )

  onMounted(() => {
    if (localStorage.getItem(storageKey(resumeId.value))) {
      hasPendingOfflineChanges.value = true
    }
  })

  // Best-effort save before navigating away inside the app
  onBeforeRouteLeave(() => {
    flushPendingSave()
  })

  // Safety net / retry for saves that fail or slip through the watcher
  useIntervalFn(() => backgroundSave(), AUTOSAVE_INTERVAL_MS)

  watch(isOnline, (online, wasOnline) => {
    if (online && !wasOnline) backgroundSave(true)
  })

  return { isDirty, isSaving, lastSavedAt, isOnline, hasPendingOfflineChanges, save }
}
