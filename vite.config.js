import react from '@vitejs/plugin-react-swc'
import { dirname, resolve } from 'path'
import preprocessorDirectives from 'unplugin-preprocessor-directives/vite'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import jsconfigPaths from 'vite-jsconfig-paths'
import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'

import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(dirname(fileURLToPath(import.meta.url)), 'src/style'),
    },
  },
  plugins: [
    react(),
    jsconfigPaths(),
    eslint(),
    stylelint(),
    preprocessorDirectives(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/ws': {
        target: 'http://127.0.0.1:8000',
        ws: true,
      },
    },
  },
  define: {
    'import.meta.env.DAKARA_VERSION': JSON.stringify(packageJson.version),
    'import.meta.env.DAKARA_BUGTRACKER': JSON.stringify(packageJson.bugs.url),
    'import.meta.env.DAKARA_PROJECT_HOMEPAGE': JSON.stringify(
      packageJson.homepage
    ),
  },
})
