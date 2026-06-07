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
  // --items "category:itemId,category:itemId,..." → regenerate specific items only
  items: null,
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
  else if (args[i] === '--items' && args[i + 1]) flags.items = args[++i];
  else if (args[i] === '--sleep' && args[i + 1]) flags.sleepMs = parseInt(args[++i], 10);
}

// Parse --items "category:itemId,category:itemId,..."
// Result: { categoryId: Set([itemIdLower, ...]) }
function parseItemsFilter(str) {
  if (!str) return null;
  const out = {};
  str.split(',').forEach((pair) => {
    const [cat, id] = pair.split(':').map(s => s.trim());
    if (!cat || !id) return;
    out[cat] = out[cat] || new Set();
    out[cat].add(id.toLowerCase());
  });
  return out;
}
const ITEMS_FILTER = parseItemsFilter(flags.items);

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
//
// PENTING: GPT-image-1 model-nya English-native. Kalau prompt pakai kata
// Indonesia yang "look like English" (Air = water dalam Indo tapi "Air" =
// atmosfer dalam English), AI bakal generate gambar yang salah.
// Solusi: translate Indonesia → English explicit untuk kata-kata ambigu.

const ID_TO_EN = {
  // Makanan & Buah
  'Roti': 'bread loaf', 'Kurma': 'date fruit (palm date)', 'Susu': 'glass of milk',
  'Air': 'glass of water (drinking water)', 'Kopi': 'cup of coffee', 'Teh': 'cup of tea',
  'Apel': 'apple', 'Jeruk': 'orange fruit', 'Pisang': 'banana', 'Anggur': 'grapes',
  'Nasi': 'plate of cooked white rice', 'Ayam': 'cooked chicken', 'Daging': 'red meat steak',
  'Telur': 'eggs', 'Keju': 'cheese wedge', 'Madu': 'jar of honey', 'Kue': 'slice of cake',
  'Salad': 'fresh salad bowl', 'Sup': 'bowl of soup', 'Makanan': 'plate of food meal',

  // Tempat & Bangunan — visual distinctive (avoid generic "X building" yg semua mirip)
  'Ka\'bah': 'the Holy Kaaba in Mecca: large black cubic structure draped in black cloth with gold calligraphy band, surrounded by Muslim pilgrims in white ihram',
  'Masjid': 'classic mosque with one large green dome at center and two tall pencil-shaped minarets on either side, crescent moon on top',
  'Hotel': 'tall luxury hotel building 8 floors with rows of balcony windows, grand entrance awning with bellhop, swimming pool and palm trees in front',
  'Pasar': 'busy outdoor traditional bazaar with colorful canopy stalls, baskets of fresh fruits and vegetables, vendors selling produce',
  'Restoran': 'cozy restaurant scene: a round dining table with two plates of steaming food, wine glasses, chef hat icon floating above',
  'Rumah Sakit': 'hospital building with huge prominent red cross plus sign on white facade, ambulance with flashing lights parked at entrance',
  'Bandara': 'airport scene: large white airplane taking off from runway, tall round control tower with windows, terminal building with glass dome',
  'Rumah': 'small cozy single-family home with triangular red sloped roof, chimney puffing smoke, wooden front door with steps, two windows, picket fence, flower garden',
  'Sekolah': 'school building scene: classic school house with bell tower, schoolchildren in uniform with backpacks walking in, blackboard and ABC alphabet block visible',
  'Kota Madinah': 'aerial view of Madinah Saudi Arabia: the iconic Prophet Mosque (Masjid Nabawi) with its distinctive emerald green dome and four tall minarets in the center, city around it',
  'Bank': 'classical bank building scene: marble columns at entrance, large vault door with combination wheel visible inside, stacks of gold coins and a dollar sign symbol floating',
  'Air Mancur': 'decorative ornamental water fountain in a plaza: three-tier stone fountain with water spraying upward and cascading down, surrounded by garden',
  'Taman': 'public garden park scene: green grass lawn, wooden park bench, flower beds with colorful tulips, large shade tree, winding stone pathway',
  'Jalan Raya': 'aerial view of multi-lane city highway road: cars and trucks driving, white lane dividers, traffic light at intersection, road signs',
  'Jembatan': 'iconic arched stone bridge spanning a wide river: cars crossing over it, water flowing underneath, mountains in background',
  'Menara': 'isolated tall slender iconic tower like Eiffel tower silhouette, standing alone against sky background, observation deck visible at top',
  'Istana': 'grand royal palace from Arabian Nights: golden onion domes, ornate Islamic arches and pillars, royal flag on top, marble steps at entrance',
  'Stadion': 'large oval sports stadium aerial view: green soccer/football field in center, rows of curved seating tiers around it, floodlight towers, stadium roof',
  'Kantor Pos': 'post office scene: small building with classic red British-style mailbox in front, mail delivery truck parked, white envelope with stamp icon floating above',
  'Tenda': 'camping tent in nature: classic triangular A-frame tent pitched on grass, small campfire with logs nearby, pine trees and mountain in background',

  // Hewan & Alam
  'Unta': 'camel in desert', 'Domba': 'sheep', 'Kuda': 'horse',
  'Kucing': 'cat', 'Burung': 'small bird', 'Ikan': 'fish',
  'Matahari': 'sun', 'Bulan': 'crescent moon (the moon in sky)', 'Bintang': 'shining star',
  'Padang Pasir': 'sandy desert dunes', 'Anjing': 'dog', 'Singa': 'lion',
  'Gajah': 'elephant', 'Lebah': 'honey bee', 'Kupu-kupu': 'butterfly',
  'Pohon': 'tree', 'Mawar': 'red rose flower', 'Gunung': 'mountain',
  'Laut': 'ocean sea waves', 'Sungai': 'river flowing through landscape',

  // Benda
  'Buku': 'open book', 'Pena': 'writing pen', 'Telepon': 'smartphone',
  'Komputer': 'laptop computer', 'Jam': 'analog clock', 'Kunci': 'metal key',
  'Tas': 'backpack bag', 'Uang': 'paper money cash', 'Kacamata': 'eyeglasses',
  'Cermin': 'hand mirror', 'Kursi': 'wooden chair', 'Tempat Tidur': 'bed with pillow',
  'Lemari': 'wooden wardrobe cabinet', 'Pintu': 'door', 'Jendela': 'window',
  'Lampu': 'light bulb lamp', 'Garpu': 'fork', 'Sendok': 'spoon',
  'Pisau': 'kitchen knife', 'Sabun': 'soap bar',

  // Pakaian & Umrah
  'Hijab': 'muslim woman wearing hijab headscarf', 'Gaun': 'long dress',
  'Mantel': 'winter coat', 'Kemeja': 'button-up shirt', 'Celana': 'pants trousers',
  'Sepatu': 'leather shoes', 'Kaus Kaki': 'pair of socks', 'Topi': 'cap hat',
  'Tasbih': 'islamic prayer beads (tasbih/misbaha)',
  'Sujud': 'muslim man in sujood prostration prayer position',
  'Doa': 'hands raised in prayer dua', 'Mushaf': 'Quran book open',
  'Menara Masjid': 'mosque minaret tower', 'Wudhu': 'hands performing ablution wudu with water',
  'Adzan': 'muezzin calling adhan from minaret', 'Bulan Sabit': 'crescent moon symbol',
  'Hadiah': 'gift box with ribbon', 'Pengantin Pr': 'bride in white modest dress',
  'Pengantin Lk': 'groom in formal attire',

  // Anggota Tubuh
  'Mata': 'human eye (the eye organ)', 'Telinga': 'human ear',
  'Hidung': 'human nose', 'Mulut': 'human mouth lips',
  'Gigi': 'tooth (white teeth)', 'Lidah': 'tongue',
  'Otak': 'human brain anatomy', 'Jantung': 'human heart organ (anatomical)',
  'Hati': 'human liver organ (anatomical)', 'Tangan': 'human hand',
  'Jari': 'human finger pointing', 'Kaki': 'human leg',
  'Telapak Kaki': 'foot sole', 'Tulang': 'white bone',
  'Darah': 'red blood drop', 'Kepala': 'human head',
  'Wajah': 'human face neutral expression', 'Rambut': 'human hair on head',
  'Jenggot': 'man with beard face', 'Telapak Tangan': 'open palm of hand',

  // Transportasi
  'Mobil': 'car', 'Bus': 'public bus', 'Taksi': 'yellow taxi cab',
  'Sepeda': 'bicycle', 'Motor': 'motorcycle', 'Kereta Api': 'train locomotive',
  'Kereta Bawah Tanah': 'subway metro train', 'Pesawat': 'airplane in flight',
  'Helikopter': 'helicopter', 'Kapal': 'large ship boat',
  'Perahu': 'small wooden boat', 'Yacht': 'luxury yacht', 'Truk': 'cargo truck',
  'Mobil Polisi': 'police car with siren', 'Ambulans': 'ambulance with red cross',
  'Mobil Pemadam': 'red fire truck',
  'Skuter': 'electric scooter', 'Kuda (tunggangan)': 'horse with saddle for riding',
  'Unta (tunggangan)': 'camel with saddle for riding',
  'Roket': 'space rocket launching',

  // Cuaca & Waktu
  'Cerah': 'sunny clear sky', 'Hujan': 'rain falling from clouds',
  'Salju': 'snowflakes falling', 'Awan': 'fluffy white clouds in blue sky',
  'Kabut': 'foggy misty landscape', 'Kilat': 'lightning bolt',
  'Angin': 'wind blowing leaves', 'Pelangi': 'colorful rainbow',
  'Suhu/Panas': 'thermometer showing high temperature',
  'Dingin': 'snowflake cold weather icon', 'Panas': 'sun and flame hot weather',
  'Pagi': 'morning sunrise', 'Sore': 'afternoon evening sky orange sunset',
  'Malam': 'night sky with moon and stars', 'Siang': 'noon bright sun overhead',
  'Hari': 'sun representing a day', 'Minggu': 'calendar showing a week',
  'Bulan (waktu)': 'calendar showing a month',
  'Tahun': 'calendar year with party celebration',
  'Waktu': 'hourglass sandglass showing time',

  // Profesi
  'Dokter': 'doctor with stethoscope wearing white coat',
  'Guru': 'teacher with book in classroom', 'Programmer': 'programmer at computer coding',
  'Insinyur': 'engineer with hard hat and blueprints', 'Koki': 'chef with white hat cooking',
  'Petani': 'farmer in field with crops', 'Polisi': 'police officer in uniform',
  'Pemadam Kebakaran': 'firefighter in red gear', 'Pilot': 'airplane pilot in cockpit uniform',
  'Ilmuwan': 'scientist with lab coat and beakers', 'Seniman': 'artist with paintbrush and canvas',
  'Penyanyi': 'singer with microphone', 'Hakim': 'judge with gavel in courtroom',
  'Perawat (Pr)': 'female nurse in scrubs', 'Pedagang': 'merchant with goods',
  'Tukang Cukur': 'barber with scissors', 'Sopir': 'driver behind steering wheel',
  'Imam': 'mosque imam leading prayer', 'Penulis': 'writer with notebook and pen',
  'Tukang Kayu': 'carpenter with hammer and wood',

  // Olahraga
  'Sepak Bola': 'soccer football', 'Bola Basket': 'basketball ball',
  'Bola Voli': 'volleyball ball', 'Tenis': 'tennis racket and ball',
  'Renang': 'person swimming in pool', 'Lari': 'person running',
  'Berjalan': 'person walking', 'Senam': 'gymnast doing exercise',
  'Yoga': 'person in yoga meditation pose', 'Bersepeda': 'person riding bicycle',
  'Tinju': 'boxing gloves', 'Anggar': 'fencing sword sport',
  'Pacuan Kuda': 'horse racing', 'Piala': 'gold trophy cup',
  'Medali': 'gold medal with ribbon', 'Membaca': 'person reading book',
  'Menulis': 'hand writing with pen', 'Menggambar': 'hand drawing with pencil',
  'Musik': 'musical notes and instruments', 'Tidur': 'person sleeping in bed',
};

