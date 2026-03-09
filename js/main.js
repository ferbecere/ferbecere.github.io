/* 
   main.js — Punto de entrada
   Solo importa módulos y los arranca.*/

import { initHeroAnimation, initNavScroll, initScrollReveal, animateCards, animateTags } from './animations.js';
import { initProjects } from './projects.js';
import { initModal } from './modal.js';
import { initForm } from './form.js';

// 1. Renderizar contenido dinámico primero
//    (las animaciones necesitan los elementos en el DOM)
initModal();
initProjects();

// 2. Arrancar animaciones
initHeroAnimation();
initNavScroll();
initScrollReveal();
animateCards();
animateTags();

// 3. Formulario
initForm();
