// Dev helper: screenshot of the print-media layout (what the PDF sees).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const PORT = 4323;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  try {
    let filePath = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const s = await stat(filePath).catch(() => null);
    if (s?.isDirectory()) filePath = path.join(filePath, 'index.html');
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath)] ?? 'application/octet-stream' });
    res.end(await readFile(filePath));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 794, height: 1123 });
await page.emulateMediaType('print');
await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: '/tmp/cv-print.png', fullPage: true });

await browser.close();
server.close();
console.log('done');
