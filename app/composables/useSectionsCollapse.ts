// Shared collapse state for all section forms
const isAllCollapsed = ref(false)

export function useSectionsCollapse() {
  function toggle() {
    isAllCollapsed.value = !isAllCollapsed.value
  }

  return {
    isAllCollapsed: readonly(isAllCollapsed),
    toggle
  }
}
