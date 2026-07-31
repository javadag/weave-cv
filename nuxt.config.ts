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
    "@nuxtjs/sitemap",
    "motion-v/nuxt"
  ],
  fonts: {
    defaults: {
      weights: [200, 300, 400, 500, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "arabic", "cyrillic"]
    }
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
    optimizeDeps: {
      include: ["zod"]
    },
    plugins: [tailwindcss()]
  },
  supabase: {
    types: "~/types/database.types.ts",
    redirectOptions: {
      exclude: ["/", "/r/**", "/register", "/forgot-password", "/reset-password"],
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
          property: "og:image",
          content: "https://weavecv.app/og-image.png"
        },
        {
          property: "og:image:width",
          content: "1200"
        },
        {
          property: "og:image:height",
          content: "630"
        },
        {
          name: "twitter:card",
          content: "summary_large_image"
        },
        {
          name: "twitter:image",
          content: "https://weavecv.app/og-image.png"
        }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
      ]
    }
  },
  site: {
    url: "https://weavecv.app",
    name: "Weave CV"
  },
  sitemap: {
    zeroRuntime: true,
    exclude: ["/dashboard/**", "/editor/**", "/confirm", "/reset-password", "/r/**"]
  }
})
