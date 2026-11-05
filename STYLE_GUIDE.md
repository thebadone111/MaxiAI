# Maxi AI Development — Style Guide

The system as built, read out of the code. Tokens live in [`src/index.css`](src/index.css)
under `@theme`; facts live in [`src/data/site.js`](src/data/site.js). If it is in this document
it is in the site.

The motion stack is ported from two sibling sites: **Minifinans** (`projects/minifin`, branch
`motion`), which provided the scroll engine, reveals, the intro harness and the WebGL scene
architecture, and **MaisonMere** (`web_dev/mm_consulting`), which provided the page curtain,
the hide-on-scroll header and the manifesto word-lighting.

**The one rule that matters:** a `--color-*` token generates `bg-*`, `text-*` and `border-*`
utilities (with `/opacity` variants) automatically. **Never hard-code a hex value in JSX.**

---

## 1. Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1C1A2E` | Primary text, the wordmark, dark bands, the intro ground |
| `ink-2` | `#24223A` | Raised surfaces on ink (code panels on dark sections, the editor body) |
| `ink-soft` | `#2A2842` | Prose on cream |
| `ink-mid` | `#4A4860` | Captions, metadata |
| `mist` | `#9A95A8` | Labels on ink |
| `cream` | `#FAF7F0` | The ground |
| `cream-deep` | `#F2EEE3` | Hover rows, alternating bands |
| `stone` | `#E8E4D8` | Hairlines and dividers |
| `signal` | `#C0392B` | The red of the mark's two rules. About 3% of any page |

Signal red is **rationed**: one live element per component (a rule, a pulse, an accent word).
In the code panels it marks only the live thing: the hot node, the packet, the HQ city.

## 2. Type

| Role | Family | Notes |
|---|---|---|
| Display `h1`–`h4` | Fraunces (variable, opsz) | Light (300) for heroes and section heads, semibold for cards |
| Prose | Libre Baskerville 400 / italic | Leads and body copy |
| UI | Epilogue (variable) | Nav, buttons, form fields |
| Technical | DM Mono 300/400/500 | Eyebrows, indices, prices, readouts, every "instrument" label |

All four are **self-hosted** through `@fontsource` ([`src/fonts.js`](src/fonts.js)). The site
makes no request to any Google host. Fraunces and Epilogue (above the fold) are preloaded.

`<em>` inside a heading is italic, regular weight, signal red. The wordmark "Maxi" is live
Fraunces at `opsz 144`, weight 400, matching the PNG lockup.

## 3. The mark

[`public/maxi-mark.svg`](public/maxi-mark.svg) and [`src/elems/mark-paths.js`](src/elems/mark-paths.js)
are a **reconstruction** traced from `public/maxi-icon.png` by
[`tools/brand/trace_mark.py`](tools/brand/trace_mark.py). The letter (`id="m"`) and the rules
(`id="rules"`) are separate paths, which is what lets the intro animate them separately. If the
original vector turns up, regenerate both files from it.

Use `<Mark>` and `<Lockup>` from [`src/elems/logo.jsx`](src/elems/logo.jsx). The PNG lockups in
`public/` are kept only for email and other offline use.

## 4. Motion

All motion runs on one engine, [`src/motion/smooth.js`](src/motion/smooth.js) +
[`src/motion/hooks.js`](src/motion/hooks.js):

- **Lenis** smooth scroll (lerp 0.1). It is not started under reduced motion; native scroll
  drives the same signal instead.
- **One scroll signal** (`onScrollFrame`) and **one measure pass** (`onMeasure`, batched per
  frame). Effects never read layout while scrolling: a frame is arithmetic plus a transform write.
- **One IntersectionObserver** for every reveal. Anything already on screen at load appears in
  place, with no fade.
- `lockScroll(owner, locked)`: several owners (intro, menu, palette) can hold the page still. It
  calls `lenis.stop()`, because `overflow: hidden` does not stop Lenis.
- **No GSAP.**

| Hook | Gives |
|---|---|
| `useReveal()` | `is-in` once in view → `.rise` / `.fade` / `.hairline-draw` |
| `useInView()` | `in-view` both ways (grants `will-change` only while on screen) |
| `useScrollProgress(fn, { span, rest })` | `fn(p)` 0→1 through the viewport, or over its own length for sticky scenes; called once with `rest` under reduced motion |
| `useMinWidth`, `useReducedMotion`, `useHydrated` | Media queries that are **prerender-safe**: the server answer renders first, then the real value after hydration |

**Reveals live in the primitives, never in page files.** `SectionHead`, `FeatureGrid`,
`PriceTable`, `TwoColumnList`, `RuledPoints` and `CTA` in
[`src/elems/section.jsx`](src/elems/section.jsx) carry their own motion. The `<Reveal variant>`
API still works for one-off blocks. A reveal moves 1rem over 700ms with `--ease-reveal`, and the
stagger is capped.

**Heroes never use `useReveal`.** They read `useIntroDone()` and arrive on the first frame of the
intro's exit: eyebrow 0 → rule 80 → h1 120 → lead 320 → actions 560 → meta 700 → status 820 ms.

### Scroll scenes ([`src/elems/scenes.jsx`](src/elems/scenes.jsx))

