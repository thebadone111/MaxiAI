/*
 * Self-hosted webfonts. Replaces the Google Fonts @import, which was a
 * render-blocking request to a third-party origin that handed every
 * visitor's IP address to Google before they had clicked anything.
 *
 * Only the faces actually used are imported. Fraunces and Epilogue are
 * variable (one file covers every weight); Libre Baskerville and DM Mono
 * are static, so each weight is its own file.
 *
 * The two faces above the fold — the hero headline (Fraunces) and the UI
 * sans (Epilogue) — are preloaded so the headline does not swap late.
 */
import { preload } from 'react-dom'

import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/epilogue/wght.css'
import '@fontsource/libre-baskerville/latin-400.css'
import '@fontsource/libre-baskerville/latin-400-italic.css'
import '@fontsource/dm-mono/latin-300.css'
import '@fontsource/dm-mono/latin-400.css'
import '@fontsource/dm-mono/latin-500.css'

import display from '@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url'
import ui from '@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2?url'

export function preloadFonts() {
  for (const href of [display, ui]) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  }
}
