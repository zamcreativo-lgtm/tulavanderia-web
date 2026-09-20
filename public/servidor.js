const http = require('http');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, 'public');
const puerto = 8080;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (ruta === '/') ruta = '/index.html';
  else if (!path.extname(ruta)) ruta += '.html';
  const archivo = path.join(raiz, path.normalize(ruta));
  if (!archivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404); return res.end('No encontrado: ' + ruta); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream' });
    res.end(datos);
  });
}).listen(puerto, () => {
  console.log('Sitio de prueba en http://localhost:' + puerto);
  console.log('El sistema en  http://localhost:' + puerto + '/login');
  console.log('Para detenerlo, presiona Ctrl+C');
});
