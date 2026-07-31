<script setup lang="ts">
import { FetchError } from "ofetch"

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const modelValue = defineModel<boolean>({ default: false })

const route = useRoute()
const toast = useToast()
const { t } = useI18n()

const resumeId = computed(() => route.params.id as string)

const { data: publishData, refresh: refreshPublishState } = useFetch<{
  is_public: boolean | null
  slug: string | null
  public_view_count: number | null
}>(`/api/resumes/${resumeId.value}`, {
  method: "GET",
  lazy: true,
  transform: (data: Record<string, unknown>) => ({
    is_public: (data.is_public as boolean) ?? false,
    slug: (data.slug as string) ?? null,
    public_view_count: (data.public_view_count as number) ?? 0
  })
})

const isPublic = computed(() => publishData.value?.is_public ?? false)
const slug = computed(() => publishData.value?.slug ?? null)
const viewCount = computed(() => publishData.value?.public_view_count ?? 0)

const publicUrl = computed(() => {
  if (slug.value === null || slug.value === "") return ""
  const origin = typeof globalThis !== "undefined" && globalThis.location ? location.origin : "https://weavecv.app"
  return `${origin}/r/${slug.value}`
})

const isToggling = ref(false)
const isCopied = ref(false)

async function handleToggle() {
  if (props.disabled || isToggling.value) return
  isToggling.value = true

  try {
    const updated = await $fetch<{
      is_public: boolean
      slug: string | null
      public_view_count: number | null
    }>(`/api/resumes/${resumeId.value}/publish`, {
      method: "PATCH",
      body: { is_public: !isPublic.value }
    })

    publishData.value = updated
    toast.add({
      title: t(updated.is_public ? "editor.share.publishSuccess" : "editor.share.unpublishSuccess"),
      color: "success"
    })
  } catch (error) {
    toast.add({
      title: t("editor.share.updateError"),
      description: error instanceof FetchError ? error.statusMessage : (error as Error).message,
      color: "error"
    })
  } finally {
    isToggling.value = false
  }
}

async function handleCopyUrl() {
  if (!publicUrl.value) return
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch {
    toast.add({
      title: t("editor.share.copyError"),
      color: "error"
    })
  }
}

function openPublicPage() {
  if (publicUrl.value) {
    open(publicUrl.value, "_blank")
  }
}

watch(modelValue, (open) => {
  if (!open) return
  isCopied.value = false
  refreshPublishState()
})
</script>

<template>
  <UModal
    v-model:open="modelValue"
    :ui="{
      content: 'sm:max-w-lg'
    }"
  >
    <template #content>
      <UCard
        :ui="{
          body: 'p-4 sm:p-6'
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/10 dark:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            >
              <UIcon name="i-lucide-share-2" class="text-primary size-5" />
            </div>
            <div>
              <h3 class="text-default text-lg font-semibold">{{ $t("editor.share.title") }}</h3>
              <p class="text-muted mt-1 text-sm">{{ $t("editor.share.subtitle") }}</p>
            </div>
          </div>
        </template>
        <div class="border-muted flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-default font-medium">{{ $t("editor.share.toggleLabel") }}</p>
            <p class="text-muted text-sm">
              {{ isPublic ? $t("editor.share.publishedDesc") : $t("editor.share.unpublishedDesc") }}
            </p>
          </div>
          <USwitch
            :model-value="isPublic"
            :disabled="props.disabled || isToggling"
            :loading="isToggling"
            @update:model-value="handleToggle"
          />
        </div>
        <div v-if="isPublic && publicUrl" class="mt-4 space-y-1">
          <label class="text-sm font-medium">{{ $t("editor.share.publicUrl") }}</label>
          <div class="flex gap-2">
            <UInput :model-value="publicUrl" readonly class="flex-1" />
            <UButton
              :icon="isCopied ? 'i-lucide-check' : 'i-lucide-copy'"
              :color="isCopied ? 'success' : 'neutral'"
              variant="outline"
              :title="$t('editor.share.copyLink')"
              @click="handleCopyUrl"
            />
            <UButton
              icon="i-lucide-external-link"
              color="neutral"
              variant="outline"
              :title="$t('editor.share.copyLink')"
              @click="openPublicPage"
            />
          </div>
          <Transition name="fade">
            <p v-if="isCopied" class="text-success text-xs">{{ $t("editor.share.linkCopied") }}</p>
          </Transition>
        </div>
        <div v-if="isPublic" class="text-muted mt-4 flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-eye" class="size-4" />
          <span>{{ $t("editor.share.views", { count: viewCount }) }}</span>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="ghost"
              @click="
                () => {
                  modelValue = false
                }
              "
            >
              {{ $t("editor.share.done") }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
