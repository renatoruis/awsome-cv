/**
 * Generates one ATS-friendly PDF per locale from the built site (dist/),
 * using the @media print stylesheet. Output: dist/pdf/renato-ruis-cv-<locale>.pdf
 */
import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const LOCALES = ['en', 'pt-pt', 'pt-br'];
const PORT = 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
};

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let filePath = path.join(DIST, urlPath);
    const s = await stat(filePath).catch(() => null);
    if (s?.isDirectory()) filePath = path.join(filePath, 'index.html');
    const data = await readFile(filePath);
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Serving dist/ on http://localhost:${PORT}`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await mkdir(path.join(DIST, 'pdf'), { recursive: true });

for (const locale of LOCALES) {
  const url = `http://localhost:${PORT}/${locale}/`;
  await page.goto(url, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
  });
  const out = path.join(DIST, 'pdf', `renato-ruis-cv-${locale}.pdf`);
  await writeFile(out, pdf);
  console.log(`✔ ${out}`);
}

await browser.close();
server.close();
console.log('PDFs generated.');
