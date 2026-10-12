// Renders /portfolio/?print=1 in headless Chromium and returns it as a PDF.
// Because it prints the live viewer (which reads api/_data/cases.js), the PDFs
// always match the website's case studies. The CDN caches the result; a new
// deployment (= content change) produces a fresh one.
const puppeteer = require('puppeteer-core');

const LOCAL_CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

// Only ever render our own site (the Host header is user-controlled).
const ALLOWED_HOST = /^(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|(www\.)?vivienevers\.de|[a-z0-9-]+\.vercel\.app)$/i;

async function launch() {
  if (process.env.VERCEL) {
    const chromium = require('@sparticuz/chromium');
    return puppeteer.launch({
      args: chromium.args, executablePath: await chromium.executablePath(),
      headless: 'shell', defaultViewport: { width: 1122, height: 793 },
    });
  }
  const fs = require('fs');
  const executablePath = LOCAL_CHROME.find(p => fs.existsSync(p));
  if (!executablePath) throw new Error('No local Chrome found — set CHROME_PATH');
  return puppeteer.launch({ executablePath, headless: 'new', defaultViewport: { width: 1122, height: 793 } });
}

module.exports = async (req, res) => {
  const v = req.query?.v === 'deep' ? 'deep' : 'short';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (!ALLOWED_HOST.test(host)) { res.status(400).json({ error: 'bad host' }); return; }
  // The Deep Dive is not released yet: only a local server renders it.
  if (v === 'deep' && !/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host)) { res.status(503).json({ error: 'deep dive coming soon' }); return; }
  const proto = /^(localhost|127\.)/.test(host) ? 'http' : 'https';
  const hour = parseFloat(req.query?.h);   // optional: freeze the sky at a given hour (testing)
  const url = `${proto}://${host}/portfolio/?v=${v}&print=1${isNaN(hour) ? '' : '&h=' + hour}`;

  let browser;
  try {
    browser = await launch();
    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForFunction('window.__pdfReady === true', { timeout: 45000 });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const name = `Vivien-Evers_Portfolio_${v === 'deep' ? 'DeepDive' : 'Short'}_2026.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    // CDN keeps it for a day; browsers must never serve a stale copy (stale-while-revalidate in the browser
    // cache handed out old exports after the layout had been fixed)
    res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(Buffer.from(pdf));
  } catch (e) {
    console.error('portfolio-pdf failed', e, 'env:', process.env.AWS_EXECUTION_ENV, process.env.AWS_LAMBDA_JS_RUNTIME, process.env.LD_LIBRARY_PATH, process.version);
    res.status(500).json({ error: 'pdf failed' });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
};
