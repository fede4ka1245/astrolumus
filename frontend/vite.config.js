import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid({ ssr: true })],
  // Vite automatically serves files from the public directory
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nominatim/, '')
      }
    }
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  ssr: {
    noExternal: ['solid-js', '@solidjs/router'],
  },
});
