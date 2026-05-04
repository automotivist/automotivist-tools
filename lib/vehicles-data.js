// lib/vehicles-data.js
// Top 50 vehicles by US sales volume + enthusiast targets
// Data: MSRP, insurance estimate, avg maintenance, avg fuel (15K mi/yr, current prices)
// Sources: KBB/Cox, AAA, Edmunds TCO estimates

export const VEHICLES = [
  // Trucks
  { slug:'2025-ford-f-150',        year:2025, make:'Ford',       model:'F-150',           type:'truck',    msrp:36000,  ins:185, maint:140, fuel:210 },
  { slug:'2025-chevrolet-silverado-1500', year:2025, make:'Chevrolet', model:'Silverado 1500', type:'truck', msrp:38000, ins:180, maint:135, fuel:215 },
  { slug:'2025-ram-1500',          year:2025, make:'Ram',        model:'1500',            type:'truck',    msrp:37000,  ins:182, maint:138, fuel:215 },
  { slug:'2025-toyota-tacoma',     year:2025, make:'Toyota',     model:'Tacoma',          type:'truck',    msrp:32000,  ins:168, maint:110, fuel:195 },
  { slug:'2025-gmc-sierra-1500',   year:2025, make:'GMC',        model:'Sierra 1500',     type:'truck',    msrp:39000,  ins:185, maint:140, fuel:215 },

  // SUVs
  { slug:'2025-toyota-rav4',       year:2025, make:'Toyota',     model:'RAV4',            type:'suv',      msrp:29000,  ins:158, maint:105, fuel:170 },
  { slug:'2025-honda-cr-v',        year:2025, make:'Honda',      model:'CR-V',            type:'suv',      msrp:30000,  ins:155, maint:108, fuel:168 },
  { slug:'2025-ford-explorer',     year:2025, make:'Ford',       model:'Explorer',        type:'suv',      msrp:37000,  ins:172, maint:130, fuel:190 },
  { slug:'2025-jeep-grand-cherokee', year:2025, make:'Jeep',    model:'Grand Cherokee',  type:'suv',      msrp:38000,  ins:175, maint:145, fuel:200 },
  { slug:'2025-chevrolet-equinox', year:2025, make:'Chevrolet',  model:'Equinox',         type:'suv',      msrp:28000,  ins:152, maint:115, fuel:172 },
  { slug:'2025-hyundai-tucson',    year:2025, make:'Hyundai',    model:'Tucson',          type:'suv',      msrp:28000,  ins:148, maint:100, fuel:165 },
  { slug:'2025-nissan-rogue',      year:2025, make:'Nissan',     model:'Rogue',           type:'suv',      msrp:29000,  ins:152, maint:112, fuel:168 },
  { slug:'2025-ford-bronco',       year:2025, make:'Ford',       model:'Bronco',          type:'suv',      msrp:35000,  ins:175, maint:132, fuel:198 },
  { slug:'2025-jeep-wrangler',     year:2025, make:'Jeep',       model:'Wrangler',        type:'suv',      msrp:34000,  ins:172, maint:148, fuel:205 },
  { slug:'2025-kia-sportage',      year:2025, make:'Kia',        model:'Sportage',        type:'suv',      msrp:27000,  ins:145, maint:98,  fuel:162 },

  // Crossovers/Cars
  { slug:'2025-toyota-camry',      year:2025, make:'Toyota',     model:'Camry',           type:'sedan',    msrp:27000,  ins:145, maint:95,  fuel:155 },
  { slug:'2025-honda-accord',      year:2025, make:'Honda',      model:'Accord',          type:'sedan',    msrp:28000,  ins:148, maint:98,  fuel:155 },
  { slug:'2025-honda-civic',       year:2025, make:'Honda',      model:'Civic',           type:'sedan',    msrp:23000,  ins:138, maint:90,  fuel:148 },
  { slug:'2025-toyota-corolla',    year:2025, make:'Toyota',     model:'Corolla',         type:'sedan',    msrp:22000,  ins:135, maint:88,  fuel:145 },
  { slug:'2025-nissan-sentra',     year:2025, make:'Nissan',     model:'Sentra',          type:'sedan',    msrp:20000,  ins:130, maint:92,  fuel:148 },

  // EVs
  { slug:'2025-tesla-model-y',     year:2025, make:'Tesla',      model:'Model Y',         type:'ev',       msrp:43000,  ins:220, maint:65,  fuel:55  },
  { slug:'2025-tesla-model-3',     year:2025, make:'Tesla',      model:'Model 3',         type:'ev',       msrp:38000,  ins:210, maint:62,  fuel:52  },
  { slug:'2025-ford-mustang-mach-e', year:2025, make:'Ford',     model:'Mustang Mach-E',  type:'ev',       msrp:42000,  ins:195, maint:68,  fuel:55  },
  { slug:'2025-chevrolet-equinox-ev', year:2025, make:'Chevrolet', model:'Equinox EV',   type:'ev',       msrp:35000,  ins:182, maint:65,  fuel:52  },
  { slug:'2025-rivian-r1t',        year:2025, make:'Rivian',     model:'R1T',             type:'ev',       msrp:67000,  ins:265, maint:80,  fuel:65  },

  // Luxury
  { slug:'2025-bmw-3-series',      year:2025, make:'BMW',        model:'3 Series',        type:'luxury',   msrp:45000,  ins:230, maint:195, fuel:165 },
  { slug:'2025-mercedes-c-class',  year:2025, make:'Mercedes',   model:'C-Class',         type:'luxury',   msrp:46000,  ins:235, maint:205, fuel:168 },
  { slug:'2025-audi-a4',           year:2025, make:'Audi',       model:'A4',              type:'luxury',   msrp:44000,  ins:228, maint:198, fuel:165 },
  { slug:'2025-lexus-rx',          year:2025, make:'Lexus',      model:'RX',              type:'luxury',   msrp:48000,  ins:222, maint:148, fuel:188 },
  { slug:'2025-genesis-gv80',      year:2025, make:'Genesis',    model:'GV80',            type:'luxury',   msrp:52000,  ins:245, maint:162, fuel:192 },

  // Sports/Enthusiast
  { slug:'2025-ford-mustang',      year:2025, make:'Ford',       model:'Mustang',         type:'sports',   msrp:31000,  ins:198, maint:130, fuel:205 },
  { slug:'2025-chevrolet-camaro',  year:2025, make:'Chevrolet',  model:'Camaro',          type:'sports',   msrp:30000,  ins:195, maint:128, fuel:210 },
  { slug:'2025-subaru-wrx',        year:2025, make:'Subaru',     model:'WRX',             type:'sports',   msrp:30000,  ins:188, maint:122, fuel:195 },
  { slug:'2025-toyota-gr86',       year:2025, make:'Toyota',     model:'GR86',            type:'sports',   msrp:28000,  ins:182, maint:112, fuel:185 },
  { slug:'2025-mazda-mx-5-miata',  year:2025, make:'Mazda',      model:'MX-5 Miata',      type:'sports',   msrp:28000,  ins:172, maint:108, fuel:178 },
  { slug:'2025-porsche-911',       year:2025, make:'Porsche',    model:'911',             type:'sports',   msrp:120000, ins:380, maint:420, fuel:215 },
  { slug:'2025-porsche-cayenne',   year:2025, make:'Porsche',    model:'Cayenne',         type:'luxury',   msrp:82000,  ins:315, maint:385, fuel:210 },
];

