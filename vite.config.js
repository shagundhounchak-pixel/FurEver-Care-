import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cleanup-cloudflare-redirects',
      buildStart() {
        const publicRedirects = path.resolve(__dirname, 'public', '_redirects')
        if (fs.existsSync(publicRedirects)) {
          fs.unlinkSync(publicRedirects)
        }
      },
      closeBundle() {
        const distRedirects = path.resolve(__dirname, 'dist', '_redirects')
        if (fs.existsSync(distRedirects)) {
          fs.unlinkSync(distRedirects)
        }
      }
    }
  ],
  build: {
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
