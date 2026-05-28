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

// Vehicle-specific editorial observations — requires model knowledge, not formula
// This is what differentiates vehicle pages from AI-generated cost summaries
export function vehicleEditorial(slug) {
  const editorials = {
    '2025-ford-f-150': 'The F-150 has been the best-selling vehicle in America for 47 consecutive years. That popularity has a cost: insurance rates are 15-20% higher than the segment average because of repair costs and theft rates. The EcoBoost twin-turbo engines are powerful but expensive when they need service — a timing chain job runs $2,000-3,500 at an independent shop. The F-150 is a genuinely useful truck for people who use it as a truck. For commuters who want the image, the ownership cost is a luxury tax with truck-shaped packaging.',
    '2025-chevrolet-silverado-1500': 'The Silverado competes directly with the F-150 on price and capability but has historically lagged on resale value — Silverados depreciate roughly 5-8% faster over 5 years than comparable F-150 trims. The 6.2L V8 option adds capability but also insurance costs and fuel expenses that most buyers do not account for at the point of purchase. GM\'s 10-speed transmission has had documented reliability issues in early production years.',
    '2025-ram-1500': 'The Ram 1500 has won J.D. Power initial quality surveys and offers the most comfortable ride in the full-size truck segment — the coil-spring rear suspension is a genuine differentiator. It also carries some of the highest insurance rates in the full-size segment due to repair costs. Ram buyers tend to be more brand-loyal than any other truck segment, which means resale is competitive but not exceptional.',
    '2025-toyota-tacoma': 'The Tacoma has the best resale value of any truck on the market — 5-year residual values consistently exceed 55% of MSRP, which is 15-20 points above the full-size average. That means the effective depreciation cost per month is lower than the sticker price implies. The tradeoff: the Tacoma charges a premium for that reputation and the ride quality reflects its body-on-frame truck roots more than the smooth-highway comfort of some competitors.',
    '2025-toyota-rav4': 'The RAV4 is the top-selling SUV in America and holds that position partly through reputation and partly through genuinely low maintenance costs — Toyota\'s reliability record in this segment is consistent across model years. Insurance rates are below the segment average. The hybrid version adds $3,000-4,000 to the purchase price but typically recovers that through fuel savings within 3-4 years for average drivers.',
    '2025-honda-cr-v': 'The CR-V sits at the intersection of practical and efficient in a segment full of style-over-substance choices. Honda\'s powertrain reliability is among the best in class, and the CR-V\'s lower insurance rates relative to competitors reflect that. The turbocharged 1.5L engine has had documented oil dilution issues in colder climates — a known limitation worth understanding before purchase in northern states.',
    '2025-tesla-model-y': 'The Model Y has the lowest maintenance costs of any vehicle on the list — no oil changes, fewer brake jobs due to regenerative braking, and a simpler powertrain. Insurance runs high because repair costs are high: Tesla uses proprietary parts and the repair network is limited outside major metro areas. A Tesla on home solar with overnight charging changes the fuel cost math dramatically — the effective fuel cost per mile drops below any combustion vehicle at current electricity rates.',
    '2025-tesla-model-3': 'The Model 3 is the entry point into the Tesla ecosystem and carries the same insurance premium for the same reason — repair costs and parts exclusivity. At current used prices, the Model 3 represents one of the better total-cost-of-ownership propositions in the sub-$45K segment for buyers who charge at home. For apartment dwellers who rely on public charging, the math is less favorable.',
    '2025-porsche-911': 'The 911 is the benchmark sports car precisely because it does not compromise. It also does not compromise on operating costs. Scheduled maintenance at a Porsche dealer runs $1,500-3,500 per service interval. Insurance on a $120,000+ vehicle with 450+ horsepower is $3,500-5,000 per year for most drivers. Tires on the GT-spec variants cost $400-600 each and last 10,000-15,000 miles. The 911 is a car for people who have genuinely solved their other financial problems. Owning one while paying off a mortgage or carrying other debt is a different calculation.',
    '2025-porsche-cayenne': 'The Cayenne is what happens when Porsche engineering meets SUV practicality and premium depreciation curves. Cayennes lose 45-55% of their value over 5 years — faster than the 911 and faster than any other vehicle on this list. The maintenance costs reflect Porsche dealer pricing applied to an SUV platform with more systems to service. The case for a Cayenne is almost never financial. It is the right car when you have the income to absorb the true monthly cost without it changing your other decisions.',
    '2025-bmw-3-series': 'The 3 Series is the benchmark sports sedan and also the entry point to BMW\'s maintenance costs. Out of warranty, BMW repairs average 30-40% more than comparable Japanese sedans. The reliability record has improved in recent years but the repair cost ceiling has not. A 3 Series out of warranty with 60,000+ miles is a different financial proposition than a new one.',
    '2025-jeep-wrangler': 'The Wrangler has the best resale value of any non-truck vehicle — 5-year residuals above 60% of MSRP in most configurations. That partially explains why it costs more than the competition. The ownership experience involves higher than average maintenance costs, below-average fuel economy, and a ride quality that prioritizes off-road capability over highway comfort. For people who actually use it off-road, the tradeoffs make sense.',
    '2025-ford-mustang': 'The Mustang carries significantly higher insurance rates than the average sports car — theft rates are consistently above average and the V8 variants attract actuarial attention. Fuel costs reflect the V8 appetite regardless of how modestly you drive. The 2.3L EcoBoost is the financially sensible Mustang but it is not the one most buyers choose.',
  };
  return editorials[slug] || null;
}
