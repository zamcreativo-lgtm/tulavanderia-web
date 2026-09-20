# tulavanderia-web

Sitio de TuLavandería, publicado en Cloudflare Workers sobre tulavanderia.com.mx.
Cada cambio subido a la rama `main` se publica solo.

## Qué hay aquí

- `public/index.html` — la página principal (landing). Se edita a mano.
- `public/login.html` — el sistema, que se abre en `/login`. **No se edita a mano**, se regenera (ver abajo).
- `public/sistema/` — las piezas del sistema: código, tipografías e imagen. Las genera el desempacador.
- `public/hero.webp` — la foto de la landing.
- `public/_headers` — le dice a Cloudflare que guarde en caché los archivos de `sistema/`.
- `wrangler.jsonc` — le dice a Cloudflare que publique la carpeta `public`.
- `desempacar.js` — la herramienta que convierte el archivo de Claude en archivos normales.

## Cómo actualizar el sistema (login)

El código del sistema se escribe en el proyecto de Claude, que entrega un solo
archivo HTML con todo comprimido adentro. Ese archivo no sirve tal cual: hay que
desempacarlo.

Desde esta carpeta, con el archivo que te dio Claude:

    node desempacar.js "C:\ruta\al\archivo-de-claude.html"

Eso reescribe `public/login.html`, vuelve a generar `public/sistema/`, y de paso
aplica solo dos cosas que el archivo de Claude no trae:

1. El título de la pestaña: "TuLavandería · Iniciar sesión".
2. El enlace de "¿Olvidó sus datos?", que debe llevar a `/#contacto` y no a WhatsApp.

Después pruébalo en tu equipo antes de subirlo, porque hay que iniciar sesión
para ver la mayor parte del sistema.

## Por qué se desempaca

El archivo de Claude pesa 513 KB y el celular tiene que bajarlo completo cada vez
que cambia algo. Desempacado, la primera visita baja 168 KB y las siguientes solo
40 KB, porque las piezas quedan guardadas en el teléfono. Los nombres de archivo
llevan un código que cambia cuando cambia el contenido, así que nunca se queda
pegada una versión vieja.
