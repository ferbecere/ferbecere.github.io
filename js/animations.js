/* ═══════════════════════════════════════════
   animations.js
   
   Todo lo relacionado con anime.js vive aquí.
   Exportamos funciones de inicialización que
   main.js llama en el momento adecuado.
═══════════════════════════════════════════ */

// ── Animación de entrada del Hero ─────────
export function initHeroAnimation() {
  const tl = anime.timeline({ easing: 'easeOutExpo' });

  tl
    .add({
      targets: '#hero-label',
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 600,
      delay: 200,
    })
    .add({
      targets: '.hero-line',
      translateY: ['110%', 0],
      opacity: [0, 1],
      delay: anime.stagger(90),
      duration: 800,
    }, '-=300')
    .add({
      targets: '#hero-sub',
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 600,
    }, '-=400')
    .add({
      targets: '#hero-cta',
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
    }, '-=300')
    .add({
      targets: '#hero-year',
      opacity: [0, 0.06],
      translateX: [40, 0],
      duration: 1000,
      easing: 'easeOutQuart',
    }, '-=800');
}

// ── Nav: se vuelve sólido al hacer scroll ──
export function initNavScroll() {
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── Scroll reveal (IntersectionObserver) ──
// Observa todos los elementos con .reveal y los anima con anime.js cuando entran en viewport.
// anime.js en vez de CSS transition para tener control fino sobre easing y stagger.
export function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 800,
          easing: 'easeOutExpo',
        });

        // Solo animar una vez
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  els.forEach(el => observer.observe(el));
}

// ── Animación de las project cards ────────
// Se llama desde projects.js después de
// renderizar las cards en el DOM.
export function animateCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const cards = entry.target.querySelectorAll('.project-card');
        anime({
          targets: cards,
          opacity: [0, 1],
          translateY: [50, 0],
          delay: anime.stagger(100),
          duration: 700,
          easing: 'easeOutExpo',
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  const grid = document.getElementById('projects-grid');
  if (grid) observer.observe(grid);
}

// ── Animación de skills tags ───────────────
export function animateTags() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const tags = entry.target.querySelectorAll('.tag');
        anime({
          targets: tags,
          opacity: [0, 1],
          scale: [0.85, 1],
          delay: anime.stagger(40),
          duration: 400,
          easing: 'easeOutBack(1.5)',
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  const list = document.getElementById('skills-list');
  if (list) observer.observe(list);
}
