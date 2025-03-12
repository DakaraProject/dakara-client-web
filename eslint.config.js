import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import js from '@eslint/js'
import prettier from "eslint-plugin-prettier/recommended"
import react from 'eslint-plugin-react'

export default [
  {
    ignores: [
      'dist',
      'node_modules',
    ],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: [
        '**/*.{js,jsx}'
    ],

    languageOptions: {
        globals: globals.browser,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },

    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'simple-import-sort': simpleImportSort,
    },

    settings: {
        react: {
            version: 'detect'
        },
        "import/resolver": {
            node: {
              extensions: [".js", ".jsx"],
              moduleDirectory: ['node_modules', 'src/'],
            },
        },
    },

    rules: {
        ...reactHooks.configs.recommended.rules,

        'react-refresh/only-export-components': ['warn', {
            allowConstantExport: true,
        }],

        'no-class-assign': 'off',
        'no-unused-vars': [
            'error',
            {
                args: 'none',
            }
        ],

        'simple-import-sort/imports': ['error', {
            groups: [['^\\u0000'], ['^@?\\w'], [
                '^(actions|components|eventManagers|middleware|permissions|reducers|serverPropTypes|style|thirdpartyExtensions|utils)',
            ], ['^'], ['^\\.']],
        }],

        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',

        quotes: ['error', 'single'],
    },
  }
].concat(prettier)
