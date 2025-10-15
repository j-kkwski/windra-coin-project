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

## Getting started (development)
Prerequisites:
- Node.js (12+ recommended)
- npm (bundled with Node)

Install dependencies and start the dev server:

```powershell
npm install
npm start
```

This runs Parcel's dev server (configured in `package.json`) and opens a local site (usually at http://localhost:1234). Parcel serves files from the source tree, so lazy-loading works in dev too.

## Build (production)

```powershell
npm run build
```

This produces a `dist/` directory containing the production site with optimized and hashed assets. You can preview the `dist` folder using a small static server:

```powershell
# install serve if you don't have it
npm install -g serve
# then
serve ./dist -s
```

Or use `npx` to run without globally installing:

```powershell
npx serve ./dist -s
```

## Netlify deployment
Deployment to Netlify is straightforward (the demo is at https://windra-coin.netlify.app/):
1. Connect your GitHub repo to Netlify.
2. In Netlify site settings set the build command to `npm run build` and the publish directory to `dist`.
3. Deploy — Netlify will run the Parcel build and publish `/dist`.

If you prefer to deploy manually: build locally (`npm run build`) and drag the contents of the `dist/` folder to Netlify's deploy UI.

## Lazy-loading images — Troubleshooting
If images appear blurred or don't load after building:
- Check browser DevTools → Network to see whether requests for image files return 404s. If the built image filename is fingerprinted (e.g. `digital.abc123.jpg`) but your `data-src` still points to `img/digital.jpg`, the image will 404.
- The solution used here: `src/app.js` resolves `data-src` with something like:

```js
const resolved = new URL(img.getAttribute('data-src'), import.meta.url).href;
img.src = resolved;
```

Because `src/app.js` is loaded as a module (`<script type="module" src="src/app.js"></script>`), Parcel will see the `new URL(..., import.meta.url)` usage and rewrite the referenced asset during the build so the correct fingerprinted URL is used at runtime.

If you encounter problems:
- Make sure `index.html` includes the module script tag (see above).
- Hard-refresh the page (Ctrl+F5) to avoid cached placeholders.
- Check the browser console for any JS errors.

## Developer notes
- The project intentionally uses one module entry `src/app.js` to keep behavior centralized and to allow bundlers to rewrite asset URLs.
- If you want to reorganize the JS into multiple modules, keep a single module entry (e.g., `src/main.js`) that imports the rest; Parcel will still detect asset references in modules.

## Contribution
If you're improving the demo or UI, please:
- Keep CSS class names used by the JS unchanged, or update both the CSS/HTML and JS together.
- Test both `npm start` (dev) and `npm run build` (production) — lazy-image issues often only appear in the build output.

## License
This project is provided under the ISC license (see `package.json`).

---

If you'd like, I can:
- Add a small `CONTRIBUTING.md` with coding style notes.
- Run `npm run build` and inspect the `dist/` folder to confirm exactly how Parcel rewrote image filenames and update this README with an example.

Let me know if you want the README file added to the repo (I can create `README.md` for you).