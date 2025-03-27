import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
    },

    rules: {
      ...reactHooksPlugin.configs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'no-class-assign': 'off',
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^@?\\w'],
            [
              '^(actions|components|eventManagers|middleware|permissions|reducers|serverPropTypes|style|thirdpartyExtensions|utils)',
            ],
            ['^'],
            ['^\\.'],
          ],
        },
      ],

      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': [
        'error',
        { ignore: ['unplugin-preprocessor-directives'] },
      ],

      quotes: ['error', 'single'],
    },
  },
].concat(prettierPlugin)
