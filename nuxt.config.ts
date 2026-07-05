import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    preset: "vercel",
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
    "@vueuse/motion/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    "@nuxtjs/sitemap"
  ],
  fonts: {
    defaults: {
      weights: [300, 400, 500, 700],
      styles: ["normal", "italic"],
      subsets: ["cyrillic-ext", "cyrillic", "greek-ext", "greek", "vietnamese", "latin-ext", "latin"]
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
      typedOptionsAndMessages: "all"
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "weave-cv:language",
      redirectOn: "root",
      alwaysRedirect: false
    }
  },
  runtimeConfig: {
    resendApiKey: "",
    feedbackToEmail: "",
    feedbackFromEmail: "",
    public: {
      motion: {
        directives: {
          "pop-bottom": {
            initial: {
              scale: 0,
              opacity: 0,
              y: 100
            },
            visible: {
              scale: 1,
              opacity: 1,
              y: 0
            }
          }
        }
      }
    }
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
      sourcemap: false
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
