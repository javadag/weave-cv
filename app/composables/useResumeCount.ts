import type { TResume } from "~/types/resume.types"

export const useResumeCount = () => {
  const { data, pending, error, refresh } = useFetch<TResume[]>("/api/resumes", {
    method: "GET",
    lazy: true,
    key: "dashboard-resumes"
  })

  const count = computed(() => data.value?.length ?? 0)

  return { resumes: data, count, pending, error, refresh }
}
