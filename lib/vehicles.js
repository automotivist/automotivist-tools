// lib/vehicles.js — Tier 3 vehicle true-cost pages
export const VEHICLES = [
  { slug:'ford-f150', year:2025, make:'Ford', model:'F-150', price:52000, mpg:21, category:'Truck', insurance:220 },
  { slug:'chevrolet-silverado-1500', year:2025, make:'Chevrolet', model:'Silverado 1500', price:50000, mpg:20, category:'Truck', insurance:215 },
  { slug:'toyota-rav4', year:2025, make:'Toyota', model:'RAV4', price:34000, mpg:32, category:'SUV', insurance:165 },
  { slug:'honda-cr-v', year:2025, make:'Honda', model:'CR-V', price:33000, mpg:33, category:'SUV', insurance:160 },
  { slug:'tesla-model-y', year:2025, make:'Tesla', model:'Model Y', price:47000, mpg:null, category:'EV SUV', insurance:210, mpge:115 },
  { slug:'toyota-camry', year:2025, make:'Toyota', model:'Camry', price:30000, mpg:34, category:'Sedan', insurance:155 },
  { slug:'honda-civic', year:2025, make:'Honda', model:'Civic', price:26000, mpg:38, category:'Sedan', insurance:145 },
  { slug:'nissan-rogue', year:2025, make:'Nissan', model:'Rogue', price:32000, mpg:30, category:'SUV', insurance:160 },
  { slug:'jeep-grand-cherokee', year:2025, make:'Jeep', model:'Grand Cherokee', price:44000, mpg:24, category:'SUV', insurance:195 },
  { slug:'toyota-tacoma', year:2025, make:'Toyota', model:'Tacoma', price:37000, mpg:23, category:'Truck', insurance:175 },
  { slug:'ford-explorer', year:2025, make:'Ford', model:'Explorer', price:40000, mpg:24, category:'SUV', insurance:185 },
  { slug:'chevrolet-equinox', year:2025, make:'Chevrolet', model:'Equinox', price:30000, mpg:29, category:'SUV', insurance:158 },
  { slug:'hyundai-tucson', year:2025, make:'Hyundai', model:'Tucson', price:30000, mpg:29, category:'SUV', insurance:155 },
  { slug:'kia-telluride', year:2025, make:'Kia', model:'Telluride', price:38000, mpg:24, category:'SUV', insurance:175 },
  { slug:'ford-maverick', year:2025, make:'Ford', model:'Maverick', price:27000, mpg:37, category:'Truck', insurance:148 },
  { slug:'honda-pilot', year:2025, make:'Honda', model:'Pilot', price:42000, mpg:23, category:'SUV', insurance:185 },
  { slug:'toyota-highlander', year:2025, make:'Toyota', model:'Highlander', price:42000, mpg:24, category:'SUV', insurance:185 },
  { slug:'ram-1500', year:2025, make:'Ram', model:'1500', price:48000, mpg:20, category:'Truck', insurance:210 },
  { slug:'subaru-outback', year:2025, make:'Subaru', model:'Outback', price:32000, mpg:30, category:'SUV', insurance:160 },
  { slug:'mazda-cx-5', year:2025, make:'Mazda', model:'CX-5', price:31000, mpg:29, category:'SUV', insurance:158 },
  { slug:'volkswagen-tiguan', year:2025, make:'Volkswagen', model:'Tiguan', price:31000, mpg:25, category:'SUV', insurance:158 },
  { slug:'toyota-corolla', year:2025, make:'Toyota', model:'Corolla', price:24000, mpg:38, category:'Sedan', insurance:140 },
  { slug:'hyundai-elantra', year:2025, make:'Hyundai', model:'Elantra', price:23000, mpg:37, category:'Sedan', insurance:138 },
  { slug:'chevrolet-colorado', year:2025, make:'Chevrolet', model:'Colorado', price:32000, mpg:22, category:'Truck', insurance:162 },
  { slug:'ford-bronco', year:2025, make:'Ford', model:'Bronco', price:42000, mpg:20, category:'SUV', insurance:188 },
  { slug:'gmc-sierra-1500', year:2025, make:'GMC', model:'Sierra 1500', price:48000, mpg:19, category:'Truck', insurance:210 },
  { slug:'honda-accord', year:2025, make:'Honda', model:'Accord', price:31000, mpg:33, category:'Sedan', insurance:158 },
  { slug:'subaru-forester', year:2025, make:'Subaru', model:'Forester', price:30000, mpg:30, category:'SUV', insurance:155 },
  { slug:'bmw-3-series', year:2025, make:'BMW', model:'3 Series', price:46000, mpg:28, category:'Sedan', insurance:225 },
  { slug:'audi-q5', year:2025, make:'Audi', model:'Q5', price:48000, mpg:25, category:'SUV', insurance:230 },
];