export function getVehicle(slug) {
  return VEHICLES.find(v => v.slug === slug) || null;
}

export function vehicleTrueCost(v) {
  // Depreciation: ~15% year 1, ~10% year 2+
  const depreciationY1 = Math.round(v.msrp * 0.15 / 12);
  const fuelMonthly = v.fuel;
  const maintMonthly = v.maint;
  const insMonthly = v.ins;
  // Estimate payment: 20% down, 60mo, 7.5% APR
  const loanAmount = v.msrp * 0.80;
  const r = 0.075 / 12;
  const payment = Math.round(loanAmount * r / (1 - Math.pow(1+r, -60)));
  const trueMo = payment + insMonthly + maintMonthly + fuelMonthly + depreciationY1;
  const trueYear = trueMo * 12;
  const true5yr = trueMo * 60;
  const totalInterest = payment * 60 - loanAmount;
  return { payment, insMonthly, maintMonthly, fuelMonthly, depreciationY1, trueMo, trueYear, true5yr, totalInterest: Math.round(totalInterest), loanAmount: Math.round(loanAmount) };
}

export function vehicleFAQs(v) {
  const c = vehicleTrueCost(v);
  const fmtS = n => '$' + Math.round(n).toLocaleString();
  return [
    { question:`How much does a ${v.year} ${v.make} ${v.model} really cost per month?`, answer:`The payment on a ${v.year} ${v.make} ${v.model} (20% down, 60-month loan, 7.5% APR) is around ${fmtS(c.payment)}/month. Add insurance (~${fmtS(c.insMonthly)}/mo), maintenance (~${fmtS(c.maintMonthly)}/mo), fuel (~${fmtS(c.fuelMonthly)}/mo), and depreciation (~${fmtS(c.depreciationY1)}/mo) and the true all-in monthly cost is approximately ${fmtS(c.trueMo)}.` },
    { question:`What is the total cost of owning a ${v.year} ${v.make} ${v.model} over 5 years?`, answer:`Over 5 years, a ${v.make} ${v.model} costs approximately ${fmtS(c.true5yr)} all-in. That includes ${fmtS(c.payment * 60)} in payments, plus insurance, fuel, maintenance, and depreciation.` },
    { question:`Is the ${v.year} ${v.make} ${v.model} a good financial decision?`, answer:`At ${fmtS(v.msrp)} MSRP, the 15% rule puts the income needed to stay financially safe at roughly ${fmtS(Math.round(c.payment / 0.10))} annually. The true monthly cost of ${fmtS(c.trueMo)} is often 30-40% higher than the payment alone — which is what the dealership quotes.` },
    { question:`What salary do I need to afford a ${v.make} ${v.model}?`, answer:`With a ${fmtS(c.payment)} payment at the 15% ceiling, you need a monthly take-home of at least ${fmtS(c.payment / 0.15)}. That corresponds to a gross salary of approximately ${fmtS(Math.round(c.payment / 0.15 * 12 / 0.72))}.` },
    { question:`How much does ${v.make} ${v.model} insurance cost per month?`, answer:`${v.make} ${v.model} insurance typically runs ${fmtS(c.insMonthly - 25)}-${fmtS(c.insMonthly + 40)}/month depending on your state, driving history, and coverage level. Full coverage on a financed vehicle is required by most lenders.` },
  ];
}
