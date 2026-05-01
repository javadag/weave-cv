/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  bracketSameLine: false,
  printWidth: 120,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"]
}

export default config
