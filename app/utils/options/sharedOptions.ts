import type { TAlign, TIconStyle, TSeparator, TSide, TVariant, TVariantSimple } from "../schemas/shared.schema"

export function getAlignOptions(t: (key: string) => string): { label: string; value: TAlign }[] {
  return [
    { label: t("editor.configs.alignOptions.left"), value: "left" },
    { label: t("editor.configs.alignOptions.center"), value: "center" },
    { label: t("editor.configs.alignOptions.right"), value: "right" }
  ]
}

export function getVariantSimpleOptions(t: (key: string) => string): { label: string; value: TVariantSimple }[] {
  return [
    { label: t("editor.configs.variantSimpleOptions.inline"), value: "inline" },
    { label: t("editor.configs.variantSimpleOptions.stacked"), value: "stacked" }
  ]
}

export function getVariantOptions(t: (key: string) => string): { label: string; value: TVariant }[] {
  return [
    { label: t("editor.configs.variantOptions.grid"), value: "grid" },
    { label: t("editor.configs.variantOptions.stacked"), value: "stacked" },
    { label: t("editor.configs.variantOptions.inline"), value: "inline" }
  ]
}

export function getSeparatorOptions(t: (key: string) => string): { label: string; value: TSeparator }[] {
  return [
    { label: t("editor.configs.separatorOptions.pipe"), value: "pipe" },
    { label: t("editor.configs.separatorOptions.dot"), value: "dot" },
    { label: t("editor.configs.separatorOptions.dash"), value: "dash" },
    { label: t("editor.configs.separatorOptions.comma"), value: "comma" },
    { label: t("editor.configs.separatorOptions.slash"), value: "slash" },
    { label: t("editor.configs.separatorOptions.none"), value: "none" }
  ]
}

export function getIconAlignOptions(t: (key: string) => string): { label: string; value: TSide }[] {
  return [
    { label: t("editor.configs.iconAlignOptions.left"), value: "left" },
    { label: t("editor.configs.iconAlignOptions.right"), value: "right" }
  ]
}

export function getIconStyleOptions(t: (key: string) => string): { label: string; value: TIconStyle }[] {
  return [
    { label: t("editor.configs.iconStyleOptions.simple"), value: "simple" },
    { label: t("editor.configs.iconStyleOptions.filledRounded"), value: "filledRounded" },
    { label: t("editor.configs.iconStyleOptions.filledSquare"), value: "filledSquare" },
    { label: t("editor.configs.iconStyleOptions.outlineRounded"), value: "outlineRounded" },
    { label: t("editor.configs.iconStyleOptions.outlineSquare"), value: "outlineSquare" }
  ]
}

export function getPhotoPositionOptions(t: (key: string) => string): { label: string; value: "left" | "right" | "top" }[] {
  return [
    { label: t("editor.configs.photoPositionOptions.left"), value: "left" },
    { label: t("editor.configs.photoPositionOptions.right"), value: "right" },
    { label: t("editor.configs.photoPositionOptions.top"), value: "top" }
  ]
}

export function getTitleStyleOptions(t: (key: string) => string): { label: string; value: "colon" | "bracket" | "dash" | "none" }[] {
  return [
    { label: t("editor.configs.titleStyleOptions.colon"), value: "colon" },
    { label: t("editor.configs.titleStyleOptions.bracket"), value: "bracket" },
    { label: t("editor.configs.titleStyleOptions.dash"), value: "dash" },
    { label: t("editor.configs.titleStyleOptions.none"), value: "none" }
  ]
}

export function getPhotoShapeOptions(t: (key: string) => string): { label: string; value: "circle" | "rounded" | "square" }[] {
  return [
    { label: t("editor.configs.photoShapeOptions.circle"), value: "circle" },
    { label: t("editor.configs.photoShapeOptions.rounded"), value: "rounded" },
    { label: t("editor.configs.photoShapeOptions.square"), value: "square" }
  ]
}
