import { computed } from "vue"
import type { VNode } from "vue"
import { createVNodeFromHtmlTag } from "~/utils/preview/core/html"

export function useHtmlTransformers() {
  const { linkStyles } = useLinkConfigs()

  return computed(() => [
    {
      matches: (element: Element) =>
        ["p", "em", "u", "strong", "ul", "ol", "li", "a"].includes(element.tagName.toLowerCase()),
      transform: (element: Element, children: VNode[]) =>
        createVNodeFromHtmlTag(element, children, linkStyles.value)
    }
  ])
}
