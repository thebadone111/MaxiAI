import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { preloadFonts } from './fonts.js'
import './index.css'
import App from './App.jsx'

preloadFonts()

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Routes are prerendered at build time, so in production the container
// already holds markup and we hydrate it. Falls back to a client render
// for anything not prerendered (and for the dev server).
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
