export default defineAppConfig({
  ui: {
    colors: {
      primary: "orange",
      neutral: "zinc"
    },
    button: {
      slots: {
        base: "rounded-lg"
      }
    },
    input: {
      slots: {
        base: "rounded-lg"
      }
    },
    card: {
      slots: {
        root: "rounded-xl"
      }
    },
    switch: {
      slots: {
        root: "flex-row-reverse justify-between",
        wrapper: "ms-0 me-2"
      }
    }
  }
})