function buildPrompt(item, category) {
  // Style hint per kategori (untuk context tambahan)
  const categoryHints = {
    makanan: 'food and drink',
    tempat: 'building or place',
    'hewan-alam': 'animal or nature element',
    benda: 'everyday object',
    'pakaian-umrah': 'clothing or islamic item',
    tubuh: 'human body anatomy',
    transportasi: 'vehicle or transportation',
    'cuaca-waktu': 'weather or time concept',
    profesi: 'person in profession (modest clothing, simple face)',
    olahraga: 'sport or activity',
  };

  // Kategori yang butuh SCENE context (rich visual identifier) vs single subject.
  // tempat = bangunan susah dibedain kalau cuma "building", butuh props/scene.
  // profesi = orang lebih jelas dengan tools+context.
  // Lainnya cukup single subject yang clear.
  const SCENE_CATEGORIES = new Set(['tempat', 'profesi', 'olahraga']);
  const useScene = SCENE_CATEGORIES.has(category);

  // English description: prefer explicit translation, fallback ke item.id
  const englishDesc = ID_TO_EN[item.id] || item.id;
  const categoryContext = categoryHints[category] || 'object';

  const composition = useScene
    ? 'Detailed scene composition with iconic visual identifiers and supporting context elements that make the subject IMMEDIATELY and UNAMBIGUOUSLY recognizable at a glance — a child or non-reader should know what this represents in 1 second.'
    : 'Centered composition with single clear subject, no clutter.';

  return `A clean, friendly, flat vector illustration of ${englishDesc} (${categoryContext}). ${composition} Solid white or very light pastel background. Soft warm pastel colors with earthy tones (terracotta, sage green, sandy beige, muted gold). Modern children's storybook illustration style — cute and inviting. NO text, NO captions, NO letters, NO Arabic script anywhere in the image. The subject must be iconic and unmistakable.`;
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

    // Filter level kalau ada --items mapping
    const allowedItemsInLevel = ITEMS_FILTER ? ITEMS_FILTER[level.id] : null;
    if (ITEMS_FILTER && !allowedItemsInLevel) {
      if (flags.verbose) console.log(`   ⏭️  (no items targeted in ${level.id})`);
      continue;
    }

    for (const item of level.items) {
      if (totalGenerated >= flags.limit) break;

      // --items filter: skip kalau item ini bukan target
      if (allowedItemsInLevel && !allowedItemsInLevel.has(item.id.toLowerCase())) {
        continue;
      }
      // Kalau --items match → force regenerate (overwrite)
      const forceThisItem = !!allowedItemsInLevel || flags.force;

      const existing = urlMap[level.id][item.arabic];
      if (existing && !forceThisItem) {
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
