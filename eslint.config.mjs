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
    "unicorn/logical-assignment-operators": "off",
    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/no-multiple-template-root": "off",
    "unicorn/name-replacements": "off",
    // Pinia stores use `this` in actions/getters — this is by design
    "unicorn/no-this-outside-of-class": "off",
    // Template/HTML processing uses replaceAll with dynamic values intentionally
    "unicorn/no-unsafe-string-replacement": "off",
    // Module-level caching pattern (assign inside function to update module-level var)
    "unicorn/no-top-level-assignment-in-function": "off"
  }
})
