import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')
const publicRedirects = path.resolve(__dirname, '..', 'public', '_redirects')

if (fs.existsSync(publicRedirects)) {
  fs.unlinkSync(publicRedirects)
  console.log('[clean] Removed offending public/_redirects file.')
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true })
  console.log('[clean] Wiped cached dist directory successfully.')
} else {
  console.log('[clean] dist directory does not exist, nothing to clean.')
}
