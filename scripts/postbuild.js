import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const publicDir = path.resolve(rootDir, 'public')
const indexPath = path.join(distDir, 'index.html')
const fallbackPath = path.join(distDir, '200.html')

// Remove any _redirects file anywhere in root, public, or dist
for (const dir of [rootDir, publicDir, distDir]) {
  const file = path.join(dir, '_redirects')
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`[postbuild] Removed offending _redirects file from ${dir}`)
  }
}

// Recursively find and remove any nested _redirects file
function removeRedirectsRecursive(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      removeRedirectsRecursive(fullPath)
    } else if (entry.name === '_redirects') {
      fs.unlinkSync(fullPath)
      console.log(`[postbuild] Removed nested _redirects file: ${fullPath}`)
    }
  }
}
removeRedirectsRecursive(distDir)

// Create 200.html copy of index.html for Cloudflare Pages SPA fallback compatibility
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, fallbackPath)
  console.log('[postbuild] Created 200.html SPA fallback.')
}

console.log('[postbuild] Build verification complete.')
