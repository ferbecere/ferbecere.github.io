/* ═══════════════════════════════════════════
   cursor.js — Geometric glass diamond cursor
   
   CANVAS BÁSICO — qué hace cada cosa:
   ─────────────────────────────────────────
   ctx.save() / ctx.restore()
     → Guarda y restaura el "estado" del canvas
       (transformaciones, colores, alpha, etc.)
       Útil para aplicar transformaciones locales
       sin afectar al resto del dibujo.

   ctx.translate(x, y)
     → Mueve el origen de coordenadas a (x, y).
       Todo lo que dibujes después será relativo
       a ese nuevo punto.

   ctx.rotate(angle)
     → Rota el sistema de coordenadas 'angle'
       radianes. Por eso translate primero:
       queremos rotar alrededor del centro
       del rombo, no del origen del canvas.

   ctx.beginPath() / ctx.closePath()
     → Inicia / cierra un camino vectorial.

   ctx.moveTo / ctx.lineTo
     → Define los vértices del polígono.

   ctx.createLinearGradient(x0,y0,x1,y1)
     → Crea un gradiente entre dos puntos.
       Los colores se añaden con .addColorStop(t, color)
       donde t va de 0 (inicio) a 1 (fin).

   ctx.fill() / ctx.stroke()
     → Rellena o traza el camino actual.

   ctx.globalAlpha
     → Opacidad global de lo que se dibuje a continuación.

   ctx.shadowBlur / ctx.shadowColor
     → Desenfoque de sombra exterior (glow).
═══════════════════════════════════════════ */

