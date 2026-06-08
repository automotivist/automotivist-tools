// lib/data-constants.js
// ─────────────────────────────────────────────────────────────
// ALL data-driven constants in one place.
// Update this file each quarter. One commit = site-wide data refresh.
//
// Sources:
//   Payment averages  → Experian State of the Automotive Finance Market
//   Loan rate         → Bankrate national averages / Experian
//   Insurance         → Bankrate / NAIC annual average
//   Fuel              → EIA U.S. gasoline weekly retail price (or update manually)
//   Maintenance       → AAA Your Driving Costs
//   Miles/year        → Federal Highway Administration
// ─────────────────────────────────────────────────────────────

// ── Data version ─────────────────────────────────────────────
// Update this string whenever any constant below changes.
// This is what the "DATA UPDATED" banner displays.
export const DATA_VERSION = 'Q1 2026';
export const DATA_UPDATED = 'May 2026';

// ── National averages ─────────────────────────────────────────
// Source: Experian State of the Automotive Finance Market Q4 2025
export const AVG_MONTHLY_PAYMENT    = 738;   // new + used blended average
export const AVG_NEW_PAYMENT        = 764;   // new vehicles only
export const AVG_USED_PAYMENT       = 516;   // used vehicles only

// ── Loan rates ────────────────────────────────────────────────
// Source: Experian Q4 2025 / Bankrate national averages Q1 2026
export const AVG_RATE_NEW_60MO      = 7.9;   // new vehicle, 60-month, good credit
export const AVG_RATE_USED_60MO     = 11.7;  // used vehicle, 60-month, all credit
export const AVG_RATE_REFI_60MO     = 6.2;   // refinance, 60-month, good credit (661-780)
export const BENCHMARK_RATE         = 7.5;   // rate used in calculator estimates

// ── Insurance ─────────────────────────────────────────────────
// Source: Bankrate national average full-coverage auto insurance 2025
// Tiered by vehicle value (proxied by payment tier)
export const INSURANCE_BY_PAYMENT = [
  { maxPayment: 300,  monthly: 110 },
  { maxPayment: 500,  monthly: 148 },
  { maxPayment: 700,  monthly: 178 },
  { maxPayment: 900,  monthly: 215 },
  { maxPayment: 1100, monthly: 252 },
  { maxPayment: Infinity, monthly: 290 },
];
export const AVG_INSURANCE_MONTHLY = 167;    // national average all vehicles

// ── Fuel ──────────────────────────────────────────────────────
// Source: EIA U.S. Regular Gasoline Prices (weekly)
// Update FUEL_PRICE_PER_GALLON each quarter from:
// https://www.eia.gov/petroleum/gasprices/
export const FUEL_PRICE_PER_GALLON  = 3.18;  // $/gal — EIA national avg May 2026
export const AVG_MILES_PER_YEAR     = 15000; // FHWA average annual miles
export const AVG_MPG                = 28.8;  // EPA fleet average 2025

// Derived — do not edit manually
export const FUEL_MONTHLY = Math.round(
  (AVG_MILES_PER_YEAR / AVG_MPG * FUEL_PRICE_PER_GALLON) / 12
);

// ── Maintenance ───────────────────────────────────────────────
// Source: AAA Your Driving Costs 2025
export const MAINTENANCE_CENTS_PER_MILE = 9.0;  // cents/mile, average all vehicles
export const MAINTENANCE_MONTHLY = Math.round(
  (AVG_MILES_PER_YEAR * MAINTENANCE_CENTS_PER_MILE / 100) / 12
);

// ── True cost ─────────────────────────────────────────────────
// Derived national average true monthly cost
export const AVG_TRUE_MONTHLY_COST = Math.round(
  AVG_MONTHLY_PAYMENT + AVG_INSURANCE_MONTHLY + FUEL_MONTHLY + MAINTENANCE_MONTHLY
);

// ── S&P 500 ───────────────────────────────────────────────────
export const SP500_ANNUAL_RETURN = 0.105;    // 50-year historical average

// ── Quarter-by-quarter update log ────────────────────────────
// Add a row each time you update. Helps track data drift over time.
export const UPDATE_LOG = [
  { quarter: 'Q1 2026', date: 'May 2026',  payment: 738, rate_new: 7.9, fuel: 3.18, insurance: 167 },
  // { quarter: 'Q2 2026', date: 'Aug 2026',  payment: ?,   rate_new: ?,   fuel: ?,    insurance: ? },
];

// Build verified: June 2026 — all 549 pages passing
