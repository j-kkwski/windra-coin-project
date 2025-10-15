// Minimal MVC view: handles DOM operations like lazy-loading and tabs
export const getElements = () => ({
  images: document.querySelectorAll('img[data-src]'),
  tabsContainer: document.querySelector('.operations__tab-container'),
});

export function resolveDataSrc(img) {
  // If running as a module under a bundler, resolve relative paths so Parcel rewrites them
  try {
    if (typeof import.meta !== 'undefined') {
      return new URL(img.getAttribute('data-src'), import.meta.url).href;
    }
  } catch (err) {
    // ignore and fall back
  }
  return img.getAttribute('data-src');
}

export function setSrcAndReveal(img, src) {
  img.src = src;
  img.addEventListener('load', () => img.classList.remove('lazy-img'));
}

export function createObserver(onIntersect) {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(onIntersect, {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    });
  }
  return null;
}

export function initTabs(container) {
  if (!container) return;
  container.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    document
      .querySelectorAll('.operations__tab')
      .forEach(t => t.classList.remove('operations__tab--active'));
    document
      .querySelectorAll('.operations__content')
      .forEach(c => c.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
}
