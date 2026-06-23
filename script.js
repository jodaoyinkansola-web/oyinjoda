// ── Active nav label on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const navLabel = document.getElementById('nav-label');

const sectionLabels = {
  hero: 'My Portfolio',
  about: 'Introduction',
  testimonials: 'Testimonials',
  past_work: 'My Work',
  skills: 'Introduction',
  contact: 'Contact'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
     /* Maps section ids to which nav link should be highlighted.
   Key = section id, Value = data-section of the nav link to highlight.
   If a section id isn't listed here, no nav link gets highlighted. */
var navHighlight = {
  hero:          '',               /* No highlight on landing page */
  toc:           '',               /* No highlight on TOC page */
  about:         'about',          /* Highlights "About" link */
  testimonials:  'testimonials',   /* Highlights "Testimonials" link */
  skills:        'about',   /* ← Also highlights "Testimonials" — change to 'about' if you prefer */
  past_work:   'past_work',      /* Highlights "Past Work" link */
  contact:       'contact'         /* Highlights "Contact" link */
};

navLinks.forEach(function(a) {
  a.classList.toggle('active', a.dataset.section === navHighlight[id]);
});
      navLabel.textContent = sectionLabels[id] || 'My Portfolio';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ── Fade in on scroll ──
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));
/* ============================================================
   PAGE SNAPPING WITH SWEEP TRANSITION
   When the user scrolls or swipes, a coloured panel sweeps
   across the screen, the page jumps to the new section, then
   the panel sweeps off — giving a clean page-turn effect.
============================================================ */

let isScrolling = false;
let currentIndex = 0;
const allSections = Array.from(document.querySelectorAll('section'));
const overlay = document.getElementById('page-transition');

function goToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  if (isScrolling) return;
  isScrolling = true;

  /* ── STEP 1: Sweep the panel IN (covers the screen) ── */
  overlay.classList.remove('slide-out');
  overlay.classList.add('slide-in');

  /* ── STEP 2: While hidden behind the panel, jump to the section ──
     The delay here should match your transition duration in CSS (0.4s = 400ms).
     Increase if the section change is visible before the panel fully covers it. */
  setTimeout(() => {
    currentIndex = index;
    allSections[index].scrollIntoView({ behavior: 'instant', block: 'start' });

    /* ── STEP 3: Sweep the panel OUT (reveals the new section) ──
       Small extra delay before sweeping out so the section has
       time to render. Increase if you see a flash of old content. */
    setTimeout(() => {
      overlay.classList.remove('slide-in');
      overlay.classList.add('slide-out');

      /* ── STEP 4: Unlock scrolling after the panel fully leaves ──
         Should match transition duration (400ms) + small buffer. */
      setTimeout(() => {
        isScrolling = false;
      }, 450); /* ← Increase if transitions still feel jumpy */

    }, 80); /* ← Delay between panel covering screen and sweeping off */

  }, 400); /* ← Must match the CSS transition duration in .page-transition */
}

/* Mouse wheel / trackpad */
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isScrolling) return;
  goToSection(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: false });

/* Touch swipe (mobile) */
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isScrolling) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 50) return;
  goToSection(diff > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: true });

/* Nav links and in-page anchor buttons */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    const index = allSections.indexOf(target);
    if (index !== -1) goToSection(index);
  });
});

