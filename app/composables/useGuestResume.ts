const GUEST_PENDING_KEY = "guest_resume_pending"
const GUEST_DATA_KEY = "guest_resume_data"

export function useGuestResume() {
  const toast = useToast()
  const { t } = useI18n()

  const hasPending = computed(() => localStorage.getItem(GUEST_PENDING_KEY) === "true")

  function saveGuestResume(data: { title: string; content: unknown; configs: unknown }) {
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data))
    localStorage.setItem(GUEST_PENDING_KEY, "true")
  }

  function clearGuestResume() {
    localStorage.removeItem(GUEST_DATA_KEY)
    localStorage.removeItem(GUEST_PENDING_KEY)
  }

  async function importGuestResume() {
    if (!hasPending.value) return null

    const raw = localStorage.getItem(GUEST_DATA_KEY)
    if (!raw) {
      clearGuestResume()
      return null
    }

    let data: { title: string; content: unknown; configs: unknown }
    try {
      data = JSON.parse(raw)
    } catch {
      clearGuestResume()
      return null
    }

    try {
      const resume = await $fetch("/api/resumes", {
        method: "POST",
        body: { title: data.title, content: data.content, configs: data.configs }
      })
      clearGuestResume()
      toast.add({
        title: t("try.guestImported"),
        color: "success"
      })
      return resume
    } catch {
      toast.add({
        title: t("try.importFailed"),
        color: "error"
      })
      return null
    }
  }

  return { hasPending, saveGuestResume, importGuestResume, clearGuestResume }
}
