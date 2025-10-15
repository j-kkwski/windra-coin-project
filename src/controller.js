import { selectors } from './model.js';
import {
  getElements,
  resolveDataSrc,
  setSrcAndReveal,
  createObserver,
  initTabs,
} from './view.js';

export function init() {
  const els = getElements();

  // Init tabs (non-destructive)
  initTabs(els.tabsContainer);

  // Lazy-load images with bundler-compatible resolution
  const images = document.querySelectorAll(selectors.lazyImages);
  if (images.length === 0) return;

  const onIntersect = function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = resolveDataSrc(img);
      setSrcAndReveal(img, src);
      observer.unobserve(img);
    });
  };

  const observer = createObserver(onIntersect);
  if (observer) {
    images.forEach(img => observer.observe(img));
  } else {
    // fallback
    images.forEach(img => setSrcAndReveal(img, resolveDataSrc(img)));
  }
}

// Auto-init for module
init();
