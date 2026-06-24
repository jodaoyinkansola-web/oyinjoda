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
  // Check if we are scrolling inside the media container
  const scrollable = e.target.closest('.media-inner');
  if (scrollable) {
    const isScrollingDown = e.deltaY > 0;
    // Math.ceil helps account for fractional pixel scrolling on some monitors
    const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;
    const isAtTop = scrollable.scrollTop === 0;

    // If scrolling down and not at the bottom, let it scroll naturally!
    if (isScrollingDown && !isAtBottom) return; 
    // If scrolling up and not at the top, let it scroll naturally!
    if (!isScrollingDown && !isAtTop) return;   
  }

  e.preventDefault();
  if (isScrolling) return;
  goToSection(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: false });


/* Touch swipe (mobile) */
let touchStartY = 0;
let touchTarget = null; // Remembers what element you touched

window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  touchTarget = e.target;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (isScrolling) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 50) return;

  // Same check for mobile swipes
  const scrollable = touchTarget.closest('.media-inner');
  if (scrollable) {
    const isSwipingUp = diff > 0; // Swiping up means scrolling down the page
    const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;
    const isAtTop = scrollable.scrollTop === 0;

    if (isSwipingUp && !isAtBottom) return;
    if (!isSwipingUp && !isAtTop) return;
  }

  goToSection(diff > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: true });
