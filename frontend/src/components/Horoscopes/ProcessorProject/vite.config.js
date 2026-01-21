import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import * as fs from 'fs';

export default defineConfig({
  base: '/horoscopes-build/',
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx,ts,js}'
    })
  ],
  envDir: '..',
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  build: {
    outDir: '../build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        mount: path.resolve(__dirname, 'src/mount.tsx')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'mount') {
            return 'assets/mount.js';
          }

          return 'assets/[name]-[hash].js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css') && assetInfo.name.includes('mount')) {
            return 'assets/mount.css';
          }

          return 'assets/[name][extname]';
        }
      }
    }
  }
});
