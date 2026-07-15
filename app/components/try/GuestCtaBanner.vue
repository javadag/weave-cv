<script setup lang="ts">
import { useResumeStore } from "~/stores/resume.store"
import { useConfigsStore } from "~/stores/configs.store"

const { t } = useI18n()
const resumeStore = useResumeStore()
const configsStore = useConfigsStore()
const { saveGuestResume } = useGuestResume()

const dismissed = ref(false)

async function handleSaveAndSignUp() {
  saveGuestResume({
    title: resumeStore.title,
    content: { personal: resumeStore.personal, core: resumeStore.core },
    configs: configsStore.configs
  })
  await navigateTo("/register")
}

async function handleSignIn() {
  saveGuestResume({
    title: resumeStore.title,
    content: { personal: resumeStore.personal, core: resumeStore.core },
    configs: configsStore.configs
  })
  await navigateTo("/login")
}
</script>

<template>
  <div v-if="!dismissed" class="border-default bg-default/95 sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-sm">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
          <UIcon name="i-lucide-sparkles" class="size-4" />
        </span>
        <p class="text-toned text-sm">
          {{ $t("try.ctaBanner") }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton size="sm" variant="outline" @click="handleSignIn">
          {{ $t("try.signIn") }}
        </UButton>
        <UButton size="sm" color="primary" @click="handleSaveAndSignUp">
          {{ $t("try.saveSignUp") }}
        </UButton>
        <UButton
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          aria-label="Dismiss"
          @click="() => { dismissed = true }"
        />
      </div>
    </div>
  </div>
</template>
