# Deporty — Proyecto

Este repositorio contiene la interfaz inicial de `Deporty`, una plataforma para gestionar actividades deportivas.

Mejoras aplicadas (2026 best practices):

- Meta tags de SEO y Open Graph en `index.html`.
- `site.webmanifest` añadido para PWA básica.
- Favicon y `mask-icon` referenciados; `theme-color` establecido.
- Accesibilidad: `role`/`aria` en elementos clave, `aria-live` para rotador.
- `prefers-reduced-motion` soportado en CSS y JS.
- `focus-visible` styles para mejor navegación por teclado.
- JavaScript modularizado en `assets/js/main.js` y cargado con `defer`.
- Rotador de deportes actualizado: añadido `Waterpolo` y velocidad de rotación ajustada a 2s.
- PWA: `service-worker.js` añadido y registrado desde `assets/js/main.js`. El SW precachea archivos esenciales y proporciona fallback de navegación.

Cómo probar localmente:

1. Abrir `index.html` en un navegador moderno.
2. Para ver la versión móvil, usa DevTools > Toggle device toolbar.
3. Limpiar caché si el favicon no cambia: `Ctrl+F5`.

Opcionales próximos pasos:

- Añadir `favicon.ico` en la raíz para máxima compatibilidad.
- Generar iconos optimizados (192/512) y agregarlos al `site.webmanifest`.
	- Nota: `assets/images` contiene `icon.png` y `logo.svg`. El `service-worker` precachea estos archivos; para soporte completo de PWA/Apple es recomendable añadir PNG 192/512 y `favicon.ico`.
- Añadir pruebas de accesibilidad automatizadas (axe, pa11y).
- Añadir CI y linting (ESLint, stylelint) y un `package.json`.
