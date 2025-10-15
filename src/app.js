'use strict';

// Single-entry app module: modal, nav, tabs, lazy-loading, sticky nav, reveal, slider

const elements = {
  header: document.querySelector('.header'),
  modal: document.querySelector('.modal'),
  overlay: document.querySelector('.overlay'),
  section1: document.querySelector('#section--1'),
  images: document.querySelectorAll('img[data-src]'),
  navigation: {
    nav: document.querySelector('.nav'),
    navLinkCont: document.querySelector('.nav__links'),
    navLinks: document.querySelectorAll('.nav__link'),
  },
  buttons: {
    closeModal: document.querySelector('.btn--close-modal'),
    openModal: document.querySelectorAll('.btn--show-modal'),
    scrollTo: document.querySelector('.btn--scroll-to'),
  },
  tabs: {
    tab: document.querySelectorAll('.operations__tab'),
    container: document.querySelector('.operations__tab-container'),
    content: document.querySelectorAll('.operations__content'),
  },
  slider: {
    slides: document.querySelectorAll('.slide'),
    btnLeft: document.querySelector('.slider__btn--left'),
    btnRight: document.querySelector('.slider__btn--right'),
    dotContainer: document.querySelector('.dots'),
    curSlide: 0,
    get maxSlide() {
      return this.slides.length;
    },
  },
};

///////////////////////////////////////
// Modal
const toggleModal = (show = true) => {
  if (!elements.modal || !elements.overlay) return;
  elements.modal.classList.toggle('hidden', !show);
  elements.overlay.classList.toggle('hidden', !show);
};

const handleOpenModal = () => toggleModal(true);
const handleCloseModal = () => toggleModal(false);
const handleKeyDown = e => {
  if (
    e.key === 'Escape' &&
    elements.modal &&
    !elements.modal.classList.contains('hidden')
  ) {
    handleCloseModal();
  }
};

elements.buttons.openModal.forEach(btn =>
  btn.addEventListener('click', handleOpenModal)
);
if (elements.buttons.closeModal)
  elements.buttons.closeModal.addEventListener('click', handleCloseModal);
if (elements.overlay)
  elements.overlay.addEventListener('click', handleCloseModal);
document.addEventListener('keydown', handleKeyDown);

///////////////////////////////////////
// Smooth scrolling for CTA and nav links
if (elements.buttons.scrollTo) {
  elements.buttons.scrollTo.addEventListener('click', () => {
    if (elements.section1)
      elements.section1.scrollIntoView({ behavior: 'smooth' });
  });
}

if (elements.navigation.navLinkCont) {
  elements.navigation.navLinkCont.addEventListener('click', e => {
    if (!e.target.classList.contains('nav__link')) return;
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

///////////////////////////////////////
// Menu fade animation
const handleHoverOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    sibilings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    if (logo) logo.style.opacity = this;
  }
};

if (elements.navigation.nav) {
  elements.navigation.nav.addEventListener(
    'mouseover',
    handleHoverOpacity.bind(0.5)
  );
  elements.navigation.nav.addEventListener(
    'mouseout',
    handleHoverOpacity.bind(1)
  );
}

///////////////////////////////////////
// Tabbed component
if (elements.tabs.container) {
  elements.tabs.container.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;
    elements.tabs.tab.forEach(t =>
      t.classList.remove('operations__tab--active')
    );
    elements.tabs.content.forEach(c =>
      c.classList.remove('operations__content--active')
    );
    clicked.classList.add('operations__tab--active');
    const content = document.querySelector(
      `.operations__content--${clicked.dataset.tab}`
    );
    if (content) content.classList.add('operations__content--active');
  });
}

///////////////////////////////////////////////
// Sticky navigation
const handleStickyNav = ([entry]) => {
  if (!elements.navigation.nav) return;
  elements.navigation.nav.classList.toggle('sticky', !entry.isIntersecting);
};

let headerObserver;
const updateObserver = () => {
  if (!elements.header || !elements.navigation.nav) return;
  if (headerObserver) headerObserver.disconnect();
  const navHeight = elements.navigation.nav.getBoundingClientRect().height;
  const headerHeight = elements.header.getBoundingClientRect().height;
  const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${headerHeight - navHeight * 4}px`,
  };
  headerObserver = new IntersectionObserver(handleStickyNav, observerOptions);
  headerObserver.observe(elements.header);
};
updateObserver();
window.addEventListener('resize', updateObserver);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy load images (Parcel-friendly)
const resolveSrcForBundler = img => {
  const raw = img.getAttribute('data-src');
  if (!raw) return null;
  try {
    if (typeof import.meta !== 'undefined')
      return new URL(raw, import.meta.url).href;
  } catch (err) {
    // ignore
  }
  return raw;
};

const loadImg = (entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    const resolved = resolveSrcForBundler(img) || img.dataset.src;
    if (resolved) img.src = resolved;
    img.addEventListener('load', () => img.classList.remove('lazy-img'));
    observer.unobserve(img);
  });
};

if (elements.images && elements.images.length > 0) {
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(loadImg, {
      root: null,
      threshold: 0,
      rootMargin: '200px',
    });
    elements.images.forEach(img => imgObserver.observe(img));
  } else {
    // fallback
    elements.images.forEach(img => {
      const resolved = resolveSrcForBundler(img) || img.dataset.src;
      if (resolved) img.src = resolved;
      img.addEventListener('load', () => img.classList.remove('lazy-img'));
    });
  }
}

///////////////////////////////////////
// Slider
const createDots = () => {
  elements.slider.slides.forEach((_, i) =>
    elements.slider.dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};
const activateDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const goToSlide = slide =>
  elements.slider.slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
const nextSlide = () => {
  elements.slider.curSlide =
    elements.slider.curSlide === elements.slider.maxSlide - 1
      ? 0
      : elements.slider.curSlide + 1;
  goToSlide(elements.slider.curSlide);
};
const prevSlide = () => {
  elements.slider.curSlide =
    elements.slider.curSlide === 0
      ? elements.slider.maxSlide - 1
      : elements.slider.curSlide - 1;
  goToSlide(elements.slider.curSlide);
};

if (elements.slider.slides.length) {
  createDots();
  elements.slider.dots = document.querySelectorAll('.dots__dot');
  goToSlide(0);
  if (elements.slider.btnRight)
    elements.slider.btnRight.addEventListener('click', nextSlide);
  if (elements.slider.btnLeft)
    elements.slider.btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  if (elements.slider.dotContainer)
    elements.slider.dotContainer.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        elements.slider.curSlide = Number(e.target.dataset.slide);
        goToSlide(elements.slider.curSlide);
        activateDot(elements.slider.curSlide);
      }
    });
}

// Export nothing; auto-run
