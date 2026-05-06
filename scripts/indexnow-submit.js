// scripts/indexnow-submit.js
// One-time script: submits all page URLs to IndexNow (Bing instant indexing)
// Run from project root: node scripts/indexnow-submit.js

const HOST = 'https://tools.automotivist.com';
const KEY  = 'automotivist-tools-indexnow-2026';

// ── URL generation (mirrors calculations.js logic) ──────────────
const PAYMENTS = [];
for (let p = 200; p <= 1500; p += 50) PAYMENTS.push(p);

const SALARIES = [];
for (let s = 40000; s <= 200000; s += 10000) SALARIES.push(s);

const AFFORD_SALARIES = [40000,45000,50000,55000,60000,65000,70000,75000,
  80000,90000,100000,110000,120000,135000,150000,175000,200000];

const REFI_COMBOS = [
  {o:9,n:6},{o:9,n:7},{o:9,n:8},
  {o:10,n:6},{o:10,n:7},{o:10,n:8},{o:10,n:9},
  {o:11,n:6},{o:11,n:7},{o:11,n:8},{o:11,n:9},
  {o:8,n:5},{o:8,n:6},{o:8,n:7},
  {o:7,n:5},{o:7,n:6},
  {o:12,n:7},{o:12,n:8},
];

const VEHICLES = [
  '2025-ford-f-150','2025-chevrolet-silverado-1500','2025-ram-1500',
  '2025-toyota-tacoma','2025-gmc-sierra-1500','2025-toyota-rav4',
  '2025-honda-cr-v','2025-ford-explorer','2025-jeep-grand-cherokee',
  '2025-chevrolet-equinox','2025-hyundai-tucson','2025-nissan-rogue',
  '2025-ford-bronco','2025-jeep-wrangler','2025-kia-sportage',
  '2025-toyota-camry','2025-honda-accord','2025-honda-civic',
  '2025-toyota-corolla','2025-nissan-sentra','2025-tesla-model-y',
  '2025-tesla-model-3','2025-ford-mustang-mach-e','2025-chevrolet-equinox-ev',
  '2025-rivian-r1t','2025-bmw-3-series','2025-mercedes-c-class',
  '2025-audi-a4','2025-lexus-rx','2025-genesis-gv80','2025-ford-mustang',
  '2025-chevrolet-camaro','2025-subaru-wrx','2025-toyota-gr86',
  '2025-mazda-mx-5-miata','2025-porsche-911','2025-porsche-cayenne',
];

const urls = [
  `${HOST}/`,
  `${HOST}/calculator`,
  `${HOST}/guides/car-payment-guide`,
  `${HOST}/guides/true-cost-of-ownership`,
  `${HOST}/guides/car-loan-refinancing`,
  ...AFFORD_SALARIES.map(s => `${HOST}/afford/${s}-salary`),
  ...REFI_COMBOS.map(c => `${HOST}/refinance/${c.o}-percent-to-${c.n}-percent`),
  ...VEHICLES.map(s => `${HOST}/cars/${s}`),
  ...PAYMENTS.flatMap(p => SALARIES.map(s => `${HOST}/car-payment/${p}-per-month-${s}-salary`)),
];

// ── Submit in batches of 500 ─────────────────────────────────────
async function submitBatch(batch, num, total) {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST.replace('https://', ''),
      key: KEY,
      keyLocation: `${HOST}/${KEY}.txt`,
      urlList: batch,
    }),
  });
  const ok = res.status === 200 || res.status === 202;
  console.log(`  Batch ${num}/${total}: ${batch.length} URLs → HTTP ${res.status} ${ok ? '✓' : '✗'}`);
}

async function run() {
  const SIZE = 500;
  const batches = [];
  for (let i = 0; i < urls.length; i += SIZE) batches.push(urls.slice(i, i + SIZE));
  console.log(`\nSubmitting ${urls.length} URLs to IndexNow in ${batches.length} batches...\n`);
  for (let i = 0; i < batches.length; i++) {
    await submitBatch(batches[i], i + 1, batches.length);
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nDone. ${urls.length} URLs submitted to Bing via IndexNow.\n`);
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
