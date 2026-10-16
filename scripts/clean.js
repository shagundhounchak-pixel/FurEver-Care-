import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const publicDir = path.resolve(rootDir, 'public')

// Check and remove any offending _redirects file from root, public, and dist
for (const dir of [rootDir, publicDir, distDir]) {
  const file = path.join(dir, '_redirects')
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`[clean] Removed offending _redirects file from ${dir}`)
  }
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true })
  console.log('[clean] Wiped cached dist directory successfully.')
} else {
  console.log('[clean] dist directory does not exist, nothing to clean.')
}
