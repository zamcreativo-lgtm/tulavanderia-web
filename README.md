# tulavanderia-web

Sitio de TuLavandería, publicado en Cloudflare Workers sobre tulavanderia.com.mx.

## Qué hay aquí

- `public/index.html` — la página principal (landing).
- `public/login.html` — el sistema, que se abre en `/login`.
- `public/hero.webp` — la foto de la landing.
- `wrangler.jsonc` — le dice a Cloudflare que publique la carpeta `public`.

## Cómo se publica

Cada cambio subido a la rama `main` se publica solo en tulavanderia.com.mx.

El archivo `login.html` se genera desde el proyecto de Claude donde vive el
código del sistema; no se edita a mano, se reemplaza completo. Después de
reemplazarlo hay que volver a poner dos cosas:

1. El título de la pestaña, tanto en el `<title>` del inicio del archivo como
   dentro de la plantilla interna.
2. El enlace de "¿Olvidó sus datos?", que debe apuntar a
   `https://tulavanderia.com.mx/#contacto`.
