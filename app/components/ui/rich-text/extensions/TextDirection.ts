import { Extension } from "@tiptap/core"

export type TextDirectionValue = "ltr" | "rtl"

const TEXT_DIRECTION_TYPES = ["paragraph", "heading", "listItem"] as const

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (dir: TextDirectionValue) => ReturnType
    }
  }
}

export const TextDirection = Extension.create({
  name: "textDirection",

  addGlobalAttributes() {
    return [
      {
        types: [...TEXT_DIRECTION_TYPES],
        attributes: {
          dir: {
            default: null,
            parseHTML: (element) => {
              const dir = element.getAttribute("dir")
              return dir === "ltr" || dir === "rtl" ? dir : null
            },
            renderHTML: (attributes) => {
              const dir = attributes.dir
              if (dir !== "ltr" && dir !== "rtl") {
                return {}
              }
              return { dir }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setTextDirection:
        (dir) =>
        ({ state, dispatch }) => {
          const { tr } = state
          let hasChanged = false

          state.doc.descendants((node, pos) => {
            if (
              (TEXT_DIRECTION_TYPES as readonly string[]).includes(node.type.name) &&
              node.attrs.dir !== dir
            ) {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, dir })
              hasChanged = true
            }
            return true
          })

          if (!hasChanged) return false
          if (dispatch) dispatch(tr)
          return true
        }
    }
  }
})
