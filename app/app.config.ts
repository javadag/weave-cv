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
      variants: {
        size: {
          lg: {
            base: "px-3 py-2 text-sm/5 lg:text-sm/5 gap-2"
          }
        }
      },
      slots: {
        base: "rounded-lg h-8 autofill:text-sm placeholder:text-sm rtl:placeholder:text-xs"
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
