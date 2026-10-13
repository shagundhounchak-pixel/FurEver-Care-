import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')
const redirectsFile = path.join(distDir, '_redirects')

if (fs.existsSync(redirectsFile)) {
  fs.unlinkSync(redirectsFile)
  console.log('[postbuild] Removed conflicting _redirects file from dist.')
}

console.log('[postbuild] Build verification complete.')
