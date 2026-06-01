#!/usr/bin/env node
// scripts/update-data.mjs — Quarterly data refresh for The Automotivist
// Usage: node scripts/update-data.mjs
//
// Sources to check before running:
//   Experian:  https://www.experian.com/automotive/automotive-credit-report.html
//   Bankrate:  https://www.bankrate.com/loans/auto-loans/current-auto-loan-interest-rates/
//   AAA:       https://newsroom.aaa.com/auto/your-driving-costs/
//   EIA:       https://www.eia.gov/petroleum/gasprices/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, '../lib/data-constants.js');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

function get(content, name) {
  const m = content.match(new RegExp(`export const ${name}\\s*=\\s*([^;]+);`));
  return m ? m[1].trim().replace(/'/g, '') : '?';
}

function set(content, name, val, note) {
  return content.replace(
    new RegExp(`(export const ${name}\\s*=\\s*)[^;]+;[^\\n]*`),
    `$1${typeof val === 'string' && isNaN(val) ? `'${val}'` : val};  // ${note}`
  );
}

async function main() {
  console.log('\n══════════════════════════════════════════');
  console.log('  THE AUTOMOTIVIST — QUARTERLY DATA REFRESH');
  console.log('══════════════════════════════════════════\n');
  console.log('Press Enter to keep current value.\n');

  let c = fs.readFileSync(FILE, 'utf8');

  const quarter = await ask(`Quarter label  [${get(c,'DATA_VERSION')}]: `);
  const date    = await ask(`Display date   [${get(c,'DATA_UPDATED')}]: `);
  const payment = await ask(`Avg payment    [$${get(c,'AVG_MONTHLY_PAYMENT')}]: `);
  const rateNew = await ask(`New 60mo rate  [${get(c,'AVG_RATE_NEW_60MO')}%]: `);
  const rateUsed= await ask(`Used 60mo rate [${get(c,'AVG_RATE_USED_60MO')}%]: `);
  const rateRefi= await ask(`Refi 60mo rate [${get(c,'AVG_RATE_REFI_60MO')}%]: `);
  const fuel    = await ask(`Fuel $/gal     [$${get(c,'FUEL_PRICE_PER_GALLON')}]: `);
  const ins     = await ask(`Avg insurance  [$${get(c,'AVG_INSURANCE_MONTHLY')}]: `);
  const maint   = await ask(`Maint ¢/mile   [${get(c,'MAINTENANCE_CENTS_PER_MILE')}¢]: `);

  const q = quarter || get(c,'DATA_VERSION');
  const d = date    || get(c,'DATA_UPDATED');

  if (quarter) c = set(c, 'DATA_VERSION', quarter.trim(), `updated ${new Date().toISOString().split('T')[0]}`);
  if (date)    c = set(c, 'DATA_UPDATED', date.trim(),    `updated ${new Date().toISOString().split('T')[0]}`);
  if (payment) c = set(c, 'AVG_MONTHLY_PAYMENT',    +payment.replace(/[$,]/g,''), `Experian ${q}`);
  if (rateNew) c = set(c, 'AVG_RATE_NEW_60MO',      +rateNew.replace('%',''),     `Bankrate ${q}`);
  if (rateUsed)c = set(c, 'AVG_RATE_USED_60MO',     +rateUsed.replace('%',''),    `Experian ${q}`);
  if (rateRefi)c = set(c, 'AVG_RATE_REFI_60MO',     +rateRefi.replace('%',''),    `Bankrate ${q}`);
  if (fuel)    c = set(c, 'FUEL_PRICE_PER_GALLON',   +fuel.replace(/[$]/g,''),    `EIA ${d}`);
  if (ins)     c = set(c, 'AVG_INSURANCE_MONTHLY',   +ins.replace(/[$]/g,''),     `Bankrate ${q}`);
  if (maint)   c = set(c, 'MAINTENANCE_CENTS_PER_MILE', +maint.replace('¢',''),  `AAA ${q}`);

  fs.writeFileSync(FILE, c);

  console.log('\n✓ lib/data-constants.js updated');
  console.log('\nNext:\n  git add lib/data-constants.js');
  console.log(`  git commit -m "Data refresh: ${q}"`);
  console.log('  git push');
  console.log('\nVercel rebuilds all pages. ISR refreshes live pages over 30 days.\n');
  rl.close();
}

main().catch(e => { console.error(e); rl.close(); process.exit(1); });
