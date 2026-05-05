<script setup lang="ts">
import { computed, Fragment, h } from "vue"
import type { TSeparator } from "~/utils/schemas/shared.schema"
import LinkIcon from "../../advanced/content/LinkIcon.vue"

interface Props {
  html: string
  separator: TSeparator
}

const props = defineProps<Props>()

const { linkStyles } = useLinkConfigs()

const SEPARATOR_CHARS: Record<TSeparator, string> = {
  pipe: " | ",
  dash: " — ",
  slash: " / ",
  dot: " • ",
  comma: ", ",
  none: " "
}

function isNodeEmpty(node: Node): boolean {
  const name = node.nodeName.toLowerCase()
  if (name !== "p" && name !== "li") return false
  const children = [...node.childNodes]
  if (children.length === 0) return true
  if (children[0]?.nodeName.toLowerCase() === "br") return true
  return children.every((c) => !c.textContent?.trim())
}

type ProcessResult = VNode | string | null

function processNode(
  node: Node,
  isFirst: boolean,
  sep: string,
  styles: typeof linkStyles.value
): ProcessResult {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent

  const name = node.nodeName.toLowerCase()
  const childResults = [...node.childNodes]
    .map((child, i) => processNode(child, isFirst && i === 0, sep, styles))
    .filter((c): c is VNode | string => c !== null)

  if (name === "li") {
    if (isNodeEmpty(node)) return null
    const content = h(Fragment, childResults)
    return isFirst ? content : h("span", [sep, content])
  }

  switch (name) {
    case "strong": {
      return h("strong", { style: { fontWeight: "bold" } }, childResults)
    }
    case "em": {
      return h("em", { style: { fontStyle: "italic" } }, childResults)
    }
    case "u": {
      return h("u", { style: { textDecoration: "underline" } }, childResults)
    }
    case "a": {
      const href = (node as HTMLAnchorElement).getAttribute("href")
      if (!href) return h("span", childResults)
      return h(
        "span",
        { style: { display: "inline-flex", alignItems: "center", gap: "0.2em" } },
        [
          h("a", { href, target: "_blank", rel: "noopener noreferrer", style: styles }, childResults),
          h(LinkIcon)
        ]
      )
    }
    default: {
      return childResults.length > 0 ? h(Fragment, childResults) : null
    }
  }
}

const renderContent = computed(() => {
  const html = props.html
  const sep = SEPARATOR_CHARS[props.separator] ?? ", "
  const styles = linkStyles.value

  if (!html) return () => null

  return () => {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html")
      const nodes = [...doc.body.childNodes]
        .map((node, i) => processNode(node, i === 0, sep, styles))
        .filter((n): n is VNode | string => n !== null)
      return h(Fragment, nodes)
    } catch {
      return h("span", html)
    }
  }
})
</script>

<template>
  <component :is="renderContent" />
</template>
