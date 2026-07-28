export function useStoreReady() {
  const { personal, core } = storeToRefs(useResumeStore())
  const initialized = ref(false)

  watch([personal, core], ([p, c]) => {
    if (p && c && !initialized.value) {
      nextTick(() => {
        initialized.value = true
      })
    }
  })

  return { initialized }
}
