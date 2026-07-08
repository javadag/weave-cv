import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    preset: process.env.GITHUB_ACTIONS ? "vercel" : "node-server",
    typescript: {
      tsConfig: {
        compilerOptions: {
          lib: ["ESNext", "DOM"]
        }
      }
    }
  },
  image: {
    provider: process.env.GITHUB_ACTIONS ? "vercel" : "ipx"
  },
  modules: [
    "@nuxtjs/supabase",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "reka-ui/nuxt",
    "@pinia/nuxt",
    "nuxt-tiptap-editor",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    "@nuxtjs/sitemap"
  ],
  fonts: {
    defaults: {
      weights: [300, 400, 500, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"]
    },
    families: [
      { name: "Inter", provider: "google" },
      { name: "Vazirmatn", provider: "local" }
    ]
  },
  i18n: {
    baseUrl: "https://weavecv.app",
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json", dir: "ltr" },
      { code: "fa", language: "fa-IR", name: "Persian (فارسی)", file: "fa.json", dir: "rtl" }
    ],
    experimental: {
      typedOptionsAndMessages: "all",
      stripMessagesPayload: true
    },
    detectBrowserLanguage: {
      cookieKey: "weave-cv:language"
    }
  },
  runtimeConfig: {
    resendApiKey: "",
    feedbackToEmail: "",
    feedbackFromEmail: ""
  },
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 512
    }
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules/@tiptap") || id.includes("node_modules/nuxt-tiptap-editor") || id.includes("node_modules/prosemirror")) {
              return "tiptap"
            }
            if (id.includes("node_modules/driver.js")) {
              return "driver"
            }
            if (id.includes("node_modules/@internationalized/date")) {
              return "intl-date"
            }
          }
        }
      }
    }
  },
  supabase: {
    types: "~/types/database.types.ts",
    redirectOptions: {
      exclude: ["/", "/register", "/forgot-password", "/reset-password"],
      include: ["/dashboard(/*)?", "/editor(/*)?", "/login"],
      login: "/login",
      callback: "/confirm"
    },
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: true
    }
  },
  routeRules: {
    "/": { prerender: true },
    "/editor/**": {
      ssr: false
    }
  },
  app: {
    head: {
      charset: "utf8",
      viewport: "width=device-width, initial-scale=1",
      title: "Weave CV - Create Professional Resumes",
      meta: [
        {
          name: "description",
          content: "Create professional resumes with ease. Build, edit, and download your resume in minutes."
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:site_name",
          content: "Weave CV"
        },
        {
          name: "twitter:card",
          content: "summary_large_image"
        }
      ]
    }
  },
  site: {
    url: "https://weavecv.app",
    name: "Weave CV"
  },
  sitemap: {
    zeroRuntime: true,
    exclude: ["/dashboard/**", "/editor/**", "/confirm", "/reset-password"]
  }
})
