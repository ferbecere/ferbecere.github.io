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
    info: `
    Contexto: Artline es un juego multijugador en tiempo real basado en el juego de cartas Timeline. Dos jugadores deben ordenar cronológicamente obras del MET. El que las ordene mas facilmente gana.
    Stack: - Next.js16 (con AppRouter) y TypeScript: Base del proyecto
           - Socket.io: para la comunicación entre jugadores
           - Node.js: servidor custom(tsx) para correr en paralelo al frontend
           - Met Museum APi - Api pública y sin autenticación con mas de 400.000 obras de dominio público.
           - react-simple-maps + TopoJSON para generar el minimapa interactivo en "mas información".
           - Railway: para desplegar en producció con CI/Cd autmático via Github.
    Retos: - Conectar la arquitectura del servidor: Next.js gestiona el frontend mientras que el servidor Node.js maneja los WebSockets. Sincronizar el el ciclo de vida de ambos y que Railway los sirviera correctamente requirió de varias iteraciones.
           - Gestionar las búsquedas a la MetPi: El formato de búsqueda absoluta (q=*) fucionaba en local pero fallaba desde las IPs de Railway. Así que tocó definir una serie de términos para hacer las búsquedas concretas por departamentos y cachear los IDs.
           - El mapa geográfico dió problemas a la hora de recuperar la información de la API de met ya que no siguen une estándar consistnte donde mezclan países, gentilicios, culturas históricas y otras variedades. Lo que implicó construir un diccionadio de mapeo con una búsqueda parcial y limpiar los strings en el cliente.
           - Socket.io también dió algun que otro problema
    Aprendizajes:
          - Positivo: 
            - Socket.io fue una implementación moderadamente sencilla y que ha facilitado mucho la gestión del código del servidor.
            - Separar la lógica dle jeugo en un archivo a parte aislado dle servidor hacía facil hacer tests y modficiar sin tocar el código de red.
            - El uso de TypeScript hacia mas pesado el desarrollo. Saltaban mas errores pero eran mas fácilmente identificables.
            - Este proyecto, por el momento, ha sido el mas intenso en cuanto a configuración y trabajo de backend. Hostname, puertos, CORS y como se comportan las APIS en otros entornos.
            - Hacer "betatest" del juego ayudó a descubrir que era importante implementar el chat de escritura. También poner condiciones de rendición para no alargar las partidas inneesariamente.
          - Cosas que haría distinto:
            - Diseñar mejor toda la parte del back. Muchas reescrituras fueron por no tener bien definidos los eventos de Socket.io.
            - Validar los datos de la Met APi desd ele principio con un esquema estricto.
            - Probar el despliegue en Railway (o Vercel, donde fuere) antes. Dejarlo para cuando ya estaba todo implementado probocó problemas de entorno (hostname, puestos, comportamiento de las APIs..).
    Futuros updates:
            - Matchmaking público: ahora mismo se gestiona por salas privadas. Crear una cola de espera para jugar con desconocidos puede ser interesante y dinamizar el juego.
            - Filtros de partida: según tipos concretos de obras, departamenetos del museo, etc.
            - Historial de partidas: Persistencia en la bbdd.
            - Adaptación a móvil: no sé cuán viable puede ser por formato de pantalla y exceso de información.
            - Más museos: Añadir mas apis y conectarlas

    `,
    tags: ['NextJs', 'Ts', 'Node.js', 'APis públicas', 'Railway', 'socket.io', 'REST API', 'CI/CD'],
    github: 'https://github.com/ferbecere/CuinaBebe.git',
    live: 'https://artline-production.up.railway.app/',
  },
  {
    num: '003',
    title: 'Wikidice',
    desc: 'Juevo interactivo local con uso de la API de Wikipedia',
    info: `Es un juego de navegador colaborativo local para profundizar de forma amena en el conocimienot histórico.
    La mecánica general es lanzar unos dados para generar un año al azar, tomar artículos reales de wikipedia de ese año e intentar colaborativemente, construir una narrativa conectnado los hechos escogidos.
    Stack: - React18 + Vite
           - CSS + GFonts para estilos
           - REST API de wikipedia (pública. Sin autenticación)
           - Drag&Drop nativo de HTML.
           - Deploy en Vercel
    Retos: - Parseo de la API de wikipedia: Esta no tiene un endpoint directo de "eventos del año X". Se encadenan tres llamadas: obtener los ídnices de scción del artículo del año busacdo. Selecionar las seccioens (Events, Births, Deaths) y resolver los links internso de wikitext para tener un extracto de cda artículo.
           - El rendimiento de cada fech: cada tirada lanzaba entre 4 y 6 llamadas encadenadas a la API (era muy lenta). Escondí con una animación de muestra de fecha el tiempo que necesitaba el fetch.
           - Limité las fechas entre el año 0 y el 2025 ya que los articulos a futuro no suelen tener una información muy regular.
           - Generar los dados o "pips" mediante una grid de CSS. Evitando librerías externas.
    Aprendizajes:
          - Positivos:
            - lifting state up: traducir el patrón de App.jsx como padre (y cerebro) que envia props hacia abajo y recibe eventos de los hijos es una traducción bastante literal del @input/@output de angular.
            - CSS Modules: La migración de estilos inline a CSS modules hace mas sencillo entender los estilos que son de scope local y estilos globales. Además Vite los soporta sin configuración extra. Si mas adelante implementamos Next.js no habrá problema porque también lo reconoce.
            - Separación de responsabilidades: Manter la lógica de la API aislada mediante hooks facilitó iterar la lógica de fetch sin tener que tocar ningún componentne de UI.
          - Cosas que haría distintas:
            - Implementaria desde el principio Next.js: Quería añadir backend (auth y persitencia de partidas básicamente) pero no queria complicarme al principio y decidí desarrollar la lógica. De haber empezado con App Router habriamos ido mas rápido.
            - usar Typescript (?). La idea del proyecto estaba mas o menos clara desde el principio pero a la hora de desarrollar se complicó ya que, por ejemplo, el objeto 'card' se usa en 4 compoentnes distitnos con campos distintos. Rastrear propiedades se hizo tedioso.
            - Hacer Test unitarios en al lógica de la APi. El parser de wikitext es frágil ante cambios de formato de los artículos de wikipedia.
          - Futuros updates: 
            - Sistema de puntuaciónes
            - idioma configurable
            - reroll individual, sin perder el año pero poder ver otras cartas.
            - Mejor gestión de años sin datos: implementar mejores mecanismos de recuepración cuando se devuelven 0 resultados en años determinados.
            - Migración a Next.js
     `,
    tags: ['React', 'Vite', 'CSS Modules', 'Vercel', 'APi', 'HTML5 DnD'],
    github: 'https://github.com/ferbecere/wiki_dice.git',
    live: 'https://wikidice.vercel.app/',
  },
  {
    num: '004',
    title: 'SimPass',
    desc: 'Generador de contraseñas legibles y seguras',
    info: `SimPass (o Simple Password) es un generador de contraseñas de navegador, contruido como ejercicio de aprendizaje de TypeScript vanilla (sin frameworks).
    El objetivo era entender como se gestionan estados, tipar correctamente estructuras de datos y sincronizar con el DOM sin apoyo de frameworks o librerias (ni angular ni react).
    Stack: - React + Vite
           - HTML y CSS vanilla para la UI
    Retos: - La gestión del estado sin un frameworks requeria actualiar el estado y sincronizar manualmente el DOm. Entonces es importante ser muy explícito sobre qué función tiene cada responsabildiad.
           - EL DOM generaba en ocasioens bugs de estados "fantasma" al recargar.
           - El uso de typeguards: Ya que el navegador transpila a js el DOM no tiene ni idea de que tipados duros hemos hecho. Así que tenemos que reindicarlo para validar que el formato de contraseña definido es el que está generándose.
    Aprendizajes:
           - Positivos: 
            - El desarrollo del algoritmo "readable" para que gener contraeñas fonéticamente pronunciables. Este alterna vocal-consonsate o consonate-vocal aleatoriamente. Excluí también la H, Q e Y por ser homófonas o dar problemas a la hora de imaginar la palabra.
            - Usar el getElementByID al principio dió problemas pero ayuda a evitar errores.
            - el patron readonly<T> + as const para el estado inicial y spread para el mutable me ha ayudado a entender como funciona under the hood en los frameworks.
            - La separación de utilidades por módulos indepnedientes (pswrodLogic.ts y tags.ts por ejemplo) ayudó a encapsular y reducir el impacto de los cambios en los diferntes métodos.
           - Cosas que haría distintas:
            - Evitar el esatdo global mutable, state es uan variable mutable en el m´doulo raiz. En este proyecto tan pequeño es gestionable pero en algo mas grande habría requerido de uan función reducer pura.
            - Tests unitarios.
            - Seprar initStateFromDOM en dos responsabilidades: leer el DOM para inicar el estado y escribir el dom para relfejarlo. Aquí hubo mucho lio
            - Considerar Wrb Crypto APi, ya que Math.ranodm() no es realmente seguro.
    Futuros updates:
            - migrar a crypto.geRandomValues()
            - botón de copiar al portapapeles corregido
            - mejorar toda la UI
            - hacer versión mobile
            - modo "frase de paso" 
            - tests unitarios.     
  
    `,
    tags: ['TS', 'Vite', 'no Framework', 'Utility tool'],
    github: 'https://github.com/ferbecere/SimPass.git',
    live: 'https://sim-pass.vercel.app/',
  },
  {
    num: '005',
    title: 'ArcThreads',
    desc: 'En desarrollo. Herramienta para escritura y generación de mundos (worldbuilding)',
    info: null,
    tags: ['TBD', 'angular'],
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
