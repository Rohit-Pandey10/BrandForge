import { isFamilyIntent, extractDomain } from '../server/controllers/interviewerController.js';

const cleanXml = (unsafe = '') => 
  String(unsafe).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '\'': '&apos;', '"': '&quot;'
  }[c]));

console.log('--- TEST 1: XML ESCAPING FOR BRAND NAMES WITH & ---');
const brandNamesWithAmpersand = [
  "Campiña Hearth & Wine",
  "Lucca & Sons Pizzeria",
  "Salt & Pepper & Thyme",
  "Tom's <Special> Pie & Grill"
];

for (const name of brandNamesWithAmpersand) {
  const sanitized = cleanXml(name);
  const testSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 360" width="1000" height="360">
  <rect width="100%" height="100%" fill="#f2f1ed" />
  <text x="500" y="50">${sanitized} — Color System</text>
  <text x="500" y="76">Synthesized Design Tokens</text>
</svg>`;

  // Verify that any & is part of a valid XML entity
  const rawAmpersands = testSvg.replace(/&(amp|lt|gt|apos|quot);/g, '');
  const unescapedAmp = /&/.test(rawAmpersands);
  if (unescapedAmp) {
    console.error(`FAIL: Found raw ampersand in: ${sanitized}`);
    process.exit(1);
  } else {
    console.log(`PASS: "${name}" -> "${sanitized}"`);
  }
}

console.log('\n--- TEST 2: AUDIENCE-TO-VIBE ALIGNMENT DETECTION ---');
const testQueries = [
  { text: "cozy family pizza restaurant", expectedFamily: true },
  { text: "A bustling family-friendly pizza place with long tables", expectedFamily: true },
  { text: "An upscale date-night cocktail lounge with tasting menu", expectedFamily: false }
];

for (const q of testQueries) {
  const isFam = isFamilyIntent(q.text);
  const domain = extractDomain(q.text);
  console.log(`Query: "${q.text}" -> Domain: ${domain}, isFamily: ${isFam}`);
  if (isFam !== q.expectedFamily) {
    console.error(`FAIL: Expected isFamily=${q.expectedFamily} but got ${isFam}`);
    process.exit(1);
  }
}

console.log('\n--- ALL UNIT CHECKS PASSED ---');
