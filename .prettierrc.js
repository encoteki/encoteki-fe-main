import * as prettierPluginTailwindcss from 'prettier-plugin-tailwindcss'

const config = {
  plugins: [prettierPluginTailwindcss],
  tailwindStylesheet: './src/styles/globals.css',
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'auto',
}

export default config
