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
  verbose: false,
  doctor: false,
  // Default 13 detik = ~4.6 RPM (di bawah limit tier-1 = 5 RPM untuk gpt-image-*).
  // Akun yang udah tier-2+ bisa pakai --sleep 4000 (15 RPM).
  sleepMs: 13000,
};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--category' && args[i + 1]) flags.category = args[++i];
  else if (args[i] === '--limit' && args[i + 1]) flags.limit = parseInt(args[++i], 10);
  else if (args[i] === '--force') flags.force = true;
  else if (args[i] === '--dry-run') flags.dryRun = true;
  else if (args[i] === '--verbose' || args[i] === '-v') flags.verbose = true;
  else if (args[i] === '--doctor') flags.doctor = true;
  else if (args[i] === '--sleep' && args[i + 1]) flags.sleepMs = parseInt(args[++i], 10);
}

// Error log file untuk debug
const ERROR_LOG = path.join(__dirname, '..', 'tebak-gen-errors.log');
function logError(item, level, err) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${level}/${item.id} (${item.arabic}): ${err.message}\n${err.stack ? err.stack + '\n' : ''}\n`;
  fs.appendFileSync(ERROR_LOG, line);
}

// ---------- VALIDATION ----------
const REQUIRED = ['OPENAI_API_KEY'];
if (!flags.dryRun && !flags.doctor) REQUIRED.push('FIREBASE_SERVICE_ACCOUNT', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
for (const k of REQUIRED) {
  if (!process.env[k]) {
    console.error(`❌ Missing env var: ${k}`);
    console.error(`   Pastiin .env.local punya baris: ${k}=...`);
    console.error(`   Atau export di shell: export ${k}=...`);
    process.exit(1);
  }
}

// ---------- DOCTOR: diagnose env tanpa generate ----------
async function runDoctor() {
  console.log('🩺 Doctor — diagnose environment\n');
  let allOk = true;

  // 1. Check OPENAI_API_KEY format
  const oai = process.env.OPENAI_API_KEY;
  if (!oai) {
    console.log('❌ OPENAI_API_KEY: NOT SET');
    allOk = false;
  } else if (!oai.startsWith('sk-')) {
    console.log(`⚠️  OPENAI_API_KEY: format aneh — mulai dengan "${oai.substring(0, 6)}..." (expect "sk-...")`);
    allOk = false;
  } else {
    console.log(`✅ OPENAI_API_KEY: set (${oai.substring(0, 7)}...${oai.substring(oai.length - 4)})`);
  }
  console.log(`📦 OPENAI_IMAGE_MODEL: ${IMAGE_MODEL}`);

  // 2. Test OpenAI API connectivity + cek model tersedia
  if (oai) {
    process.stdout.write('   → testing OpenAI API... ');
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${oai}` },
      });
      if (res.ok) {
        const data = await res.json();
        const targetModel = data.data?.find(m => m.id === IMAGE_MODEL);
        const dalle3 = data.data?.find(m => m.id === 'dall-e-3');
        const gptImage = data.data?.find(m => m.id === 'gpt-image-1');
        const dalle2 = data.data?.find(m => m.id === 'dall-e-2');

        if (targetModel) {
          console.log(`✅ OK (${IMAGE_MODEL} available)`);
        } else {
          console.log(`⚠️  ${IMAGE_MODEL} tidak ada — model yang available untuk image:`);
          if (gptImage) console.log(`      • gpt-image-1 ✓ (set OPENAI_IMAGE_MODEL=gpt-image-1)`);
          if (dalle3) console.log(`      • dall-e-3 ✓`);
          if (dalle2) console.log(`      • dall-e-2 ✓`);
          if (!gptImage && !dalle3 && !dalle2) {
            console.log(`      ❌ TIDAK ADA model image — kemungkinan saldo $0 atau project key gak punya akses image`);
          }
          allOk = false;
        }
      } else {
        const errText = await res.text();
        console.log(`❌ HTTP ${res.status}`);
        console.log(`   Response: ${errText.substring(0, 200)}`);
        allOk = false;
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
      allOk = false;
    }
  }

  // 3. Test billing — generate 1 dummy image
  if (oai) {
    process.stdout.write(`   → test generate 1 image (${IMAGE_MODEL})... `);
    try {
      const isGpt = IS_GPT_IMAGE;
      const testBody = isGpt ? {
        model: IMAGE_MODEL,
        prompt: 'A simple red apple on white background, flat illustration',
        n: 1,
        size: '1024x1024',
        quality: 'low',
      } : {
        model: IMAGE_MODEL,
        prompt: 'A simple red apple on white background, flat illustration',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      };
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBody),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Berhasil generate`);
        const sample = isGpt ? `[b64 image, ${data.data[0].b64_json?.length || 0} bytes]` : data.data[0].url.substring(0, 80) + '...';
        console.log(`   Sample: ${sample}`);
      } else {
        const errText = await res.text();
        console.log(`❌ HTTP ${res.status}`);
        console.log(`   Response: ${errText.substring(0, 400)}`);
        // Common errors
        if (errText.includes('billing')) console.log(`   💡 Solusi: top-up credit di platform.openai.com/account/billing`);
        if (errText.includes('rate_limit')) console.log(`   💡 Solusi: tunggu 1 menit atau upgrade tier`);
        if (errText.includes('invalid_api_key')) console.log(`   💡 Solusi: API key salah/expired, generate baru di platform.openai.com/api-keys`);
        if (errText.includes('content_policy')) console.log(`   💡 Solusi: prompt ke-filter, tapi prompt apel harusnya safe`);
        if (errText.includes('insufficient_quota')) console.log(`   💡 Solusi: saldo abis, top-up di platform.openai.com/account/billing`);
        allOk = false;
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
      allOk = false;
    }
  }

  // 4. Check Firebase config
  console.log('');
  const fbSa = process.env.FIREBASE_SERVICE_ACCOUNT;
  const fbBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!fbSa) {
    console.log('❌ FIREBASE_SERVICE_ACCOUNT: NOT SET');
    allOk = false;
  } else {
    try {
      const sa = JSON.parse(fbSa);
      console.log(`✅ FIREBASE_SERVICE_ACCOUNT: parse OK (project: ${sa.project_id})`);
      if (!sa.private_key) {
        console.log(`   ⚠️  private_key kosong — JSON malformed?`);
        allOk = false;
      } else if (!sa.private_key.includes('BEGIN PRIVATE KEY')) {
        console.log(`   ⚠️  private_key format aneh — pastiin \\n udah jadi newline asli`);
      }
    } catch (e) {
      console.log(`❌ FIREBASE_SERVICE_ACCOUNT: parse error — ${e.message}`);
      console.log(`   💡 Pastiin JSON valid 1 baris. Coba: echo $FIREBASE_SERVICE_ACCOUNT | jq .`);
      allOk = false;
    }
  }

  if (!fbBucket) {
    console.log('❌ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: NOT SET');
    allOk = false;
  } else {
    console.log(`✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${fbBucket}`);
    if (!fbBucket.match(/\.(appspot\.com|firebasestorage\.app)$/)) {
      console.log(`   ⚠️  Format aneh — biasanya: xxx.firebasestorage.app atau xxx.appspot.com`);
    }
  }

  // 5. Test Firebase Storage upload
  if (fbSa && fbBucket) {
    process.stdout.write('   → test upload ke Firebase Storage... ');
    try {
      const bucket = initFirebase();
      const testFile = bucket.file('tebak-gambar/_doctor-test.txt');
      await testFile.save(Buffer.from('doctor test ' + Date.now()), {
        metadata: { contentType: 'text/plain' },
      });
      await testFile.makePublic();
      console.log(`✅ Upload OK`);
      console.log(`   File: https://storage.googleapis.com/${bucket.name}/tebak-gambar/_doctor-test.txt`);
      // Cleanup
      await testFile.delete().catch(() => {});
    } catch (e) {
      console.log(`❌ ${e.message}`);
      if (e.message.includes('does not exist')) console.log(`   💡 Bucket "${fbBucket}" tidak ada — cek di Firebase Console > Storage`);
      if (e.message.includes('permission')) console.log(`   💡 Service Account butuh role "Storage Admin" — atur di IAM Firebase`);
      if (e.message.includes('uniform bucket-level access')) console.log(`   💡 Bucket pakai uniform access — makePublic() gak work. Solusi: pakai signed URL atau matiin uniform access`);
      allOk = false;
    }
  }

  console.log('\n' + (allOk ? '✅ Semua OK — siap run generator' : '❌ Ada yang fail — fix dulu sebelum lanjut'));
  return allOk;
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
// Model bisa diatur via env: OPENAI_IMAGE_MODEL
// Default: gpt-image-1 (modern, available di semua akun baru OpenAI).
// Kalau akun lama yang masih punya DALL-E 3: set OPENAI_IMAGE_MODEL=dall-e-3
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

