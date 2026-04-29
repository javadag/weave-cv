import eslintConfigPrettier from "eslint-config-prettier/flat"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(eslintPluginUnicorn.configs.recommended, eslintConfigPrettier, {
  rules: {
    "vue/html-self-closing": "off",
    "unicorn/filename-case": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/no-for-loop": "off",
    "unicorn/no-null": "off",
    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/no-multiple-template-root": "off"
  }
})
