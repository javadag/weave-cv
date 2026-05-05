import DOMPurify from "dompurify"
import type { VNode } from "vue"
import { h } from "vue"
import LinkIcon from "~/components/resume/preview/advanced/content/LinkIcon.vue"
import ListItem from "~/components/resume/preview/advanced/content/ListItem.vue"

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: ["href", "title", "alt", "rel", "target", "class", "style", "data-type"]
  })
}

function parseHtmlToDomElement(html: string): HTMLElement {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  return doc.body
}

export interface HtmlNodeTransformer {
  matches: (node: Element) => boolean
  transform: (node: Element, children: VNode[]) => VNode | null
}

type NodeTraversalResult = VNode | string | null

function traverseDomNode(node: Node, transformers: HtmlNodeTransformer[]): NodeTraversalResult {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent
    return text?.trim() ? text : null
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    const childNodes: (VNode | string)[] = []

    for (const childNode of element.childNodes) {
      const result = traverseDomNode(childNode, transformers)
      if (result !== null) {
        childNodes.push(result)
      }
    }

    for (const transformer of transformers) {
      if (transformer.matches(element)) {
        const childrenAsVNodes: VNode[] = childNodes.map((child) =>
          typeof child === "string" ? h("span", child) : child
        )
        return transformer.transform(element, childrenAsVNodes)
      }
    }

    const tagName = element.tagName.toLowerCase()
    return h(tagName, {}, childNodes)
  }

  return null
}

export function convertHtmlToVNodes(rawHtml: string, transformers: HtmlNodeTransformer[]): VNode[] {
  if (!rawHtml?.trim()) {
    return []
  }

  const sanitizedHtml = sanitizeHtml(rawHtml)
  const domRoot = parseHtmlToDomElement(sanitizedHtml)
  const vnodes: VNode[] = []

  for (const childNode of domRoot.childNodes) {
    const result = traverseDomNode(childNode, transformers)
    if (result) {
      if (typeof result === "string") {
        vnodes.push(h("span", result))
      } else {
        vnodes.push(result)
      }
    }
  }

  return vnodes
}

interface TextStyleOptions {
  tagName?: string
  inlineStyles?: Record<string, string>
}

function parseInlineStyles(styleString: string): Record<string, string> {
  const styles: Record<string, string> = {}
  if (!styleString?.trim()) {
    return styles
  }

  const declarations = styleString
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
  for (const declaration of declarations) {
    const [property, value] = declaration.split(":").map((s) => s.trim())
    if (property && value) {
      const camelProperty = property
        .split("-")
        .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join("")
      styles[camelProperty] = value
    }
  }

  return styles
}

function computeTextStyles({ tagName, inlineStyles = {} }: TextStyleOptions) {
  const styles: Record<string, string> = {}

  Object.assign(styles, inlineStyles)

  // Handle semantic tag styles (only if not already set by inline styles)
  if (tagName && !styles.fontWeight && !styles.fontStyle && !styles.textDecoration) {
    const normalizedTag = tagName.toLowerCase()
    switch (normalizedTag) {
      case "strong": {
        styles.fontWeight = "bold"
        break
      }
      case "em": {
        styles.fontStyle = "italic"
        break
      }
      case "u": {
        styles.textDecoration = "underline"
        break
      }
    }
  }

  return styles
}

const SUPPORTED_TEXT_TAGS = ["p", "em", "u", "strong", "ul", "ol"] as const

export interface LinkStyleOptions {
  textDecoration: string
  textUnderlineOffset: string
  color: string
}

export function createVNodeFromHtmlTag(
  element: Element,
  children: VNode[],
  linkStyles?: LinkStyleOptions
): VNode | null {
  const tagName = element.tagName.toLowerCase()
  const href = element.getAttribute("href") || ""
  const styleAttribute = element.getAttribute("style") || ""

  const inlineStyles = parseInlineStyles(styleAttribute)
  const styles = computeTextStyles({ tagName, inlineStyles })

  if (SUPPORTED_TEXT_TAGS.includes(tagName as (typeof SUPPORTED_TEXT_TAGS)[number])) {
    return h(tagName, { style: styles }, children)
  }

  if (tagName === "li") {
    return h(ListItem, { style: styles }, { default: () => children })
  }

  if (tagName === "a") {
    if (!href) {
      return h("span", { style: styles }, children)
    }

    const anchorStyles = { ...styles, ...linkStyles }

    return h(
      "a",
      {
        target: "_blank",
        href,
        rel: "noopener noreferrer",
        style: anchorStyles
      },
      [h("span", null, children), h(LinkIcon)]
    )
  }

  return null
}
