import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';
import checker from 'vite-plugin-checker';

import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    checker({
      enableBuild: false,
      eslint: {
        lintCommand: packageJson.scripts.lint,
      },
      stylelint: {
        lintCommand: packageJson.scripts.stylelint,
      },
    }),
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
    'process.env.DAKARA_VERSION': JSON.stringify(packageJson.version),
    'process.env.DAKARA_BUGTRACKER': JSON.stringify(packageJson.bugs.url),
    'process.env.DAKARA_PROJECT_HOMEPAGE': JSON.stringify(packageJson.homepage),
  },
});
