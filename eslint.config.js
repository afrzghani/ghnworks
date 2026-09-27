import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import hooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'qa/**', 'studio/dist/**', 'studio/.sanity/**'] },
  js.configs.recommended,
  { files: ['content/**/*.ts', 'studio/**/*.ts', 'scripts/**/*.mjs'], languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly' } } },
  ...tseslint.configs.recommended,
  { files: ['src/**/*.{ts,tsx}'], plugins: { 'react-hooks': hooks }, rules: hooks.configs.recommended.rules },
)
