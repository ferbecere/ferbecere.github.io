/* ═══════════════════════════════════════════
   form.js
   
   Gestiona el formulario de contacto:
   - Validación campo a campo (on blur + on submit)
   - Estados del botón: idle → loading → done
     animados con anime.js
   - Limpieza del estado de error
═══════════════════════════════════════════ */

// ── Reglas de validación ──────────────────
// Objeto limpio: cada campo tiene su propia regla.
// Fácil de ampliar sin tocar la lógica del form.

const RULES = {
  name: {
    validate: v => v.trim().length > 0,
    errorId: 'err-name',
  },
  email: {
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    errorId: 'err-email',
  },
  message: {
    validate: v => v.trim().length > 10,
    errorId: 'err-msg',
  },
};

// ── Helpers ───────────────────────────────

function showError(input, errorId) {
  input.classList.add('error');
  const msg = document.getElementById(errorId);
  if (msg) msg.classList.add('visible');
}

function clearError(input, errorId) {
  input.classList.remove('error');
  const msg = document.getElementById(errorId);
  if (msg) msg.classList.remove('visible');
}

function validateField(name, input) {
  const rule = RULES[name];
  if (!rule) return true;

  const valid = rule.validate(input.value);
  if (!valid) {
    showError(input, rule.errorId);
  } else {
    clearError(input, rule.errorId);
  }
  return valid;
}

// ── Estados del botón submit ──────────────
// anime.js gestiona la transición entre estados.
// El botón tiene tres capas (.state-*) apiladas.

function setSubmitState(btn, state) {
  const idle    = btn.querySelector('.state-idle');
  const loading = btn.querySelector('.state-loading');
  const done    = btn.querySelector('.state-done');

  // Escondemos todo primero
  [idle, loading, done].forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
  });

  // Mostramos el estado activo
  const target = { idle, loading, done }[state];
  if (!target) return;

  anime({
    targets: target,
    opacity: [0, 1],
    translateY: [12, 0],
    duration: 300,
    easing: 'easeOutExpo',
  });
}

// ── Submit handler ────────────────────────

async function handleSubmit(e, btn) {
  e.preventDefault();

  const form = e.target;
  const fields = {
    name:    form.querySelector('#input-name'),
    email:   form.querySelector('#input-email'),
    message: form.querySelector('#input-msg'),
  };

  // Validar todos los campos
  let allValid = true;
  for (const [name, input] of Object.entries(fields)) {
    const ok = validateField(name, input);
    if (!ok) allValid = false;
  }

  if (!allValid) {
    // Shake del primer campo con error
    const firstError = form.querySelector('.form-input.error, .form-textarea.error');
    if (firstError) {
      anime({
        targets: firstError,
        translateX: [0, -8, 8, -6, 6, 0],
        duration: 400,
        easing: 'easeInOutSine',
      });
    }
    return;
  }

  // Deshabilitar mientras enviamos
  btn.disabled = true;
  setSubmitState(btn, 'loading');

  // Simular llamada a API (reemplaza con fetch real)
  await new Promise(resolve => setTimeout(resolve, 1800));

  setSubmitState(btn, 'done');

  // Color del botón: verde momentáneo
  anime({
    targets: btn,
    background: ['#e8c547', '#3ecf8e'],
    duration: 400,
    easing: 'easeOutQuad',
  });

  // Reset tras 3s
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    setSubmitState(btn, 'idle');
    anime({
      targets: btn,
      background: ['#3ecf8e', '#e8c547'],
      duration: 600,
      easing: 'easeOutQuad',
    });
  }, 3000);
}

// ── Export ────────────────────────────────

export function initForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('btn-submit');
  if (!form || !btn) return;

  // Inicializar estado del botón
  setSubmitState(btn, 'idle');

  // Validación on-blur (al salir de cada campo)
  Object.entries(RULES).forEach(([name, rule]) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return;

    input.addEventListener('blur', () => validateField(name, input));
    input.addEventListener('input', () => {
      // Limpiar error mientras el usuario escribe
      if (rule.validate(input.value)) {
        clearError(input, rule.errorId);
      }
    });
  });

  form.addEventListener('submit', e => handleSubmit(e, btn));
}
