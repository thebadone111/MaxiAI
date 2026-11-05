import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The footer's build stamp: short commit and build date, fixed at build time
// (the same value lands in the client and SSR bundles, so hydration agrees).
function buildStamp() {
  let sha = 'local'
  try {
    sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    /* not a git checkout (e.g. a CI tarball): keep the placeholder */
  }
  const date = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/London',
  })
  return { sha, date }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD__: JSON.stringify(buildStamp()),
  },
  build: {
    rollupOptions: {
      output: {
        /*
         * three.js gets a named chunk of its own, set up before anything
         * imports it (as on Minifinans). A stray static import then shows up
         * as the main chunk jumping by ~150 KB — a loud failure instead of a
         * quiet one. The intro reaches it only through import('./engine').
         */
        manualChunks(id) {
          if (/node_modules[\\/]three[\\/]/.test(id)) return 'three-engine'
        },
      },
    },
  },
})