// Detect family — gpt-image-* family vs dall-e-* family
const IS_GPT_IMAGE = IMAGE_MODEL.startsWith('gpt-image') || IMAGE_MODEL.startsWith('chatgpt-image');

async function generateImage(prompt) {
  const body = IS_GPT_IMAGE ? {
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: '1024x1024',
    // gpt-image-1 family: quality = "low" | "medium" | "high" | "auto"
    quality: 'medium',  // ~$0.04, sweet spot
  } : {
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  };

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  // gpt-image-1 returns b64_json, dall-e-3 returns url
  if (IS_GPT_IMAGE) {
    return { type: 'b64', data: data.data[0].b64_json };
  }
  return { type: 'url', data: data.data[0].url };
}

// Wrapper: get buffer from either URL or b64
async function getImageBuffer(result) {
  if (result.type === 'b64') {
    return Buffer.from(result.data, 'base64');
  }
  return downloadBuffer(result.data);
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
  // Doctor mode — diagnose env tanpa generate
  if (flags.doctor) {
    const ok = await runDoctor();
    process.exit(ok ? 0 : 1);
  }

  console.log('🎨 Tebak Gambar — AI Image Generator');
  console.log('=====================================\n');

  // Reset error log
  if (fs.existsSync(ERROR_LOG)) fs.unlinkSync(ERROR_LOG);

  const levels = parseDataFile();
  console.log(`📦 Parsed ${levels.length} categories, ${levels.reduce((s, l) => s + l.items.length, 0)} items total`);

  const urlMap = loadUrlMap();
  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const errorSummary = []; // first few errors untuk summary

  for (const level of levels) {
    if (flags.category && level.id !== flags.category) continue;
    console.log(`\n📁 ${level.id} (${level.items.length} items)`);
    urlMap[level.id] = urlMap[level.id] || {};

    for (const item of level.items) {
      if (totalGenerated >= flags.limit) break;

      const existing = urlMap[level.id][item.arabic];
      if (existing && !flags.force) {
        if (flags.verbose) console.log(`   ⏭️  ${item.id} (already exists)`);
        totalSkipped++;
        continue;
      }

      const prompt = buildPrompt(item, level.id);
      const slug = slugify(item.id);
      const storagePath = `tebak-gambar/${level.id}/${slug}.png`;

      if (flags.dryRun) {
        console.log(`   📝 [DRY] ${item.id} → ${storagePath}`);
        if (flags.verbose) console.log(`        prompt: ${prompt}`);
        totalGenerated++;
        continue;
      }

      let stage = 'init';
      try {
        process.stdout.write(`   🎨 ${item.id}... `);
        // 1. Generate via OpenAI
        stage = 'openai-generate';
        if (flags.verbose) process.stdout.write(`[${IMAGE_MODEL}] `);
        const imgResult = await generateImage(prompt);
        // 2. Get buffer (b64 decode atau download URL)
        stage = 'fetch-buffer';
        if (flags.verbose) process.stdout.write('[fetch] ');
        const buffer = await getImageBuffer(imgResult);
        // 3. Upload to Firebase
        stage = 'firebase-upload';
        if (flags.verbose) process.stdout.write('[upload] ');
        const publicUrl = await uploadToStorage(buffer, storagePath);
        // 4. Save to map (incremental — save after EVERY item for crash safety)
        stage = 'save-map';
        urlMap[level.id][item.arabic] = publicUrl;
        saveUrlMap(urlMap);
        console.log(`✅`);
        if (flags.verbose) console.log(`      → ${publicUrl}`);
        totalGenerated++;
        // Polite rate limit (DALL-E 3 = 7 RPM tier 1, 15 RPM tier 2)
        await sleep(flags.sleepMs);
      } catch (err) {
        console.log(`❌ [${stage}]`);
        console.log(`      → ${err.message.substring(0, 200)}`);
        logError(item, stage, err);
        if (errorSummary.length < 3) {
          errorSummary.push({ item: item.id, stage, message: err.message });
        }
        totalErrors++;
        // Kalau 5 error pertama berturut-turut, kemungkinan systemic issue — kasih saran
        if (totalErrors === 5 && totalGenerated === 0) {
          console.log(`\n💡 5 error berturut-turut tanpa sukses → kemungkinan systemic issue.`);
          console.log(`   Coba: node scripts/generate-tebak-images.js --doctor`);
          console.log(`   Atau cek file: tebak-gen-errors.log\n`);
        }
      }
    }
    if (totalGenerated >= flags.limit) break;
  }

  console.log('\n=====================================');
  console.log(`✅ Generated: ${totalGenerated}`);
  console.log(`⏭️  Skipped:   ${totalSkipped}`);
  console.log(`❌ Errors:    ${totalErrors}`);
  if (totalErrors > 0) {
    console.log(`\n📋 Sample errors (first 3):`);
    errorSummary.forEach((e, i) => {
      console.log(`   ${i + 1}. ${e.item} [${e.stage}]: ${e.message.substring(0, 150)}`);
    });
    console.log(`\n   Full log: ${ERROR_LOG}`);
    console.log(`   Diagnose: node scripts/generate-tebak-images.js --doctor`);
  }
  console.log(`\n💾 URL map saved to: data/tebak-gambar-urls.js`);
  console.log(`\n📲 Frontend will auto-load URLs via the JSON map.`);
}

main().catch((err) => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
