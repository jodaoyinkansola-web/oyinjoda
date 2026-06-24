// ── Active nav label on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const navLabel = document.getElementById('nav-label');

const sectionLabels = {
  hero: 'My Portfolio',
  about: 'Introduction',
  testimonials: 'Testimonials',
  past_work_1: 'My Work',
  past_work_2: 'My Work',
  past_work_3: 'My Work',
  past_work_4: 'My Work',
  media_projects: 'My Work',
  skills: 'Introduction',
  contact: 'Contact'
};

/* Maps section ids to which nav link should be highlighted.
   Moved OUTSIDE the observer so it isn't rebuilt on every scroll */
const navHighlight = {
  hero: '',               
  about: 'about',          
  testimonials: 'testimonials',   
  skills: 'about',   
  past_work_1: 'past_work',      
  past_work_2: 'past_work',      
  past_work_3: 'past_work',      
  past_work_4: 'past_work',      
  media_projects: 'past_work',
  contact: 'contact'         
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      
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
============================================================ */

let isScrolling = false;
let currentIndex = 0;
const allSections = Array.from(document.querySelectorAll('section'));
const overlay = document.getElementById('page-transition');

function goToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  if (isScrolling) return;
  isScrolling = true;

  overlay.classList.remove('slide-out');
  overlay.classList.add('slide-in');

  setTimeout(() => {
    currentIndex = index;
    allSections[index].scrollIntoView({ behavior: 'instant', block: 'start' });

    setTimeout(() => {
      overlay.classList.remove('slide-in');
      overlay.classList.add('slide-out');

      setTimeout(() => {
        isScrolling = false;
      }, 450); 
    }, 80); 
  }, 400); 
}
/* Mouse wheel / trackpad */
window.addEventListener('wheel', (e) => {
  // Disable scroll hijacking on mobile devices so it scrolls normally!
  if (window.innerWidth <= 768) return;

  const scrollable = e.target.closest('.media-inner');
  if (scrollable) {
    const isScrollingDown = e.deltaY > 0;
    const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;
    const isAtTop = scrollable.scrollTop === 0;

    if (isScrollingDown && !isAtBottom) return; 
    if (!isScrollingDown && !isAtTop) return;   
  }

  e.preventDefault();
  if (isScrolling) return;
  goToSection(e.deltaY > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: false });


/* Touch swipe (mobile) */
let touchStartY = 0;
let touchTarget = null;

window.addEventListener('touchstart', (e) => {
  // Completely ignore custom touch events on mobile
  if (window.innerWidth <= 768) return;
  
  touchStartY = e.touches[0].clientY;
  touchTarget = e.target;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  // Completely ignore custom touch events on mobile
  if (window.innerWidth <= 768) return;

  if (isScrolling) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 50) return;

  const scrollable = touchTarget.closest('.media-inner');
  if (scrollable) {
    const isSwipingUp = diff > 0; 
    const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight;
    const isAtTop = scrollable.scrollTop === 0;

    if (isSwipingUp && !isAtBottom) return;
    if (!isSwipingUp && !isAtTop) return;
  }

  goToSection(diff > 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: true });
