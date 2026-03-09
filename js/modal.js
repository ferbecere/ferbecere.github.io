/* ═══════════════════════════════════════════
   modal.js — Drawer contextual sobre el grid

   Estructura:
   #modal-backdrop  → fondo oscuro full screen
   #modal-clipper   → contenedor con overflow:hidden
                       posicionado encima del grid
   #modal           → el panel que se desliza dentro
                       del clipper

   El truco: translateX(100%) sobre #modal
   lo saca por el borde derecho del clipper,
   que tiene overflow:hidden — así nunca
   se ve fuera del área del grid.
═══════════════════════════════════════════ */

function createModalMarkup() {
  const backdrop = document.createElement('div');
  backdrop.id = 'modal-backdrop';

  // Clipper: caja con overflow hidden que coincide con el grid
  const clipper = document.createElement('div');
  clipper.id = 'modal-clipper';

  const modal = document.createElement('aside');
  modal.id = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-header">
      <div>
        <span class="modal-num" id="modal-num"></span>
        <h2 class="modal-title" id="modal-title"></h2>
      </div>
      <button class="modal-close" id="modal-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="modal-body">
      <p class="modal-desc" id="modal-desc"></p>
      <ul class="modal-tags" id="modal-tags"></ul>
      <div class="modal-links" id="modal-links"></div>
    </div>
  `;

  clipper.appendChild(modal);
  document.body.appendChild(backdrop);
  document.body.appendChild(clipper);
}

// ── Posicionar clipper sobre el grid ──────
function positionClipper() {
  const grid    = document.getElementById('projects-grid');
  const clipper = document.getElementById('modal-clipper');
  if (!grid || !clipper) return;

  const rect = grid.getBoundingClientRect();

  clipper.style.position = 'fixed';
  clipper.style.top      = rect.top + 'px';
  clipper.style.left     = rect.left + 'px';
  clipper.style.width    = rect.width + 'px';
  clipper.style.height   = rect.height + 'px';
  clipper.style.overflow = 'hidden';
  clipper.style.zIndex   = '201';
  clipper.style.pointerEvents = 'none'; // se activa al abrir

  // El modal ocupa todo el clipper
  const modal = document.getElementById('modal');
  modal.style.position = 'absolute';
  modal.style.inset    = '0';
  modal.style.width    = '100%';
  modal.style.height   = '100%';
}

// ── Apertura ──────────────────────────────
function openModal(project) {
  const backdrop = document.getElementById('modal-backdrop');
  const clipper  = document.getElementById('modal-clipper');
  const modal    = document.getElementById('modal');

  // Contenido
  document.getElementById('modal-num').textContent   = project.num;
  document.getElementById('modal-title').textContent = project.title;
  const raw = project.info || project.desc;
  const formatted = raw.replace(/^\s*##(.+)$/gm, '<strong class="modal-section-title">$1</strong>');
  document.getElementById('modal-desc').innerHTML = formatted;

  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = project.tags.map(t => `<li class="tag">${t}</li>`).join('');

  const linksEl = document.getElementById('modal-links');
  linksEl.innerHTML = '';
  if (project.github) {
    linksEl.innerHTML += `
      <a href="${project.github}" target="_blank" rel="noopener" class="modal-link">
        <span class="modal-link-label">GitHub</span>
        <span>${project.github.replace('https://github.com/', '')} ↗</span>
      </a>`;
  }
  if (project.live) {
    linksEl.innerHTML += `
      <a href="${project.live}" target="_blank" rel="noopener" class="modal-link">
        <span class="modal-link-label">Live</span>
        <span>${project.live.replace('https://', '')} ↗</span>
      </a>`;
  }
  linksEl.style.display = (project.github || project.live) ? '' : 'none';

  // Posicionar y activar interactividad
  positionClipper();
  clipper.style.pointerEvents = 'all';
  backdrop.classList.add('is-open');

  // Modal empieza fuera por la derecha del clipper
  anime.set(modal, { translateX: '100%' });

  anime.timeline({ easing: 'easeOutExpo' })
    .add({ targets: backdrop, opacity: [0, 1], duration: 250 })
    .add({ targets: modal, translateX: ['100%', '0%'], duration: 480 }, '-=150');
}

// ── Cierre ────────────────────────────────
function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const clipper  = document.getElementById('modal-clipper');
  const modal    = document.getElementById('modal');

  anime.timeline({ easing: 'easeInQuart' })
    .add({ targets: modal, translateX: ['0%', '100%'], duration: 380 })
    .add({
      targets: backdrop,
      opacity: [1, 0],
      duration: 220,
      complete() {
        backdrop.classList.remove('is-open');
        clipper.style.pointerEvents = 'none';
      },
    }, '-=150');
}

// ── Export ────────────────────────────────
export function initModal() {
  createModalMarkup();

  document.getElementById('modal-close')
    .addEventListener('click', closeModal);
  document.getElementById('modal-backdrop')
    .addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  window.addEventListener('resize', () => {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop.classList.contains('is-open')) positionClipper();
  });
}

export { openModal };