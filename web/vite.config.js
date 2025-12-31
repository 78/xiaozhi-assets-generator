import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/tools/assets-generator/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@share': resolve(__dirname, 'share'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://xiaozhi.me',
        changeOrigin: true
      }
    }
  },
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.bin'],
  publicDir: 'public'
})
