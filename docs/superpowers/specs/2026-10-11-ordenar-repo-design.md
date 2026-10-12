# Ordenar y presentar el repo del portafolio — Diseño

**Fecha:** 2026-10-11
**Repo:** RobertoBoz/Portafolio (publicado con GitHub Pages)
**Subproyecto:** 1 de 2 (el 2 será mejorar la página)

## Objetivo

Que el repo sea fácil de mantener y se vea profesional ante reclutadores en México, **sin cambiar cómo se ve ni cómo se comporta la página**.

Hay éxito cuando:

1. Quien abre el repo entiende en segundos quién es Roberto y qué hace la página.
2. Roberto puede cambiar una frase o reemplazar una pose sin editar un archivo de 438 KB.
3. Las capturas de antes y después son idénticas píxel por píxel.

## Lo que dijo el usuario / supuestos

- **Dicho:** quiere ordenar el código, mejorar la página, una buena presentación en GitHub y las tres cosas juntas. El público son reclutadores en México, así que todo va en español. Vinculará GitHub para que Claude suba los cambios. No tiene git en su PC. El contacto del README es el mismo que el de la página, sin teléfono.
- **Supuesto (confirmado):** en este subproyecto la página se ve y se comporta igual. El rediseño queda para el subproyecto 2.

## Situación actual

Un solo `index.html` de unos 438 KB:

- unas 8 KB de CSS;
- un `<script>` de unas 405 KB que contiene 15 imágenes WebP en base64: 13 poses más 2 bocas (`abierta`, `o`) de la pose `peace`;
- `<title>`, fuentes de Google y `<style>` aparecen después de `</head>`.

El script tiene cuatro responsabilidades: datos de poses (`POSES`, `ORDER`, `BUST`, `DATA`), cara (boca y parpadeo), animación y habla (canvas, transiciones, globo), y página (chips de poses, IntersectionObserver por sección, botón "Copiar").

## Parte 1 — Estructura de archivos

```
Portafolio/
├── index.html              contenido: secciones, textos, enlaces
├── css/estilos.css         todo el CSS actual, sin cambios de reglas
├── js/poses.js             POSES, ORDER, BUST, DATA (con rutas a imágenes)
├── js/cara.js              mouthPaths, drawFace, parpadeo (blinks, lidAt)
├── js/avatar.js            canvas, prep, place/drawPose/render, say/go/next
├── js/pagina.js            chips, eventos del stage, scroll por sección, copiar correo, arranque
├── img/poses/*.webp        una imagen por pose + peace-boca-abierta.webp, peace-boca-o.webp
├── docs/captura.png        captura para README y vista previa
├── docs/superpowers/specs/ este documento
└── README.md
```

- Scripts clásicos con `<script src>` al final del `<body>`, en el orden `poses → cara → avatar → pagina`. Sin módulos, sin build. Funciona en GitHub Pages y con doble clic (`file://`).
- Se conservan los nombres globales que usa el código (`window.render`, `window.go`, `window.say`, `window.setMouth`, `window.ready`, `window.__manual`).
- `<title>`, `<link>` de fuentes y la hoja de estilos van dentro de `<head>`.
- El HTML de las secciones, los textos, las clases y los atributos `data-*` no cambian.

## Parte 2 — Imágenes y carga

- Los bytes WebP se extraen del base64 **sin recomprimir**.
- En `DATA`, cada `src` pasa de `data:image/webp;base64,…` a una ruta relativa (`img/poses/<pose>.webp`). Las bocas de `peace` pasan a `img/poses/peace-boca-<forma>.webp`. Tamaños, puntos de cara y coordenadas no cambian.
- Se mantiene `Promise.all(ORDER.map(prep))` antes de arrancar la animación y el primer saludo.
- Se agrega `<link rel="preload" as="image" href="img/poses/standing.webp">`.
- **Único cambio de comportamiento (protección ante fallos):** si una pose no carga, `prep` no rechaza. La pose se marca como no disponible, su chip queda `disabled`, y `go`/`next` la saltan. Si falla la pose inicial, se usa la primera disponible en `ORDER`. Si falla una boca de `peace`, esa pose no anima la boca al hablar y queda la boca original del dibujo (el código actual ya omite el dibujo cuando `q.el` no existe; no se agrega lógica nueva).
- El canvas solo dibuja (`drawImage`, `destination-out`), nunca lee píxeles, así que no hay problemas de origen con `file://`.

## Parte 3 — README y presentación en GitHub

README en español:

1. Nombre, "Tech Lead Mobile · Flutter" y enlace a https://robertoboz.github.io/Portafolio/
2. `docs/captura.png`
3. Sobre mí (3–4 líneas): Tech Lead Mobile en IT Strategy, donde lidera un equipo de cuatro desarrolladores; Flutter desde 2019.
4. Cómo está hecha: HTML, CSS y JS sin frameworks; canvas con ilustración propia; 13 poses con boca y parpadeo animados.
5. Estructura del repo y cómo editar: cambiar una frase (`js/poses.js`), reemplazar una pose (`img/poses/`), verla en local (doble clic en `index.html`).
6. Contacto: correo, LinkedIn y GitHub (los mismos de la página). Sin teléfono.

Extras sin efecto visual:

- `<meta name="description">` y etiquetas Open Graph y Twitter (título, descripción, `og:image` con URL absoluta a `docs/captura.png`, `og:url`, `og:locale=es_MX`).
- Ficha "About" del repo vía API de GitHub: descripción, sitio web (la URL de Pages) y topics `portfolio`, `flutter`, `canvas`, `javascript`, `github-pages`.

## Parte 4 — Verificación y entrega

**Verificación** (con navegador headless):

1. Antes del cambio: capturas de cada sección (`inicio`, `trabajos`, `como-trabajo`, `sobre-mi`, `contacto`) a 1440×900 y 390×844, con `window.__manual = true` y `render(t)` fijo.
2. Después: las mismas capturas. Criterio: **0 píxeles distintos**.
3. Funcional: los 13 chips cambian de pose; el globo escribe la frase; el scroll cambia `data-s` y la pose; "Copiar" funciona; sin errores en consola.
4. Fallo simulado: bloquear `img/poses/walk.webp` y confirmar que su chip queda deshabilitado y lo demás funciona.
5. Comprobar que la página carga también desde `file://`.

**Entrega:**

1. Commits en la rama `ordenar-repo` y pull request con resumen y capturas de antes y después.
2. `main` y la página publicada no cambian hasta que Roberto apruebe.
3. Con su aprobación se une a `main` y GitHub Pages publica.

**Requisito previo:** GitHub vinculado a Claude con permiso de escritura en el repo. Sin eso, el trabajo se prepara aquí y no se sube.

## Fuera de alcance

Rediseño, nuevos textos o secciones, optimizar o redimensionar imágenes, herramientas de build y versión en inglés. Todo eso va al subproyecto 2 o después.
