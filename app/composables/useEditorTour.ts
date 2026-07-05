import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const STORAGE_KEY = "weave-cv-editor-tour-v1"

const checkFirstVisit = () => {
  if (globalThis.window !== undefined) {
    return !localStorage.getItem(STORAGE_KEY)
  }
  return false
}

export function useEditorTour() {
  const { t } = useI18n()
  const driverInstance = ref<ReturnType<typeof driver> | null>(null)
  const isTourActive = ref(false)

  const destroyDriver = () => {
    if (driverInstance.value) {
      driverInstance.value.destroy()
      driverInstance.value = null
    }
    isTourActive.value = false
  }

  const startTour = () => {
    destroyDriver()

    driverInstance.value = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      showButtons: ["next", "previous", "close"],
      steps: [
        {
          element: "#editor-toolbar",
          popover: {
            title: t("editor.tour.step1Title"),
            description: t("editor.tour.step1Desc"),
            side: "bottom" as const,
            align: "start" as const
          }
        },
        {
          element: "#editor-sections",
          popover: {
            title: t("editor.tour.step2Title"),
            description: t("editor.tour.step2Desc"),
            side: "right" as const,
            align: "start" as const
          }
        },
        {
          element: '#editor-add-section',
          popover: {
            title: t('editor.tour.step3Title'),
            description: t('editor.tour.step3Desc'),
            side: 'top' as const,
            align: 'start' as const,
          },
        },
        {
          element: "#editor-preview",
          popover: {
            title: t("editor.tour.step4Title"),
            description: t("editor.tour.step4Desc"),
            side: "top" as const,
            align: "center" as const
          }
        },
        {
          element: "#editor-configs",
          popover: {
            title: t("editor.tour.step5Title"),
            description: t("editor.tour.step5Desc"),
            side: "left" as const,
            align: "start" as const
          }
        },
        {
          element: "#editor-save-group",
          popover: {
            title: t("editor.tour.step6Title"),
            description: t("editor.tour.step6Desc"),
            side: "top" as const,
            align: "center" as const
          }
        },
        {
          popover: {
            title: t("editor.tour.step7Title"),
            description: t("editor.tour.step7Desc"),
            side: "top" as const,
            align: "center" as const
          }
        }
      ],
      onDestroyed: () => {
        isTourActive.value = false
        if (globalThis.window !== undefined) {
          localStorage.setItem(STORAGE_KEY, "true")
        }
        driverInstance.value = null
      }
    })

    isTourActive.value = true
    driverInstance.value.drive()
  }

  onUnmounted(() => {
    destroyDriver()
  })

  return {
    startTour,
    isTourActive: readonly(isTourActive),
    checkFirstVisit
  }
}