export function getVehicle(slug) {
  return VEHICLES.find(v => v.slug === slug) || null;
}

export function vehicleMonthlyPayment(price, apr=7.5, months=60, downPct=0.10) {
  const principal = price * (1 - downPct);
  if(apr === 0) return Math.round(principal / months);
  const r = apr / 100 / 12;
  return Math.round(principal * r / (1 - Math.pow(1+r, -months)));
}

export function vehicleTrueMonthlyCost(v, apr=7.5, months=60) {
  const payment = vehicleMonthlyPayment(v.price, apr, months);
  const fuel = v.mpge
    ? Math.round((15000/12) * 0.035)
    : Math.round((15000 / v.mpg) * 3.50 / 12);
  const maintenance = v.mpge
    ? Math.round((v.price * 0.06) / 12)
    : Math.round((v.price * 0.09) / 12);
  const total = payment + v.insurance + fuel + maintenance;
  return { payment, insurance: v.insurance, fuel, maintenance, total };
}

function incomeNeeded(monthlyCost) {
  return Math.round(monthlyCost / 0.15 * 12 / 1000) * 1000;
}

export function vehicleFAQs(v) {
  const costs = vehicleTrueMonthlyCost(v);
  const incomeFor15 = incomeNeeded(costs.payment + v.insurance);
  const sp10 = Math.round(costs.payment * ((Math.pow(1.00875, 120) - 1) / 0.00875));
  return [
    {
      question: `What is the monthly payment on a ${v.year} ${v.make} ${v.model}?`,
      answer: `At a $${Math.round(v.price*0.9).toLocaleString()} financed amount (10% down on $${v.price.toLocaleString()} MSRP), a 60-month loan at 7.5% APR puts the monthly payment at $${costs.payment.toLocaleString()}. Rates vary -- get pre-approved before visiting the dealership.`
    },
    {
      question: `What is the true monthly cost of owning a ${v.year} ${v.make} ${v.model}?`,
      answer: `The payment is $${costs.payment.toLocaleString()}/month but the all-in monthly cost is higher. Add insurance ($${v.insurance}/mo estimated), fuel ($${costs.fuel}/mo), and maintenance ($${costs.maintenance}/mo) and you are at $${costs.total.toLocaleString()}/month.`
    },
    {
      question: `What salary do I need to afford a ${v.year} ${v.make} ${v.model}?`,
      answer: `With a $${costs.payment.toLocaleString()}/month payment and $${v.insurance}/month insurance, the 15% rule requires an income of roughly $${incomeFor15.toLocaleString()}/year. Use the calculator above with your exact income to see where you land.`
    },
    {
      question: `How much should I put down on a ${v.make} ${v.model}?`,
      answer: `The standard recommendation is 20% down on a new vehicle -- $${Math.round(v.price*0.2).toLocaleString()} in this case. At minimum, put enough down to avoid being underwater immediately. The average new car loses 10-15% of value in year one.`
    },
    {
      question: `What is the opportunity cost of buying a ${v.make} ${v.model}?`,
      answer: `A $${costs.payment.toLocaleString()}/month payment invested in the S&P 500 instead for 10 years would be worth approximately $${sp10.toLocaleString()} at historical average returns. That is not a reason not to buy the car. It is a reason to make the decision with the math in front of you.`
    },
  ];
}

export function getAllVehiclePaths() {
  return VEHICLES.map(v => ({ params: { slug: v.slug } }));
}