(function () {

  // ─── Canvas setup ─────────────────────────────
  const canvas = document.getElementById('cursor-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);


  // ─── Estado del cursor ────────────────────────
  // anime.js va a animar este objeto.
  // El render loop lo lee en cada frame.
  const state = {
    x:            -100,
    y:            -100,
    rotation:     0,
    scale:        1,
    r: 200, g: 230, b: 255,   // color base: azul cristal
    glowIntensity: 18,
    innerAlpha:    0.15,
    t: 0,   // 0 = colapsado en el centro · 1 = expandido hasta los vértices
  };

  let rawX = window.innerWidth  / 2;
  let rawY = window.innerHeight / 2;


  // ─── 1. SEGUIMIENTO SUAVIZADO ─────────────────
  // En vez de un lerp manual en el render loop,
  // cada mousemove dispara un anime() corto que
  // interpola state.x/y hacia el ratón.

  document.addEventListener('mousemove', e => {
    rawX = e.clientX;
    rawY = e.clientY;

    state.x = rawX;
    state.y = rawY;

    const el = document.getElementById('cursor-coords');
    if (el) {
      el.textContent =
        'X:' + String(Math.round(rawX)).padStart(3,'0') +
        ' Y:' + String(Math.round(rawY)).padStart(3,'0');
    }
  });


  // ─── 2. ROTACIÓN CONTINUA ─────────────────────
  anime({
    targets: state,
    rotation: Math.PI * 2,
    duration: 12000,
    easing: 'linear',
    loop: true,
  });


  // ─── 3. IDLE BREATHING ───────────────────────
  anime({
    targets: state,
    scale: [1, 1.08, 1],
    glowIntensity: [18, 32, 18],
    duration: 2400,
    easing: 'easeInOutSine',
    loop: true,
  });


  // ─── 4. ROMBO INTERIOR ANIMADO ────────────────
  // state.t va de 0 a 1 a 0 en loop.
  // 0 = los vertices top/bottom en el centro (0,0)
  // 1 = los vertices top/bottom en los extremos
  // Los vertices left/right siempre anclados.
  anime({
    targets: state,
    t: [0, 1],
    duration: 1600,
    easing: 'easeInOutCubic',
    direction: 'alternate',
    loop: true,
  });


  // ─── 5. CLICK — amarillo + punch ─────────────
  document.addEventListener('mousedown', () => {
    anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: state, scale: 1.7, duration: 100 })
      .add({ targets: state, r: 232, g: 197, b: 71,
             glowIntensity: 55, innerAlpha: 0.45,
             duration: 80 }, 0);
  });

  document.addEventListener('mouseup', () => {
    anime.timeline()
      .add({ targets: state, scale: 1,
             duration: 700, easing: 'easeOutElastic(1, 0.5)' })
      .add({ targets: state, r: 200, g: 230, b: 255,
             glowIntensity: 18, innerAlpha: 0.15,
             duration: 900, easing: 'easeOutQuad' }, 0);
  });


  // ─── 6. HOVER sobre interactivos ─────────────
  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      anime({ targets: state, scale: 1.35, glowIntensity: 38,
              duration: 300, easing: 'easeOutBack(2)' });
    });
    el.addEventListener('mouseleave', () => {
      anime({ targets: state, scale: 1, glowIntensity: 18,
              duration: 500, easing: 'easeOutElastic(1, 0.5)' });
    });
  });


  // ─── 7. RENDER LOOP ──────────────────────────
  // anime.js actualiza 'state'. Nosotros solo dibujamos.

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { x, y, rotation, scale, r, g, b, glowIntensity, innerAlpha, t } = state;
    const size = 22 * scale;

    // Guardamos estado para que translate+rotate sean locales
    ctx.save();

    // Mover origen al centro del cursor, luego rotar
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Función reutilizable que traza el rombo
    const diamond = () => {
      ctx.beginPath();
      ctx.moveTo(0,     -size);   // arriba
      ctx.lineTo(size,   0);      // derecha
      ctx.lineTo(0,      size);   // abajo
      ctx.lineTo(-size,  0);      // izquierda
      ctx.closePath();
    };

    // Capa 1 — glow exterior
    ctx.shadowColor = `rgba(${r},${g},${b},0.75)`;
    ctx.shadowBlur  = glowIntensity;
    diamond();
    ctx.fillStyle = `rgba(${r},${g},${b},0.07)`;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Capa 2 — relleno glass con gradiente diagonal
    const grad = ctx.createLinearGradient(-size, -size, size, size);
    grad.addColorStop(0,   `rgba(255,255,255,${innerAlpha * 1.6})`);
    grad.addColorStop(0.3, `rgba(${r},${g},${b},${innerAlpha})`);
    grad.addColorStop(0.7, `rgba(${r},${g},${b},${innerAlpha * 0.5})`);
    grad.addColorStop(1,   `rgba(0,0,0,${innerAlpha * 0.4})`);
    diamond();
    ctx.fillStyle = grad;
    ctx.fill();

    // Capa 3 — borde nítido
    diamond();
    ctx.strokeStyle = `rgba(${r},${g},${b},0.92)`;
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Capa 4 — rombo interior animado
    // state.t interpola los vértices top/bottom desde (0,0) hasta (0, ±size)
    // Los vértices left/right siempre en (-size,0) y (size,0) — fijos.
    // Resultado: un rombo que "respira" expandiéndose desde el eje horizontal.
    const topY    = -size * t;   // empieza en 0, llega a -size
    const bottomY =  size * t;   // empieza en 0, llega a +size

    ctx.lineWidth   = 0.8;
    ctx.strokeStyle = `rgba(255,255,255,0.55)`;

    ctx.beginPath();
    ctx.moveTo(-size, 0);   // izquierda (fijo)
    ctx.lineTo(0, topY);    // arriba (animado)
    ctx.lineTo(size,  0);   // derecha (fijo)
    ctx.lineTo(0, bottomY); // abajo (animado)
    ctx.closePath();
    ctx.stroke();

    // Capa 5 — punto central (pixel touch)
    const dot = 2.5 * scale;
    ctx.fillStyle = `rgba(255,255,255,0.9)`;
    ctx.fillRect(-dot / 2, -dot / 2, dot, dot);

    ctx.restore();
  }

  (function loop() {
    draw();
    requestAnimationFrame(loop);
  })();

})();