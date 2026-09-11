const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('./_lib/auth');

// Real filenames never reach the client — only these short keys do.
const FILES = {
  'cv-en':       { file: 'v.evers-CV-2026-en.pdf',                 type: 'application/pdf', name: 'Vivien Evers - CV (EN).pdf' },
  'cv-de':       { file: 'v.evers-CV-2026-ger.pdf',                type: 'application/pdf', name: 'Vivien Evers - CV (DE).pdf' },
  'certificate': { file: 'v.evers-examination-certificate-en.pdf', type: 'application/pdf', name: 'Vivien Evers - IHK Certificate.pdf' },
  'contact':     { file: 'vivien-evers.vcf',                       type: 'text/vcard',      name: 'vivien-evers.vcf' },
};

module.exports = (req, res) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const key = req.query?.file;
  const entry = FILES[key];
  if (!entry) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  const filePath = path.join(process.cwd(), 'private', 'downloads', entry.file);
  let data;
  try {
    data = fs.readFileSync(filePath);
  } catch (e) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  res.setHeader('Content-Type', entry.type);
  res.setHeader('Content-Disposition', `inline; filename="${entry.name}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).send(data);
};
