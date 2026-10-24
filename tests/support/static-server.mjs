// Zero-dependency static server for local testing.
// Serves the repository root and applies the same security headers as vercel.json,
// so tests and exploratory sessions see production-like behaviour (e.g. CSP).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PORT = Number(process.env.PORT) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const SECURITY_HEADERS = Object.fromEntries(
  (vercel.headers?.[0]?.headers ?? [])
    .filter((h) => h.key !== 'Strict-Transport-Security')
    .map((h) => [h.key, h.value])
);

const BLOCKED = [`${sep}node_modules`, `${sep}.git`, `${sep}tests`, `${sep}docs`, `${sep}.github`];

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const relative = normalize(urlPath === '/' ? '/index.html' : urlPath);
  const filePath = join(ROOT, relative);

  if (!filePath.startsWith(ROOT + sep) || BLOCKED.some((p) => filePath.startsWith(ROOT + p))) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      ...SECURITY_HEADERS
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Prep Shop running at http://localhost:${PORT}`);
});
