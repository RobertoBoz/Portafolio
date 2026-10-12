# Ordenar el repo del portafolio — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar el `index.html` de 438 KB en HTML, CSS, JS e imágenes, y agregar el README y las etiquetas de vista previa, sin cambiar cómo se ve la página.

**Architecture:** Sitio estático sin build. Scripts clásicos cargados en orden `poses → cara → avatar → pagina` que comparten globales, como el script único actual. Las imágenes WebP se extraen byte por byte del base64.

**Tech Stack:** HTML, CSS y JS vanilla. Python y Playwright solo para verificar (no se suben al repo).

**Spec:** `docs/superpowers/specs/2026-10-11-ordenar-repo-design.md`

**Método de ejecución:** Nativo (el usuario pidió aplicar los cambios en esta sesión).

## Global Constraints

- Sin dependencias, sin módulos ES, sin paso de build. Debe funcionar en GitHub Pages y con `file://`.
- Todo el texto nuevo va en español (público: reclutadores en México).
- Se conservan los nombres globales `render`, `go`, `say`, `setMouth`, `ready` y `__manual`.
- El HTML de las secciones (textos, clases, `data-*`) no cambia.

## Review Focus

1. Abrir con doble clic (`file://`): las poses deben cargar igual que en GitHub Pages.
2. Una pose que no carga: su chip queda deshabilitado, y `next` y el scroll la saltan.
3. Falla la pose inicial `standing`: arranca con la primera disponible.
4. Una sección cuya pose no cargó: el scroll cambia los colores sin romper el avatar.
5. Rutas con mayúsculas o espacios: todos los nombres de archivo en minúsculas y sin espacios (GitHub Pages distingue mayúsculas).

---

### Task 1: Capturas de referencia (antes)

- [ ] Servir el `index.html` original y ejecutar `capturar.py`: 5 secciones × 2 tamaños (1440×900, 390×844), `window.__manual=true`, `render(100)`, globo oculto y transiciones congeladas.
- [ ] Capturar dos veces y comparar para medir el ruido de rasterizado. Resultado medido: diferencias de 1 o 2 niveles de color en unos pocos cientos de píxeles. Criterio de igualdad: **0 píxeles con diferencia mayor a 2 niveles**.

### Task 2: Separar CSS e imágenes

**Files:** Create `css/estilos.css` y `img/poses/*.webp`. Modify `index.html`.

- [ ] Mover el contenido de `<style>` a `css/estilos.css` sin cambios.
- [ ] Decodificar los 15 data URIs a `img/poses/<pose>.webp` y `img/poses/peace-boca-<abierta|o>.webp`. Comprobar que el sha256 de cada archivo coincide con los bytes decodificados.
- [ ] Reordenar el `<head>`: `meta charset`, `viewport`, `title`, `description`, Open Graph, preconnect, fuentes, `preload` de `standing.webp` y `css/estilos.css`.

### Task 3: Separar JS y agregar la protección ante fallos

**Files:** Create `js/poses.js`, `js/cara.js`, `js/avatar.js`, `js/pagina.js`.

**Interfaces:**
- `poses.js` produce: `POSES`, `ORDER`, `BUST`, `DATA` (con rutas) y `OK` (Set de poses cargadas).
- `cara.js` produce: `drawFace(n, t, mouth, blink)` y `lidAt(t)`.
- `avatar.js` produce: `prep(n): Promise<boolean>` (true si cargó; nunca rechaza), `render`, `say`, `go`, `next` y `firstOk()`.
- `pagina.js`: chips (con `disabled` si `!OK.has(n)`), eventos, `IntersectionObserver`, copiar correo y arranque.

- [ ] `prep(n)`: dentro de `try`/`catch`. Si `decode()` falla, devuelve `false` y no agrega `n` a `OK`.
- [ ] `go(n, text)`: si `!OK.has(n)`, solo dice el texto (si hay) y no cambia de pose.
- [ ] `next()`: avanza a la siguiente pose de `ORDER` que esté en `OK`.
- [ ] Arranque: `await Promise.all(ORDER.map(prep))`. Si `!OK.has(cur)`, entonces `cur = firstOk()`.
- [ ] Cargar los scripts al final del `<body>`, en orden.

### Task 4: README, vista previa y ficha del repo

- [ ] `docs/captura.png`: captura de escritorio de la sección inicio, con el globo visible.
- [ ] `README.md` con las 6 partes de la spec. Contacto: correo, LinkedIn y GitHub.
- [ ] `og:image` = `https://robertoboz.github.io/Portafolio/docs/captura.png`.
- [ ] Ficha "About" vía API: descripción, homepage y topics `portfolio`, `flutter`, `canvas`, `javascript`, `github-pages`.

### Task 5: Verificación y entrega

- [ ] Capturas después: 0 píxeles con diferencia mayor a 2 niveles frente a las de antes.
- [ ] Funcional: 13 chips, globo, `data-s` al hacer scroll, "Copiar" y consola sin errores (salvo las fuentes bloqueadas en el entorno de prueba).
- [ ] Bloquear `img/poses/walk.webp`: el chip "Caminando" queda `disabled` y no hay errores.
- [ ] Bloquear `img/poses/standing.webp`: el avatar arranca con otra pose.
- [ ] Abrir con `file://`: el avatar dibuja.
- [ ] Commit, push de `ordenar-repo` y pull request con las capturas de antes y después.
