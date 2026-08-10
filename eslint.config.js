import eslintJs from '@eslint/js'
import eslintPluginImport from 'eslint-plugin-import-x'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from '@eslint-react/eslint-plugin'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginYamllint from 'eslint-plugin-yamllint'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  eslintJs.configs.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginReact.configs.recommended,
  eslintPluginPrettier,
  ...eslintPluginYamllint.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      'react-refresh': eslintPluginReactRefresh,
    },

    settings: {
      // react: {
      //   version: 'detect',
      // },
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
    },

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      'no-class-assign': 'off',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'import-x/order': 'warn',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'warn',
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': [
        'error',
        { ignore: ['unplugin-preprocessor-directives'] },
      ],

      quotes: ['error', 'single'],
    },
  },
]
