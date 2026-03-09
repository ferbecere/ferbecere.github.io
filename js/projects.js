/* ═══════════════════════════════════════════
   projects.js — Datos y renderizado
═══════════════════════════════════════════ */

import { openModal } from './modal.js';

// ── Datos ─────────────────────────────────

const PROJECTS = [
  {
    num: '001',
    title: 'Cuina bé-bè',
    desc: 'Herramienta de gestión de comidas para la primera infancia',
    info: `Texto largo para el modal. 
    Aquí puedes explicar el contexto, 
    el problema, el proceso y el resultado con más detalle.`,
    tags: ['UI Design', 'anime.js', 'Vanilla JS'],
    github: 'https://github.com/tu-usuario/proyecto-uno',
    live: 'https://proyecto-uno.vercel.app',
  },
  {
    num: '002',
    title: 'Artline',
    desc: 'Juego interactivo online sobre historia y arte',
    info: 'Texto largo para el modal.',
    tags: ['UX Research', 'Figma'],
    github: 'https://github.com/tu-usuario/proyecto-dos',
    live: null,
  },
  {
    num: '003',
    title: 'Wikidice',
    desc: 'Juevo interactivo local mediante Wikipedia',
    info: 'Texto largo para el modal.',
    tags: ['Motion', 'SVG'],
    github: null,
    live: 'https://proyecto-tres.vercel.app',
  },
  {
    num: '004',
    title: 'SimPass',
    desc: 'Generador de contraseñas legibles y seguras',
    info: 'Texto largo para el modal.',
    tags: ['Branding', 'CSS'],
    github: null,
    live: null,
  },
  {
    num: '005',
    title: 'ArcThreads',
    desc: 'En desarrollo. Herramienta para escritura y generación de mundos (worldbuilding)',
    info: null,
    tags: ['TBD'],
    github: null,
    live: null,
  },
];

const SKILLS = [
  'UI Design', 'UX Research', 'Motion Design',
  'Figma', 'Vanilla JS', 'anime.js',
  'CSS avanzado', 'SVG', 'HTML semántico',
];

// ── Renderizado de cards ───────────────────

function createCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';

  // Botones de acción — solo se renderizan si hay datos
  const hasLinks = project.github || project.live;
  const hasInfo  = project.info;

  card.innerHTML = `
    <p class="project-num">${project.num}</p>
    <h3 class="project-title">${project.title}</h3>
    <p class="project-desc">${project.desc}</p>
    <ul class="project-tags">
      ${project.tags.map(t => `<li class="tag">${t}</li>`).join('')}
    </ul>
    <div class="card-actions">
      ${hasInfo ? `<button class="card-btn primary" data-action="info">Más info</button>` : ''}
      ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="card-btn">GitHub ↗</a>` : ''}
      ${project.live   ? `<a href="${project.live}"   target="_blank" rel="noopener" class="card-btn">Live ↗</a>`   : ''}
    </div>
    <span class="project-arrow" aria-hidden="true">↙</span>
  `;

  return card;
}

function renderSkills() {
  const list = document.getElementById('skills-list');
  if (!list) return;

  SKILLS.forEach(skill => {
    const li = document.createElement('li');
    li.className = 'tag';
    li.textContent = skill;
    li.style.opacity = '0';
    list.appendChild(li);
  });
}

// ── Export ────────────────────────────────
export function initProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PROJECTS.forEach(p => grid.appendChild(createCard(p)));
  renderSkills();

  // Event delegation — un solo listener en el grid
  // para todos los botones "Más info" presentes y futuros
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="info"]');
    if (!btn) return;

    e.stopPropagation();
    const card    = btn.closest('.project-card');
    const index   = Array.from(grid.children).indexOf(card);
    const project = PROJECTS[index];
    if (project) openModal(project);
  });
}
