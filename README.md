# Windra — The Coin That Cleans the World

Live demo: https://windra-coin.netlify.app/

A small static marketing/demo site for Windra (WND) with interactive UI elements: tabbed operations, testimonials slider, reveal-on-scroll sections, modal signup, and lazy-loaded images. Built with plain HTML/CSS and modern JavaScript and bundled with Parcel.

## Features

- Responsive, dark-themed UI
- Modal signup flow
- Smooth scrolling navigation
- Tabbed operations component
- Testimonials slider with dots and keyboard nav
- Reveal-on-scroll animations
- Lazy-loading images (Parcel-friendly)

## Architecture

This repository uses a single ES module entrypoint at `src/app.js` which handles all UI behavior (modal, navigation, tabs, sticky nav, reveal-on-scroll, lazy-loading, slider). The code is written as an ES module so bundlers like Parcel can resolve asset URLs (via `import.meta.url`) to produce correct hashed asset filenames in production builds.

Why this matters: when lazy-loading images you often set a `data-src` attribute in HTML. Parcel won't rewrite custom HTML attributes automatically at build time, so `src/app.js` resolves `data-src` using `new URL(..., import.meta.url)` before assigning `img.src`. This ensures the built site references Parcel's fingerprinted asset filenames instead of the raw source path.

## Repo structure

```
index.html               # App HTML
style.css                # Main stylesheet
src/app.js               # Single JS entrypoint (module)
img/                     # Image assets (icons, hero, test photos)
package.json             # npm scripts (parcel start / build)
README.md                # This file
```

## License

```
This project is provided under the ISC license (see `package.json`).
```