| Scene | Where | Fallback |
|---|---|---|
| `HomeReveal`: a window at 42% of the screen opens to full bleed; the content counter-scales | Home, after "Two disciplines" | Reduced motion: fully open |
| `ProcessTrack`: a sticky horizontal track with a counter and a progress rule | Services, "How we work" | Below 1280px, under reduced motion, and in the prerender: the plain row of steps |
| `Manifesto`: words light one by one | Home, "What we believe" | Fully lit |

## 5. The intro ("Signal")

[`src/intro/`](src/intro). It plays once per visit (`sessionStorage` key `maxi:intro`) and holds
for 5.2s, or until the first click, key or scroll.

The story: points drift in → organise into a layered network → wires connect with activations →
the mark's two red rules scan down and stop at their place in the mark → the network collapses
onto the outline of the M → the real mark fills it → the name decodes beneath. On exit the ink
sheet **tears along the rules** while the mark **flies onto the header mark**, with one
batch of rect reads.

- **WebGL** ([`scenes/signal/engine.js`](src/intro/scenes/signal/engine.js)): three.js, two draw
  calls, and an orthographic camera at 1 unit = 1 CSS px. Gated by `worthIt()` (save-data,
  memory, cores, `failIfMajorPerformanceCaveat`) **before** the import. three.js is in its own
  `three-engine` chunk ([`vite.config.js`](vite.config.js)), so a static import of it anywhere
  shows up as the main chunk jumping by about 150 KB.
- **One timeline** ([`scenes/signal/timeline.js`](src/intro/scenes/signal/timeline.js)) feeds both
  the engine's uniforms and the CSS keyframe delays (`--t-*`). Every value is a pure function
  of story time.
- **Without WebGL, or under reduced motion**, the DOM half plays alone and still finishes the
  scene (the still frame is the scene's last frame).
- Query flags: `?intro` replays it, `?intro=off` skips it. Dev only: `?still` shows the reduced
  version, and `?at=2.4` freezes the frame at that second.

## 6. Visuals — procedural, not photographed

The site uses no photography. Every visual is an SVG/DOM "instrument" panel in
[`src/visuals/code.jsx`](src/visuals/code.jsx), named by slot in
[`src/visuals/Visual.jsx`](src/visuals/Visual.jsx). They are crisp at any size, cost a few KB,
and render complete in the prerendered HTML.

| Slot | Panel |
|---|---|
| `homeHero` | **LiveSystem**: a schematic that draws itself as the page arrives, with ticking metrics |
| Home reveal scene | **The editor that opens**: `care-plan.ts` types itself as you scroll, and `maxi deploy` runs |
| `services` | Infrastructure topology, drawn on scroll |
| `about` | The four markets, with live local times |
| `aiProduct` | One post fanning out to six channels |
| `programme` | The care plan as a 90-day uptime record |

Drawing on scroll is one registered custom property, `--p` (0→1), written by `useDraw()`.
Each node carries its own start, `--s`. The initial value is 1, so without JavaScript every
diagram is complete. Panels are **not rendered below 1024px**.

A stock-photography variant was built alongside and rejected. It is in the history at
`e7a21a0` (`src/visuals/photo.jsx`, `tools/photos/`) if it is ever wanted.

## 7. Chrome and signature details

- **Header:** fixed. It hides on scroll down past 200px and returns on scroll up, turns
  translucent cream with a blur past 40px, and fills a 1px signal progress rule along its
  foot. It carries `data-header-mark`, which the intro lands on.
- **Page curtain:** an ink panel with the mark and the destination's name covers each route
  change and lifts away. Skipped on the first load, on hash-only navigation, and under reduced
  motion.
- **⌘K / Ctrl K / `/`:** the command palette. It offers every page and section, the prices,
  copying the email address, calling us and replaying the intro.
- **Decode:** eyebrows, indices and prices resolve out of mono glyphs when they scroll in. The real
  text is in the HTML.
- **Live details:** London time in the hero status line and the footer; local times on the market
  map; the footer's build stamp (`Build <sha> · <date>`, injected by `vite.config.js`).

## 8. Accessibility

- A skip link, `<main id="main" tabIndex={-1}>`, and focus moved to `main` on navigation.
- The intro is an `aria-modal` dialog. The page behind it is `inert`, and focus is restored to
  `main` afterwards.
- The palette is a dialog with combobox/listbox semantics and is fully keyboard-driven.
- The mobile menu is `inert` while closed.
- **Reduced motion:** no Lenis, no WebGL, no curtain. Every reveal rests in its final state, and
  decoding is off.
- The focus ring is 2px signal, offset 3px.

## 9. Things that will bite you

- **The site is prerendered** (`npm run build` → client, SSR, `prerender.js`). Nothing may read
  `window` during render. Anything media-query dependent must use the hooks in §4, or
  hydration will disagree.
- **The intro decision is made twice**: by the inline script in `index.html`'s `<head>` (which
  covers the page before first paint) and by `<Intro>`, which reads the class the script set.
  The script cannot import `src/intro/state.js`, so **change one, change both.**
- **Adding a route** means editing `src/routes.jsx`, `src/data/meta.js` (title, description and
  the prerender list) and `public/_redirects`.
- `vite preview` serves the prerendered files but ignores `_redirects`.
- Turn effects that subscribe on mount into their own component when they appear only after
  hydration (see `Track` vs `ProcessTrack`). `useScrollProgress` binds to the element that
  exists at mount.
