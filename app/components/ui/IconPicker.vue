<script setup lang="ts">
import { POPULAR_ICONS } from "~/constants/icons"
import { getIcon } from "~/utils/preview/helpers"

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    disabled?: boolean
  }>(),
  {
    label: "Icon"
  }
)

const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const searchQuery = ref("")
const isOpen = ref(false)

const filteredIcons = computed(() => {
  if (!searchQuery.value.trim()) return POPULAR_ICONS
  const query = searchQuery.value.toLowerCase()
  return POPULAR_ICONS.filter((icon) => icon.toLowerCase().includes(query))
})

const selectedIconHtml = computed(() => {
  if (!props.modelValue) return ""
  return getIcon(props.modelValue, 20)
})

const selectIcon = (iconName: string) => {
  emit("update:modelValue", iconName)
  isOpen.value = false
  searchQuery.value = ""
}

const model = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v)
})
</script>

<template>
  <UPopover v-model:open="isOpen">
    <UButton :disabled="props.disabled" variant="outline" size="xs">
      <span v-if="selectedIconHtml" v-html="selectedIconHtml" />
      <span v-else>Select icon...</span>
    </UButton>
    <template #content>
      <div class="w-80 p-2">
        <UInput
          v-model="searchQuery"
          placeholder="Search icons..."
          size="sm"
          icon="i-lucide-search"
          class="mb-2"
          autofocus
        />
        <div class="max-h-64 overflow-y-auto">
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="icon in filteredIcons"
              :key="icon"
              type="button"
              class="hover:bg-muted hover:border-default flex items-center justify-center rounded border border-transparent p-2 transition-colors"
              :class="{ 'bg-primary/10 border-primary': modelValue === icon }"
              :title="icon"
              @click="selectIcon(icon)"
            >
              <span v-html="getIcon(icon, 20) || ''" />
            </button>
          </div>
          <div v-if="filteredIcons.length === 0" class="text-muted py-4 text-center text-sm">No icons found</div>
        </div>
        <div class="border-muted mt-2 border-t pt-2">
          <UInput
            v-model="model"
            placeholder="Or enter icon name manually"
            size="sm"
            class="text-xs"
            @keyup.enter="isOpen = false"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
