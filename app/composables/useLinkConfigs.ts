import { computed, unref, type MaybeRef } from "vue"

export function useLinkConfigs(url?: MaybeRef<string | undefined>) {
  const configsStore = useConfigsStore()
  const { configs } = storeToRefs(configsStore)

  const linksConfig = computed(() => configs.value.general.links)

  const urlRef = computed(() => unref(url))

  const isLink = computed(() => {
    const urlValue = urlRef.value
    return !!urlValue && urlValue.trim() !== ""
  })

  const linkAttributes = computed(() => {
    if (!isLink.value) return {}

    return {
      href: urlRef.value,
      target: "_blank",
      rel: "noopener noreferrer"
    }
  })

  const linkStyles = computed<{ textDecoration: string; textUnderlineOffset: string; color: string }>(() => {
    return {
      textDecoration: linksConfig.value.underline ? "underline" : "none",
      textUnderlineOffset: linksConfig.value.underline ? "0.15em" : "0",
      color: linksConfig.value.color
    }
  })
  const linkIconStyles = computed(() => {
    return {
      visible: linksConfig.value.icon.visible,
      color: linksConfig.value.icon.color,
      type: linksConfig.value.icon.type
    }
  })

  return {
    isLink,
    linkAttributes,
    linkStyles,
    linkIconStyles
  }
}
