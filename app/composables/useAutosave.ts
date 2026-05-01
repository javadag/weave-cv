const AUTOSAVE_INTERVAL_MS = 2 * 60 * 1000
const storageKey = (id: string) => `autosave_${id}`

export function useAutosave(resumeId: Ref<string>) {
  const resumeStore = useResumeStore()
  const configsStore = useConfigsStore()
  const { title, personal, core } = storeToRefs(resumeStore)
  const { configs } = storeToRefs(configsStore)
  const toast = useToast()

  const isOnline = useOnline()
  const isDirty = ref(false)
  const isSaving = ref(false)
  const lastSavedAt = ref<Date | null>(null)
  const hasPendingOfflineChanges = ref(false)

  let initialized = false

  const getPayload = () => ({
    title: title.value,
    content: { personal: personal.value, core: core.value },
    configs: configs.value
  })

  const saveToServer = async (): Promise<boolean> => {
    if (isSaving.value) return false
    isSaving.value = true
    try {
      await $fetch(`/api/resumes/${resumeId.value}`, {
        method: "PUT",
        body: getPayload()
      })
      isDirty.value = false
      lastSavedAt.value = new Date()
      localStorage.removeItem(storageKey(resumeId.value))
      hasPendingOfflineChanges.value = false
      return true
    } catch {
      return false
    } finally {
      isSaving.value = false
    }
  }

  const saveOffline = () => {
    localStorage.setItem(
      storageKey(resumeId.value),
      JSON.stringify({ payload: getPayload(), savedAt: new Date().toISOString() })
    )
    hasPendingOfflineChanges.value = true
    isDirty.value = false
  }

  // Called by the save button — always saves current state
  const save = async (): Promise<boolean> => {
    if (isOnline.value) return saveToServer()
    saveOffline()
    return false
  }

  // Called by the timer and on reconnect — only runs if there's something to save
  const backgroundSave = async (showSyncToast = false) => {
    if (!isDirty.value && !hasPendingOfflineChanges.value) return
    if (isOnline.value) {
      const ok = await saveToServer()
      if (ok && showSyncToast) {
        toast.add({ title: "Back online", description: "Offline changes have been synced", color: "success" })
      }
    } else {
      saveOffline()
    }
  }

  // Track dirty state — skip changes from initial store population
  watch(
    [title, personal, core, configs],
    () => {
      if (!initialized) return
      isDirty.value = true
    },
    { deep: true }
  )

  // Mark initialized once the first real data load completes
  watch([personal, core], ([p, c]) => {
    if (p && c && !initialized)
      nextTick(() => {
        initialized = true
      })
  })

  onMounted(() => {
    if (localStorage.getItem(storageKey(resumeId.value))) {
      hasPendingOfflineChanges.value = true
    }
  })

  useIntervalFn(() => backgroundSave(), AUTOSAVE_INTERVAL_MS)

  watch(isOnline, (online, wasOnline) => {
    if (online && !wasOnline) backgroundSave(true)
  })

  return { isDirty, isSaving, lastSavedAt, isOnline, hasPendingOfflineChanges, save }
}
