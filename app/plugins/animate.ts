const ANIM_CLASS = "anim-scroll"
const VISIBLE_CLASS = "anim-visible"

export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  if (import.meta.client) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            requestAnimationFrame(() => {
              el.classList.add(VISIBLE_CLASS)
            })
            observer!.unobserve(el)
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
  }

  nuxtApp.vueApp.directive("animate", {
    getSSRProps(binding) {
      const type = binding.arg || "fade-up"
      return { class: `${ANIM_CLASS} anim-type-${type}` }
    },
    mounted(el: HTMLElement, binding) {
      const type = binding.arg || "fade-up"
      el.classList.add(ANIM_CLASS, `anim-type-${type}`)
      if (observer) observer.observe(el)
    },
    unmounted(el: HTMLElement) {
      if (observer) observer.unobserve(el)
    }
  })
})
