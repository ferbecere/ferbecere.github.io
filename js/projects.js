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
    info: `
    Contexto: Desarrollo de un producto bajo una necesidad personal real: La gestión de la alimentación infantil.
    Tomando la información de la guia de alimentación en la primera infancia de l'Àgencia de Salut Pública de Catalunya. Genero una aplicación para acceder a la información de forma más cómoda.
    Stack: - React18 + vite: La idea siempre fue crear una SPA. 
           - Supabase: Proporciona autenticación sin contraseña y una bbdd PostgreSQL. El plan gratuïto es suficiente para el proyecto.
           - Tailwind: Sistema simple pero coherente de colores y tipografias. El reto de este proyecto son las funcionalidades no la gestión visual.
           - Resend: API de gestion de mails. Plan gratuito generoso (3000mails/mes)
           - @dnd-kit/core: Para gestionar el drag and drop en el calendario.
    Retos:- Adaptar la información de la guia ya que muchas normas no eran vinárias por lo que se tenian que definir márgenes de edad.
          - Establecer la base de datos y conectar multiusuarios. 
          - El drag & drop del calendario respetando las reglas nutricionales.
          - Definir e implementar el tracker de alergias (entre los 5 y 18 meses)
          - Gestion de cambios en al bbdd, especialmente las "RLS policies".
    Aprendizajes:
          - Positivo:
           - Centralizar todo el conocimiento de dominio en nutritionRules.js, de este modo los cambios en el catálgo no afectaban a ningún componente.
           - Supabase RLS simplifica enormemente la seguridad de la base de datos
           - El autoguardado en el calendarioy la lista de la compra elimina errores en el usuario.
           - Que el tracker de alérgenos se muestre de forma contextual ha dado buenos resultados. 
          - Cosas que haria distinto: 
            - Diseñar al base de datos pensando en compartir con la familia desde el principio. Ya que la migración del esquema original dió muchos problemas e implico reescritura de las políticas de RLS.
            - Usar React Query o SWR en vez de useEffect y useState  para la carga de datos. Simplifica mucho la gestion de los estados de carga y la caché.
    Futuros updates:
          - El sistema de "magic link" es válido por el momento pero para un uso mas intensivo quizás tener un login puede ser mas eficiente para gestionar datos
          - Un libro de recetas vinculadas a los alimentos del catálogo
          - Mejor definición de alimentos
          - Domini propio y trabajo de branding y estilos
          - Tests unitarios del motor de validación de alimentos.
          `,
    tags: ['React 18', 'Supabase', 'Tailwind CSS', 'Vercel', 'Resend'],
    github: 'https://github.com/ferbecere/CuinaBebe.git',
    live: 'https://cuina-bebe.vercel.app/',
  },
  {
    num: '002',
    title: 'Artline',
    desc: 'Juego interactivo online sobre historia y arte',
    info: 'Texto largo para el modal.',
    tags: ['UX Research', 'Figma'],
    github: 'https://github.com/ferbecere/CuinaBebe.git',
    live: 'https://artline-production.up.railway.app/',
  },
  {
    num: '003',
    title: 'Wikidice',
    desc: 'Juevo interactivo local mediante Wikipedia',
    info: 'Texto largo para el modal.',
    tags: ['Motion', 'SVG'],
    github: 'https://github.com/ferbecere/wiki_dice.git',
    live: 'https://wikidice.vercel.app/',
  },
  {
    num: '004',
    title: 'SimPass',
    desc: 'Generador de contraseñas legibles y seguras',
    info: 'Texto largo para el modal.',
    tags: ['Branding', 'CSS'],
    github: 'https://github.com/ferbecere/SimPass.git',
    live: 'https://sim-pass.vercel.app/',
  },
  {
    num: '005',
    title: 'ArcThreads',
    desc: 'En desarrollo. Herramienta para escritura y generación de mundos (worldbuilding)',
    info: null,
    tags: ['TBD'],
    github: 'https://github.com/ferbecere/arcThread.git',
    live: null,
  },
];

const SKILLS = [
  'UI Design', 'UX Research', 'Adobe',
  'Figma', 'Js & Ts', 'anime.js', 'Angular',
  'CSS & tailwind', 'SVG', 'React',
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
