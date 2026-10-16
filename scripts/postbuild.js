import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')
const redirectsFile = path.join(distDir, '_redirects')
const indexPath = path.join(distDir, 'index.html')
const fallbackPath = path.join(distDir, '200.html')

// Remove any _redirects file that might cause Cloudflare infinite loop error 100324
if (fs.existsSync(redirectsFile)) {
  fs.unlinkSync(redirectsFile)
  console.log('[postbuild] Removed conflicting _redirects file from dist.')
}

// Create 200.html copy of index.html for Cloudflare Pages SPA fallback compatibility
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, fallbackPath)
  console.log('[postbuild] Created 200.html SPA fallback.')
}

console.log('[postbuild] Build verification complete.')
