import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import * as fs from 'fs';

export default defineConfig({
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
    outDir: '../build'
  }
});
