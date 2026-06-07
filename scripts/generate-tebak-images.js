#!/usr/bin/env node
/**
 * scripts/generate-tebak-images.js
 *
 * Generate AI images untuk Tebak Gambar via OpenAI DALL-E 3,
 * upload ke Firebase Storage, simpan URL mapping ke
 * `data/tebak-gambar-urls.json`.
 *
 * USAGE:
 *   1. Set env vars di `.env.local`:
 *      - OPENAI_API_KEY=sk-...
 *      - FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  (JSON 1 baris)
 *      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tulis-noon.firebasestorage.app
 *
 *   2. Install deps (kalau belum):
 *      npm i -D openai firebase-admin dotenv
 *
 *   3. Run:
 *      node scripts/generate-tebak-images.js                 # generate semua yang belum ada
 *      node scripts/generate-tebak-images.js --category makanan   # 1 kategori aja
 *      node scripts/generate-tebak-images.js --limit 5            # hanya 5 item (testing)
 *      node scripts/generate-tebak-images.js --force              # regenerate semua
 *      node scripts/generate-tebak-images.js --dry-run            # cek apa yang akan dijalanin tanpa generate
 *
 * COST:
 *   DALL-E 3 standard: $0.04/gambar. 200 item = ~$8 (one-time).
 *   Incremental: kalau crash di tengah, tinggal re-run, skip yang udah ada.
 *
 * OUTPUT:
 *   - Firebase Storage: tebak-gambar/{categoryId}/{slug}.png (public)
 *   - Local JSON map: data/tebak-gambar-urls.json
 *     Format: { "makanan": { "خُبْز": "https://..." }, ... }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
} catch (e) {
  console.warn('⚠️  dotenv not installed — pastiin env vars di-set manual');
}

// ---------- ARG PARSING ----------
const args = process.argv.slice(2);
const flags = {
  category: null,
  limit: Infinity,
  force: false,
  dryRun: false,
};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--category' && args[i + 1]) flags.category = args[++i];
  else if (args[i] === '--limit' && args[i + 1]) flags.limit = parseInt(args[++i], 10);
  else if (args[i] === '--force') flags.force = true;
  else if (args[i] === '--dry-run') flags.dryRun = true;
}

// ---------- VALIDATION ----------
const REQUIRED = ['OPENAI_API_KEY'];
if (!flags.dryRun) REQUIRED.push('FIREBASE_SERVICE_ACCOUNT', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`❌ Missing env var: ${k}`);
    process.exit(1);
  }
}

// ---------- FIREBASE INIT (lazy) ----------
let storage = null;
function initFirebase() {
  if (storage) return storage;
  const admin = require('firebase-admin');
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  storage = admin.storage().bucket();
  return storage;
}

// ---------- DATA FILE PARSE ----------
const DATA_PATH = path.join(__dirname, '..', 'data', 'tebak-gambar-levels.js');
const URLS_PATH = path.join(__dirname, '..', 'data', 'tebak-gambar-urls.js');

function parseDataFile() {
  const text = fs.readFileSync(DATA_PATH, 'utf-8');
  const levels = [];
  let currentLevel = null;

  // Split into lines, scan for category id and items
  const lines = text.split('\n');
  for (const line of lines) {
    // Match level header: id: 'makanan',
    const levelMatch = line.match(/^\s{4}id:\s*['"]([\w-]+)['"]\s*,?\s*$/);
    if (levelMatch) {
      currentLevel = { id: levelMatch[1], items: [] };
      levels.push(currentLevel);
      continue;
    }
    // Match item: { image: '🍞', imageUrl: null, arabic: 'خُبْز', latin: '...', id: 'Ka\'bah', ... }
    // Pakai pattern yang handle escaped apostrophe (`\'` di dalam string single-quote).
    const STR = `'((?:[^'\\\\]|\\\\.)*)'`; // single-quoted dengan escape support
    const re = new RegExp(
      `\\{\\s*image:\\s*${STR}\\s*,\\s*imageUrl:\\s*(null|${STR})\\s*,\\s*arabic:\\s*${STR}\\s*,\\s*latin:\\s*${STR}\\s*,\\s*id:\\s*${STR}`
    );
    const itemMatch = line.match(re);
    if (itemMatch && currentLevel) {
      // Unescape \' → ' in captured fields
      const unesc = (s) => s.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
      currentLevel.items.push({
        image: unesc(itemMatch[1]),
        imageUrl: itemMatch[2] === 'null' ? null : unesc(itemMatch[3]),
        arabic: unesc(itemMatch[4]),
        latin: unesc(itemMatch[5]),
        id: unesc(itemMatch[6]),
      });
    }
  }
  return levels;
}

// ---------- URL MAP LOAD/SAVE ----------
function loadUrlMap() {
  if (!fs.existsSync(URLS_PATH)) return {};
  try {
    const text = fs.readFileSync(URLS_PATH, 'utf-8');
    // Extract the object literal between `= ` and `;`
    const match = text.match(/export\s+const\s+TEBAK_GAMBAR_URLS\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return {};
    // eslint-disable-next-line no-new-func
    return new Function(`return ${match[1]}`)();
  } catch {
    return {};
  }
}

function saveUrlMap(map) {
  const body = JSON.stringify(map, null, 2);
  const out = `// data/tebak-gambar-urls.js
// Auto-generated mapping: { categoryId: { arabicWord: imageUrl } }
// Populated by scripts/generate-tebak-images.js (DALL-E 3 → Firebase Storage).
// JANGAN edit manual — file ini di-overwrite tiap kali script jalan.

export const TEBAK_GAMBAR_URLS = ${body};
`;
  fs.writeFileSync(URLS_PATH, out, 'utf-8');
}

// ---------- PROMPT BUILDER ----------
// Goal: konsisten visual style — flat illustration, white bg, no text.
function buildPrompt(item, category) {
  // Map kategori → style hint
  const categoryHints = {
    makanan: 'food item',
    tempat: 'building or place',
    'hewan-alam': 'animal or nature element',
    benda: 'everyday object',
    'pakaian-umrah': 'clothing or religious item',
    tubuh: 'body part',
    transportasi: 'vehicle or transportation',
    'cuaca-waktu': 'weather or time concept',
    profesi: 'person in profession (modest clothing, no faces in detail)',
    olahraga: 'sport or activity',
  };
  const hint = categoryHints[category] || 'object';
  return `A simple, clean, flat vector illustration of "${item.id}" (a ${hint}). Centered composition on solid white background. Soft pastel colors with earthy tones (terracotta, sage green, sandy beige). Minimalist children's book illustration style. NO text, NO captions, NO letters. Iconic and clearly recognizable. Single subject, no clutter.`;
}

// ---------- HELPERS ----------
function slugify(s) {
  return s.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---------- OPENAI GENERATE ----------
async function generateImage(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  return data.data[0].url;
}

// ---------- FIREBASE UPLOAD ----------
async function uploadToStorage(buffer, storagePath) {
  const bucket = initFirebase();
  const file = bucket.file(storagePath);
  await file.save(buffer, {
    metadata: { contentType: 'image/png', cacheControl: 'public, max-age=31536000, immutable' },
    public: true,
  });
  // Public URL via download token (or makePublic)
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

// ---------- MAIN ----------
async function main() {
  console.log('🎨 Tebak Gambar — AI Image Generator');
  console.log('=====================================\n');

  const levels = parseDataFile();
  console.log(`📦 Parsed ${levels.length} categories, ${levels.reduce((s, l) => s + l.items.length, 0)} items total`);

  const urlMap = loadUrlMap();
  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const level of levels) {
    if (flags.category && level.id !== flags.category) continue;
    console.log(`\n📁 ${level.id} (${level.items.length} items)`);
    urlMap[level.id] = urlMap[level.id] || {};

    for (const item of level.items) {
      if (totalGenerated >= flags.limit) break;

      const existing = urlMap[level.id][item.arabic];
      if (existing && !flags.force) {
        console.log(`   ⏭️  ${item.id} (already exists)`);
        totalSkipped++;
        continue;
      }

      const prompt = buildPrompt(item, level.id);
      const slug = slugify(item.id);
      const storagePath = `tebak-gambar/${level.id}/${slug}.png`;

      if (flags.dryRun) {
        console.log(`   📝 [DRY] ${item.id} → ${storagePath}`);
        console.log(`        prompt: ${prompt.substring(0, 80)}...`);
        totalGenerated++;
        continue;
      }

      try {
        console.log(`   🎨 ${item.id}...`);
        // 1. Generate via DALL-E
        const dalleUrl = await generateImage(prompt);
        // 2. Download
        const buffer = await downloadBuffer(dalleUrl);
        // 3. Upload to Firebase
        const publicUrl = await uploadToStorage(buffer, storagePath);
        // 4. Save to map (incremental — save after EVERY item for crash safety)
        urlMap[level.id][item.arabic] = publicUrl;
        saveUrlMap(urlMap);
        console.log(`      ✅ ${publicUrl.substring(0, 60)}...`);
        totalGenerated++;
        // Polite rate limit (DALL-E 3 = 7 RPM tier 1, 15 RPM tier 2)
        await sleep(2000);
      } catch (err) {
        console.error(`      ❌ ${err.message}`);
        totalErrors++;
      }
    }
    if (totalGenerated >= flags.limit) break;
  }

  console.log('\n=====================================');
  console.log(`✅ Generated: ${totalGenerated}`);
  console.log(`⏭️  Skipped:   ${totalSkipped}`);
  console.log(`❌ Errors:    ${totalErrors}`);
  console.log(`\n💾 URL map saved to: data/tebak-gambar-urls.js`);
  console.log(`\n📲 Frontend will auto-load URLs via the JSON map.`);
}

main().catch((err) => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
