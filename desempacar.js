const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const entrada = process.argv[2];
const salidaHtml = process.argv[3] || 'public/login.html';
const carpetaAssets = process.argv[4] || 'public/sistema';

if (!entrada) {
  console.error('Uso: node desempacar.js <archivo-empaquetado.html> [salida.html] [carpeta-assets]');
  process.exit(1);
}

const html = fs.readFileSync(entrada, 'utf8');

function bloque(tipo) {
  const i = html.indexOf(`<script type="__bundler/${tipo}">`);
  if (i < 0) return null;
  const desde = html.indexOf('>', i) + 1;
  return html.slice(desde, html.indexOf('</script>', desde)).trim();
}

const manifest = JSON.parse(bloque('manifest'));
let plantilla = JSON.parse(bloque('template'));
const externos = JSON.parse(bloque('ext_resources') || '[]');
const paginas = JSON.parse(bloque('page_order') || '[]');

if (paginas.length) {
  console.error('Este paquete trae páginas anidadas; el desempacado no las soporta.');
  process.exit(1);
}

const extPorMime = {
  'text/javascript': 'js', 'application/javascript': 'js', 'text/css': 'css',
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg',
  'font/woff2': 'woff2', 'font/woff': 'woff'
};

function nombreBase(uuid, mime, texto) {
  const externo = externos.find(e => e.uuid === uuid);
  if (externo) return path.basename(new URL(externo.id).pathname).replace(/\.(min\.)?js$/, '');
  if (mime.startsWith('font/')) return 'fuente';
  if (mime.startsWith('image/')) return 'imagen';
  if (texto && texto.includes('dc-runtime')) return 'runtime';
  if (mime.includes('javascript')) return 'app';
  return 'recurso';
}

fs.rmSync(carpetaAssets, { recursive: true, force: true });
fs.mkdirSync(carpetaAssets, { recursive: true });

const rutaPublica = '/' + path.relative(path.dirname(salidaHtml), carpetaAssets).split(path.sep).join('/');
const rutas = {};
let total = 0;

for (const [uuid, entry] of Object.entries(manifest)) {
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) bytes = zlib.gunzipSync(bytes);
  const esTexto = /javascript|css|json|html|svg/.test(entry.mime);
  const base = nombreBase(uuid, entry.mime, esTexto ? bytes.toString('utf8') : null);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const nombre = `${base}.${hash}.${extPorMime[entry.mime] || 'bin'}`;
  fs.writeFileSync(path.join(carpetaAssets, nombre), bytes);
  rutas[uuid] = `${rutaPublica}/${nombre}`;
  total += bytes.length;
  console.log(`  ${nombre.padEnd(34)} ${String(Math.round(bytes.length / 1024)).padStart(4)} KB`);
}

for (const [uuid, ruta] of Object.entries(rutas)) plantilla = plantilla.split(uuid).join(ruta);

plantilla = plantilla.replace(/\s+integrity="[^"]*"/gi, '').replace(/\s+crossorigin="[^"]*"/gi, '');

const mapaExternos = {};
for (const e of externos) if (rutas[e.uuid]) mapaExternos[e.id] = rutas[e.uuid];
const scriptRecursos = '<script>window.__resources = ' +
  JSON.stringify(mapaExternos).replace(/<\//g, '<\\/') + ';</' + 'script>';

const cabeza = plantilla.match(/<head[^>]*>/i);
if (!cabeza) { console.error('La plantilla no tiene <head>.'); process.exit(1); }
const corte = cabeza.index + cabeza[0].length;
plantilla = plantilla.slice(0, corte) + scriptRecursos + plantilla.slice(corte);

const TITULO = 'TuLavandería · Iniciar sesión';
if (/<title>/i.test(plantilla)) {
  plantilla = plantilla.replace(/<title>[\s\S]*?<\/title>/i, `<title>${TITULO}</title>`);
} else {
  const c2 = plantilla.match(/<head[^>]*>/i);
  const i2 = c2.index + c2[0].length;
  plantilla = plantilla.slice(0, i2) + `<title>${TITULO}</title>` + plantilla.slice(i2);
}
console.log(`\ntítulo de la pestaña: "${TITULO}"`);

const WA_SOPORTE = /https:\/\/wa\.me\/52\d{10,11}/g;
const coincidencias = plantilla.match(WA_SOPORTE);
if (coincidencias) {
  plantilla = plantilla.replace(WA_SOPORTE, 'https://tulavanderia.com.mx/#contacto');
  console.log(`"¿Olvidó sus datos?" ahora va a /#contacto (${coincidencias.length} enlace)`);
} else {
  console.log('aviso: no encontré el enlace de WhatsApp de "¿Olvidó sus datos?", revísalo a mano');
}

fs.writeFileSync(salidaHtml, plantilla);

console.log(`\n${salidaHtml}: ${Math.round(plantilla.length / 1024)} KB`);
console.log(`${carpetaAssets}: ${Object.keys(rutas).length} archivos, ${Math.round(total / 1024)} KB`);
console.log(`antes, todo junto: ${Math.round(html.length / 1024)} KB`);
