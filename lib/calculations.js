// lib/calculations.js
import {
  FUEL_MONTHLY,
  MAINTENANCE_MONTHLY,
  INSURANCE_BY_PAYMENT,
  AVG_MONTHLY_PAYMENT,
  AVG_TRUE_MONTHLY_COST,
  BENCHMARK_RATE,
  DATA_VERSION,
  DATA_UPDATED,
  SP500_ANNUAL_RETURN,
  AVG_RATE_REFI_60MO,
  AVG_RATE_NEW_60MO,
} from './data-constants.js';

export const BEEHIIV_PUB_ID = 'pub_b0b30438-1b65-4641-9b8f-904280c400a8';

// ── Core math ──
export function monthlyTakeHome(s) { let r; if(s<40000)r=0.82;else if(s<60000)r=0.78;else if(s<80000)r=0.75;else if(s<100000)r=0.72;else if(s<150000)r=0.70;else r=0.67;return Math.round((s*r)/12); }
export function threshold15(s) { return Math.round(monthlyTakeHome(s)*0.15); }
export function threshold10(s) { return Math.round(monthlyTakeHome(s)*0.10); }
export function paymentPercent(p,s) { return parseFloat((p/monthlyTakeHome(s)*100).toFixed(1)); }
export function estimateInsurance(p) {
  const tier = INSURANCE_BY_PAYMENT.find(t => p <= t.maxPayment);
  return tier ? tier.monthly : 290;
}
export function estimateFuel()        { return FUEL_MONTHLY; }
export function estimateMaintenance() { return MAINTENANCE_MONTHLY; }
export function trueMonthlyCost(p)    { return p + estimateInsurance(p) + estimateFuel() + estimateMaintenance(); }
export { DATA_VERSION, DATA_UPDATED, AVG_MONTHLY_PAYMENT, AVG_TRUE_MONTHLY_COST, AVG_RATE_REFI_60MO, AVG_RATE_NEW_60MO };
export function totalLoanCost(p,t) { return p*t; }
export function estimatePrincipal(pmt,apr,mo) { if(apr===0)return pmt*mo;const r=apr/100/12;return pmt*(1-Math.pow(1+r,-mo))/r; }
export function totalInterest(pmt,apr,fmo) { return Math.max(0,pmt*fmo-estimatePrincipal(pmt,apr,fmo)); }
export function futureValue(c,r,y) { const m=r/12,n=y*12;if(m===0)return c*n;return Math.round(c*((Math.pow(1+m,n)-1)/m)); }
export function sp500_5yr(p) { return futureValue(p,.105,5); }
export function sp500_10yr(p) { return futureValue(p,.105,10); }
export function monthlyOverspend(p,s) { return Math.max(0,p-threshold15(s)); }
export function getVerdict(p,s) { const v=paymentPercent(p,s);if(v<13)return'within-range';if(v<16)return'borderline';return'too-high'; }
export function verdictLabel(v) { if(v==='within-range')return'WITHIN RANGE';if(v==='borderline')return'BORDERLINE';return'TOO HIGH'; }
export function verdictClass(v) { if(v==='within-range')return'verdict-ok';if(v==='borderline')return'verdict-border';return'verdict-high'; }
export function fmtDollar(n) { return '$'+Math.round(n).toLocaleString(); }
export function fmtK(n) { return n>=1000?'$'+(n/1000).toFixed(0)+'K':fmtDollar(n); }

// ── Car-payment page helpers ──
export function directAnswerText(payment,salary) { const pct=paymentPercent(payment,salary);const thresh=threshold15(salary);const verdict=getVerdict(payment,salary);if(verdict==='too-high'){return`A $${payment.toLocaleString()} monthly car payment on a $${salary.toLocaleString()} salary represents <strong>${pct}% of your take-home pay</strong> -- well above the 15% rule ceiling of $${thresh.toLocaleString()}/month. You are overspending by $${(payment-thresh).toLocaleString()} per month.`;}if(verdict==='borderline'){return`A $${payment.toLocaleString()} monthly car payment on a $${salary.toLocaleString()} salary represents <strong>${pct}% of your take-home pay</strong> -- right at the edge of the 15% rule ($${thresh.toLocaleString()}/month).`;}return`A $${payment.toLocaleString()} monthly car payment on a $${salary.toLocaleString()} salary represents <strong>${pct}% of your take-home pay</strong> -- inside the 15% rule ceiling of $${thresh.toLocaleString()}/month. The bigger cost question is what it replaces.`; }
export function generateFAQs(payment, salary) {
  const pct   = paymentPercent(payment, salary);
  const thresh = threshold15(salary);
  const sp5   = sp500_5yr(payment);
  const sp10  = sp500_10yr(payment);
  const trueM = trueMonthlyCost(payment);
  const verdict = getVerdict(payment, salary);
  const over  = Math.max(0, payment - thresh);
  const ins   = estimateInsurance(payment);
  const fuel  = estimateFuel();
  const maint = estimateMaintenance();
  const salaryK = Math.round(salary / 1000);

  const tooHighAnswer = verdict === 'too-high'
    ? `Yes. On a $${salary.toLocaleString()} salary, the 15% rule caps your payment at $${thresh.toLocaleString()}/month. A $${payment.toLocaleString()} payment is $${over.toLocaleString()} over that ceiling every month. Over 5 years, that overage reduces your investable wealth by approximately $${Math.round(over * 60 / 1000)}K.`
    : `At $${salary.toLocaleString()}, a $${payment.toLocaleString()} payment is ${pct}% of take-home — inside the 15% rule. The ceiling is $${thresh.toLocaleString()}/month. You have $${(thresh - payment).toLocaleString()}/month of room.`;

  return [
    {
      question: `Is a $${payment.toLocaleString()} car payment too high on a $${salary.toLocaleString()} salary?`,
      answer: tooHighAnswer,
    },
    {
      question: `Can I afford a $${payment.toLocaleString()} car payment making $${salaryK}K a year?`,
      answer: verdict === 'too-high'
        ? `Technically yes — you can make the payment. Financially, it puts you at ${pct}% of take-home, which is ${(pct - 15).toFixed(1)} points above the 15% rule ceiling. The difference is whether you can afford the payment or can afford the car.`
        : `Yes. At ${pct}% of take-home on a $${salary.toLocaleString()} salary, this is inside the 15% rule. The true all-in cost (adding insurance, fuel, and maintenance) is $${trueM.toLocaleString()}/month — confirm that fits your full budget.`,
    },
    {
      question: `What is the maximum car payment for a $${salary.toLocaleString()} salary?`,
      answer: `The 15% rule puts the ceiling at $${thresh.toLocaleString()}/month total — that is payment plus insurance combined. If insurance runs $${ins.toLocaleString()}/month, the payment ceiling is approximately $${Math.max(0, thresh - ins).toLocaleString()}/month. (Source: 15% rule, Experian national averages.)`,
    },
    {
      question: `What does a $${payment.toLocaleString()} car payment actually cost per month all-in?`,
      answer: `The payment is $${payment.toLocaleString()}. Add insurance ($${ins.toLocaleString()}), fuel ($${fuel.toLocaleString()}), and maintenance ($${maint.toLocaleString()}) and the true all-in monthly cost is $${trueM.toLocaleString()} — $${(trueM - payment).toLocaleString()} more than the payment alone. Source: AAA Your Driving Costs 2025, Bankrate national averages.`,
    },
    {
      question: `What would $${payment.toLocaleString()}/month invested instead be worth?`,
      answer: `At the S&P 500's 50-year historical average of 10.5% annual return, $${payment.toLocaleString()}/month for 5 years grows to $${sp5.toLocaleString()}. Over 10 years: $${sp10.toLocaleString()}. This is the opportunity cost of the car payment — the wealth it cannot build while locked in a loan. Illustrative. Not financial advice.`,
    },
    {
      question: `How do I lower my car payment on a $${salary.toLocaleString()} salary?`,
      answer: `Three options: (1) Refinance if your credit score has improved or rates have dropped — a 2-point rate reduction on $25K saves $24/month. (2) Sell and downsize to a vehicle whose payment clears the 15% ceiling. (3) Pay down the principal with a lump sum to reduce remaining payments. Refinancing is the fastest option for most people.`,
    },
  ];
}
export function relatedPages(payment,salary) { const pages=[];if(payment+50<=1500)pages.push({payment:payment+50,salary});if(payment-50>=200)pages.push({payment:payment-50,salary});if(salary+10000<=200000)pages.push({payment,salary:salary+10000});if(salary-10000>=40000)pages.push({payment,salary:salary-10000});return pages.slice(0,4).map(p=>({slug:`${p.payment}-per-month-${p.salary}-salary`,verdict:getVerdict(p.payment,p.salary),pct:paymentPercent(p.payment,p.salary),...p})); }
export function parseSlug(slug) {const m=slug.match(/^(\d+)-per-month-(\d+)-salary$/);if(!m)return null;return{payment:parseInt(m[1]),salary:parseInt(m[2])}; }

// TIER 1: $50 increments = 475 pages (was 238)
export function getAllPagePaths() {
  const payments=[];for(let p=200;p<=1500;p+=50)payments.push(p);
  const salaries=[];for(let s=40000;s<=200000;s+=10000)salaries.push(s);
  const paths=[];for(const payment of payments)for(const salary of salaries)paths.push({params:{slug:`${payment}-per-month-${salary}-salary`}});
  return paths;
}

// ── TIER 2A: Afford pages ──
// "How much car can I afford on a $X salary?"
export const AFFORD_SALARIES = [40000,45000,50000,55000,60000,65000,70000,75000,80000,90000,100000,110000,120000,135000,150000,175000,200000];

export function affordData(salary) {
  const takeHome = monthlyTakeHome(salary);
  const max15 = threshold15(salary);
  const max10 = threshold10(salary);
  // Insurance average ~$175. Payment ceiling = total ceiling minus insurance
  const paymentCeiling15 = Math.max(0, max15 - 175);
  const paymentCeiling10 = Math.max(0, max10 - 175);
  // Estimated vehicle price from payment (60mo, 7.5% APR)
  const vehicleAt15 = Math.round(estimatePrincipal(paymentCeiling15, 7.5, 60) / 1000) * 1000;
  const vehicleAt10 = Math.round(estimatePrincipal(paymentCeiling10, 7.5, 60) / 1000) * 1000;
  const sp10_15 = sp500_10yr(paymentCeiling15);
  const sp10_10 = sp500_10yr(paymentCeiling10);
  return { salary, takeHome, max15, max10, paymentCeiling15, paymentCeiling10, vehicleAt15, vehicleAt10, sp10_15, sp10_10 };
}

export function affordFAQs(salary) {
  const d = affordData(salary);
  return [
    { question:`How much car can I afford on a $${salary.toLocaleString()} salary?`, answer:`On a $${salary.toLocaleString()} salary, your monthly take-home is approximately $${d.takeHome.toLocaleString()}. The 15% rule caps your total car costs at $${d.max15.toLocaleString()}/month. After insurance ($175 estimated), your car payment ceiling is around $${d.paymentCeiling15.toLocaleString()}/month -- which finances a vehicle priced at approximately $${d.vehicleAt15.toLocaleString()}.` },
    { question:`What is the maximum car payment on a $${salary.toLocaleString()} salary?`, answer:`The 15% rule maximum is $${d.max15.toLocaleString()}/month total car costs, or roughly $${d.paymentCeiling15.toLocaleString()} in payment after insurance. The conservative 10% ceiling puts your payment at $${d.paymentCeiling10.toLocaleString()}/month.` },
    { question:`What car can I afford on a $${salary.toLocaleString()} income?`, answer:`At the 15% ceiling, a $${d.paymentCeiling15.toLocaleString()}/month payment on a 60-month loan at 7.5% APR finances a vehicle priced around $${d.vehicleAt15.toLocaleString()}. At the conservative 10% ceiling, that drops to $${d.vehicleAt10.toLocaleString()}.` },
    { question:`Should I buy new or used on a $${salary.toLocaleString()} salary?`, answer:`At $${salary.toLocaleString()}, a used vehicle under $${d.vehicleAt10.toLocaleString()} keeps you well inside the safe zone. New vehicles typically add $3,000-$5,000 to the price and depreciate 20% in year one. The financial case for CPO or used is strong at this income level.` },
    { question:`What happens if I spend more than 15% of income on a car?`, answer:`Above 15%, every dollar going to your car is a dollar not building wealth. $${d.paymentCeiling15.toLocaleString()}/month invested in the S&P 500 for 10 years = $${d.sp10_15.toLocaleString()} at historical average returns. That is the real cost of the car -- not the payment.` },
  ];
}

export function getAllAffordPaths() {
  return AFFORD_SALARIES.map(s => ({ params: { slug: `${s}-salary` } }));
}

export function parseAffordSlug(slug) {
  const m = slug.match(/^(\d+)-salary$/);
  if(!m) return null;
  return { salary: parseInt(m[1]) };
}

// ── TIER 2B: Refinance pages ──
// "Refinance car loan from X% to Y%"
export const REFI_COMBOS = [
  {oldRate:9,newRate:5},{oldRate:9,newRate:6},{oldRate:9,newRate:7},
  {oldRate:10,newRate:5},{oldRate:10,newRate:6},{oldRate:10,newRate:7},
  {oldRate:11,newRate:5},{oldRate:11,newRate:6},{oldRate:11,newRate:7},
  {oldRate:12,newRate:5},{oldRate:12,newRate:6},{oldRate:12,newRate:7},
  {oldRate:8,newRate:5},{oldRate:8,newRate:6},{oldRate:7,newRate:4},
  {oldRate:13,newRate:6},{oldRate:14,newRate:7},{oldRate:15,newRate:7},
];

export function refiSavings(balance, oldRate, newRate, months) {
  function pmt(r, n, pv) { if(r===0)return pv/n; const m=r/12; return pv*m/(1-Math.pow(1+m,-n)); }
  const oldPmt = pmt(oldRate/100, months, balance);
  const newPmt = pmt(newRate/100, months, balance);
  const monthlySaving = oldPmt - newPmt;
  const totalSaving = monthlySaving * months;
  return { oldPmt: Math.round(oldPmt), newPmt: Math.round(newPmt), monthlySaving: Math.round(monthlySaving), totalSaving: Math.round(totalSaving) };
}

export function refiData(oldRate, newRate) {
  const BALANCES = [10000, 15000, 20000, 25000, 30000, 35000, 40000];
  const TERMS = [48, 60, 72];
  const rows = BALANCES.map(b => {
    const r60 = refiSavings(b, oldRate, newRate, 60);
    return { balance: b, ...r60 };
  });
  const breakeven = Math.round(1500 / rows[3].monthlySaving); // rough: $1500 refi cost on $25K balance
  return { oldRate, newRate, rows, breakeven };
}

export function refiFAQs(oldRate, newRate) {
  const d = refiData(oldRate, newRate);
  const sample = d.rows[3]; // $25K sample
  return [
    { question:`How much can I save refinancing my car loan from ${oldRate}% to ${newRate}%?`, answer:`On a $25,000 balance with 60 months remaining, dropping from ${oldRate}% to ${newRate}% saves approximately $${sample.monthlySaving.toLocaleString()}/month and $${sample.totalSaving.toLocaleString()} total over the life of the loan.` },
    { question:`Is it worth refinancing a car loan from ${oldRate}% to ${newRate}%?`, answer:`A ${oldRate - newRate}% rate reduction is worth refinancing in most cases. On a $25,000 balance, you save $${sample.totalSaving.toLocaleString()} over 60 months. Typical refinancing costs are $0-$300 in fees, which you recover in ${d.breakeven} months.` },
    { question:`What credit score do I need to refinance at ${newRate}%?`, answer:`A ${newRate}% APR generally requires a credit score of ${newRate<=5?'750+':newRate<=6?'720+':'680+'}. If your score has improved since your original loan, you likely qualify for a significantly lower rate.` },
    { question:`When should I refinance my car loan?`, answer:`Refinance when your credit score has improved 40+ points since purchase, when market rates have dropped by 1.5%+, or when you are within the first 3 years of a 5-6 year loan. Refinancing in the final year rarely saves enough to justify the paperwork.` },
    { question:`How long does car loan refinancing take?`, answer:`Most online lenders approve refinancing in 24-48 hours. The full process -- application, approval, payoff, new loan -- takes about one week. Your payment does not change until the new loan is active.` },
  ];
}

export function getAllRefiPaths() {
  return REFI_COMBOS.map(c => ({ params: { slug: `${c.oldRate}-percent-to-${c.newRate}-percent` } }));
}

export function parseRefiSlug(slug) {
  const m = slug.match(/^(\d+)-percent-to-(\d+)-percent$/);
  if(!m) return null;
  return { oldRate: parseInt(m[1]), newRate: parseInt(m[2]) };
}

// ── Intent differentiation engine ──
// Returns distinct H1, intro, FAQ questions, and user angle per payment/salary combo
// This is what prevents Google from treating all pages as near-duplicates
export function intentProfile(payment, salary) {
  const pct = paymentPercent(payment, salary);
  const thresh = threshold15(salary);
  const takeHome = monthlyTakeHome(salary);
  const overspend = Math.max(0, payment - thresh);
  const fmt = n => '$' + Math.round(n).toLocaleString();

  // INTENT 1: Already underwater - person who bought and is questioning the decision
  if (pct >= 22) {
    return {
      angle: 'underwater',
      h1: `A ${fmt(payment)} payment on ${fmt(salary)} - you are ${fmt(overspend)}/month over the ceiling`,
      intro: `On a ${fmt(salary)} salary, the 15% rule caps your car payment at ${fmt(thresh)}/month. You are ${fmt(overspend)} above that - every month. This page breaks down exactly what that gap costs you over the life of the loan and what it would be worth if it went somewhere else instead.`,
      situationLabel: 'Already over budget',
      targetUser: 'buyers who already committed and want to understand the damage',
      intentFAQs: [
        { question: `I already have a ${fmt(payment)} car payment on a ${fmt(salary)} salary. What should I do?`, answer: `First, understand the full cost. At ${pct}% of take-home, you are ${fmt(overspend)} over the 15% ceiling every month. Options: refinance if your APR is above current market rates, sell and downsize to a vehicle with a payment under ${fmt(thresh)}, or aggressively pay down the balance to reduce the term. There is no "wait it out" strategy that doesn't cost you.` },
        { question: `How do I get out of an unaffordable car payment on a ${fmt(salary)} salary?`, answer: `Three exits: refinance to lower your monthly payment if rates have dropped since you bought, trade down to a vehicle whose payment fits inside ${fmt(thresh)}/month, or sell privately for more than dealer trade-in and use the equity toward a paid-off car. The paid-off path is the only one that eliminates the payment category entirely.` },
        { question: `Is ${pct}% of take-home on a car payment too high?`, answer: `Yes. The 15% rule - the most widely cited standard in personal finance - caps total car costs at 15% of monthly take-home. At ${pct}%, you are ${Math.round(pct - 15)} percentage points above the ceiling. That gap compounds over the loan term into ${fmt(overspend * 12)}/year that cannot go toward investments, savings, or debt payoff.` },
      ],
    };
  }

  // INTENT 2: Stretched but not drowning - person feeling the squeeze
  if (pct >= 16) {
    return {
      angle: 'stretched',
      h1: `${fmt(payment)}/month on ${fmt(salary)} - above the 15% ceiling by ${fmt(overspend)}/month`,
      intro: `The 15% rule puts your car payment ceiling at ${fmt(thresh)}/month on a ${fmt(salary)} income. At ${fmt(payment)}, you are ${fmt(overspend)} above it. That doesn't mean financial disaster - but it does mean the car is winning a budget fight it shouldn't be in. Here is exactly what that costs and what your options are.`,
      situationLabel: 'Above the 15% ceiling',
      targetUser: 'buyers stretched thin who want to know if they should act',
      intentFAQs: [
        { question: `Is a ${fmt(payment)} car payment okay on a ${fmt(salary)} salary?`, answer: `It is above the 15% rule ceiling of ${fmt(thresh)}/month for your income. Whether it is "okay" depends on your full financial picture - other debt, savings rate, emergency fund. But mechanically, ${pct}% of take-home going to a car leaves less room for every other financial goal.` },
        { question: `What happens if I keep a ${fmt(payment)} car payment on a ${fmt(salary)} salary?`, answer: `The payment doesn't get cheaper over time, but your cost-of-living does increase. What feels manageable today becomes tighter as rent, insurance, and other costs rise. The bigger cost is what ${fmt(payment)}/month doesn't do - invested at the S&P 500's historical average, it compounds significantly over 10 years.` },
        { question: `Should I refinance my car to get under the 15% rule on a ${fmt(salary)} salary?`, answer: `If your APR is above 6% and your credit score has improved since purchase, refinancing is worth exploring. A 2-point rate drop on a $25,000 balance saves roughly $40-60/month and thousands over the loan. The goal is getting your payment to ${fmt(thresh)} or below. Use the calculator above to model the new payment at a lower rate.` },
      ],
    };
  }

  // INTENT 3: Borderline - person doing research before buying
  if (pct >= 12) {
    return {
      angle: 'borderline',
      h1: `${fmt(payment)}/month on ${fmt(salary)} - borderline. Here is what tips it either way`,
      intro: `On a ${fmt(salary)} salary, ${fmt(payment)}/month sits at ${pct}% of take-home - inside the 15% ceiling but close to the edge. Whether this is a good decision depends on what you do not see in the payment number: insurance, fuel, maintenance, and the wealth this payment displaces over 10 years. This page breaks all of it down.`,
      situationLabel: 'Borderline - research stage',
      targetUser: 'buyers in the decision window comparing options',
      intentFAQs: [
        { question: `Is ${fmt(payment)}/month a reasonable car payment on a ${fmt(salary)} salary?`, answer: `At ${pct}% of take-home, it is inside the 15% rule but not by a wide margin. The 15% ceiling includes insurance, so if your insurance runs ${fmt(estimateInsurance(payment))}/month, you are at ${parseFloat(((payment + estimateInsurance(payment)) / takeHome * 100).toFixed(1))}% combined - which is right at the ceiling.` },
        { question: `What is the difference between a ${fmt(payment)} and ${fmt(payment - 50)} car payment on a ${fmt(salary)} salary?`, answer: `${fmt(50)}/month is ${fmt(600)}/year and ${fmt(3000)} over a 60-month loan. Invested in the S&P 500 over 10 years, $50/month grows to roughly ${fmt(futureValue(50, .105, 10))}. The payment difference feels small at the dealership. The wealth difference is not.` },
        { question: `How much should I put down on a car with a ${fmt(salary)} salary to hit the 15% rule?`, answer: `To get your payment under ${fmt(thresh)}/month at 7.5% APR over 60 months, your loan principal should be under ${fmt(Math.round(thresh * (1 - Math.pow(1.00625, -60)) / 0.00625))}. A larger down payment directly reduces that principal and your payment - every $1,000 down saves roughly $20/month.` },
      ],
    };
  }

  // INTENT 4: Healthy - person optimizing or validating a good decision
  return {
    angle: 'healthy',
    h1: `${fmt(payment)}/month on ${fmt(salary)} - inside the 15% rule. Here is the full cost picture`,
    intro: `At ${pct}% of take-home, a ${fmt(payment)} payment fits inside the 15% ceiling for a ${fmt(salary)} income. The payment check passes. But there are two numbers the payment doesn't show: the true all-in monthly cost including insurance, fuel, and maintenance - and the 10-year wealth impact of what this money does not compound into. Both are below.`,
    situationLabel: 'Within budget range',
    targetUser: 'buyers validating a decision or optimizing further',
    intentFAQs: [
      { question: `Is ${fmt(payment)}/month a good car payment on a ${fmt(salary)} salary?`, answer: `By the 15% rule, yes - it is ${pct}% of take-home, well inside the ceiling. The more useful question is whether the total cost of ownership fits your full financial picture. Add insurance, fuel, and maintenance and the true monthly cost is closer to ${fmt(trueMonthlyCost(payment))}. That number is what should be in your budget.` },
      { question: `How much car can I actually afford on a ${fmt(salary)} salary?`, answer: `The 15% rule gives you a ceiling of ${fmt(thresh)}/month for the payment alone (assuming ~${fmt(estimateInsurance(payment))} insurance). At ${fmt(payment)}, you have ${fmt(thresh - payment)} of room under the ceiling. The conservative 10% rule would put your ceiling at ${fmt(threshold10(salary))}/month - a useful benchmark if you have other financial goals you are working toward.` },
      { question: `What should I do with the gap between my ${fmt(payment)} payment and my income ceiling?`, answer: `The gap between your ${fmt(payment)} payment and the ${fmt(thresh)} ceiling is ${fmt(thresh - payment)}/month. That ${fmt(thresh - payment)} invested in an index fund compounds to ${fmt(futureValue(Math.max(0, thresh - payment), .105, 10))} over 10 years. The ceiling is not a target. It is a ceiling.` },
    ],
  };
}

// ── Refinance editorial context ──
// Unique observations per rate combination - requires domain knowledge, not formula
// This is what differentiates pages from AI-generated number swaps
export function refiContext(oldRate, newRate) {
  const key = `${oldRate}-${newRate}`;
  const diff = oldRate - newRate;
  const contexts = {
    // High rate drops - biggest savings, most compelling refi case
    '12-7': {
      who: 'Buyers who financed at 12% were typically working with subprime credit or buying through a captive lender at a dealership that marked up the rate. A 5-point drop is the single most valuable refinance available - it changes the character of the loan, not just the payment.',
      when: 'This refi makes sense the moment your credit score clears 680 and you have 18+ months of on-time payments showing. Most people who qualify for 12% at purchase qualify for 7% or better within 12-18 months if they have handled the loan correctly.',
      context: 'The average subprime auto rate in Q4 2024 was 11.7% (Experian). If you are at 12%, you financed when rates were high and credit was a factor. Both conditions can improve.',
    },
    '12-8': {
      who: 'A rate drop from 12% to 8% is realistic for buyers whose credit score has improved by 40-60 points since purchase. That is the typical improvement range after 12-18 months of consistent on-time payments on a new installment loan.',
      when: 'The math on a 4-point drop over 48+ remaining months is significant. At a $20,000 balance you are saving roughly $700-800 per year - money that was going to the lender that can now go anywhere else.',
      context: 'Lenders who originated at 12% include dealer financing arms that routinely mark up rates beyond the buy rate. A credit union or online lender will almost always beat that on a refi.',
    },
    '11-7': {
      who: '11% was the median rate for buyers with near-prime credit (620-659 range) purchasing used vehicles in 2023 and 2024. If your score has since moved into the 680-720 range - which it often does after 12 months of on-time installment payments - 7% is attainable.',
      when: 'Four points at 48+ months remaining is meaningful. The question is not whether the savings are real. They are. The question is whether your credit score movement justifies the application. Pull your score before you apply.',
      context: 'Used vehicle rates run approximately 2-3 points higher than new vehicle rates at the same credit tier. If you bought used at 11%, the new vehicle equivalent rate was around 8-9% - meaning your rate at purchase may have been fair for the vehicle type.',
    },
    '11-8': {
      who: 'A 3-point drop is the middle-case scenario for borrowers who bought used at a dealer rate and now qualify for direct-lender pricing. Most banks and credit unions price used vehicle loans at 7-9% for 700+ credit scores regardless of the vehicle age.',
      when: 'The breakeven on refinancing fees is typically 4-6 months at a 3-point rate drop. After that, every month is pure savings.',
      context: 'Bankrate Q1 2026 average for a 60-month used vehicle loan at good credit: 7.1%. If you are at 11% and your credit is solid, the spread between your rate and market rate is entirely lender margin.',
    },
    '10-7': {
      who: '10% was common for used vehicle purchases and new vehicles with near-prime credit during the 2022-2023 rate environment. Many buyers accepted it because monthly payments felt manageable. The rate was not.',
      when: '3 points on a $25,000 balance saves roughly $40-50/month and $2,400-3,000 total. That is a vacation, a month of groceries, or an emergency fund contribution for every year of the remaining loan.',
      context: 'The Fed funds rate peaked at 5.25-5.5% in July 2023. Auto loan rates followed. Anyone who financed during that window locked in historically elevated rates that are worth revisiting now.',
    },
    '10-6': {
      who: 'A 4-point drop from 10% is the refi scenario that changes the total cost of the loan most dramatically. At $25K and 60 months, you are eliminating roughly $3,500-4,000 in total interest - money that was built into the loan the day you signed.',
      when: 'This is the right move for any borrower whose credit has moved from near-prime to prime (680 to 720+) since purchase. The rate improvement mirrors the credit tier jump almost exactly.',
      context: 'Most buyers at 10% financed through dealerships that had discretion on rate markup. The average dealer markup over buy rate was 1.5-2% in 2023 (CFPB data). Direct lenders do not mark up rates.',
    },
    '10-8': {
      who: '2-point improvements are the most common outcome of refinancing when credit has improved moderately. For buyers who financed at 10% with a credit score in the 640-680 range, a move to the 680-700 range typically unlocks 8% or better.',
      when: 'The breakeven on 2-point refinancing is usually 8-12 months. Still worth it if you have more than a year remaining on the loan.',
      context: 'The national average for a new vehicle 60-month loan dropped from 9.7% in Q4 2023 to 7.9% in Q1 2026 (Bankrate). The rate environment has improved. Your rate from 2022-2024 may not reflect current market conditions.',
    },
    '9-6': {
      who: '9% was the going rate for good-credit buyers of new vehicles at the peak of the 2023 rate environment. It was not a bad rate for the time. It is a high rate for the current market.',
      when: 'A 3-point drop from a new vehicle loan at 9% is worth doing if you have 24+ months remaining. The savings are not dramatic on a per-month basis but total several thousand dollars over the remaining term.',
      context: '9% felt normal in 2023 because the Fed funds rate was 5%+. With rates normalizing, the 9% borrower now sits 2-3 points above what new applicants are paying for the same credit profile.',
    },
    '9-7': {
      who: '2-point drops from 9% are the most straightforward refinance case - credit was decent at purchase, the rate was market-rate for the time, and the market has since moved. No dramatic credit improvement required.',
      when: 'Check if your lender charges a prepayment penalty before applying. Most do not, but manufacturer captive lenders sometimes do for loans originated in the first 12 months.',
      context: 'Experian Q4 2025: average new vehicle APR for prime credit (661-780) was 6.8%. If you are at 9% with a 700+ score, you are paying 2+ points above what the market currently prices your credit profile.',
    },
    '9-8': {
      who: 'A 1-point drop is worth it for larger balances and longer remaining terms. On a $30K+ balance with 48+ months remaining, $25-35/month savings is $1,200-1,700 back in your pocket over the remaining loan.',
      when: 'If you have a balance below $15,000 with fewer than 36 months remaining, the math gets thin. The total savings may not justify the time spent on the application.',
      context: 'The 1-point refinance is often overlooked because the monthly savings feel small. The error is mental accounting - $30/month is $360/year is $1,440 over 4 years. That is not small.',
    },
    '8-5': {
      who: '8% was below-market for most of 2022-2023 and above-market now. Buyers who locked in at 8% had good credit at a difficult time. A 3-point improvement to 5% requires either excellent credit (750+) or a significant credit score improvement since purchase.',
      when: '5% is the best rate available to most borrowers outside of manufacturer promotional rates. If you can access it, take it.',
      context: 'The last time 5% was widely available as a standard rate for new vehicles was pre-2022, before the Fed rate cycle. It is returning to availability for top-tier credit profiles.',
    },
    '8-6': {
      who: '8% to 6% is the refinance for borrowers who were already in decent shape at purchase but have since seasoned their credit. 24 months of on-time payments on any installment loan moves scores meaningfully.',
      when: 'The 2-point improvement at 8% is cleanest when you are 18-30 months into a 60-month loan. You have eliminated some principal, demonstrated payment reliability, and still have enough remaining term for the savings to compound.',
      context: 'Current Bankrate average for 60-month auto refinance loan with 661-780 credit score: 6.2%. You should be able to beat your 8% rate.',
    },
    '8-7': {
      who: 'A 1-point drop from 8% is the marginal case. On balances above $25K with 36+ months remaining, the total savings justify the hour it takes to apply. Below that threshold, the math gets thin.',
      when: 'Credit unions are the first stop for a 1-point improvement. They routinely offer 0.5-1 point below bank rates on auto refinancing with no application fee.',
      context: 'The average credit union auto loan rate has historically been 0.5-1% below comparable bank rates. If you have not checked your credit union specifically, you are leaving the easiest rate improvement on the table.',
    },
    '7-5': {
      who: '7% is a good rate. 5% is an exceptional rate. The gap between them requires top-tier credit (750+), a new-ish vehicle (2022 or newer), and a lender relationship or promotional offering.',
      when: 'This refinance makes financial sense but is the hardest to execute. Manufacturers occasionally offer 3.9-4.9% promotional rates on certified pre-owned vehicles - a different path to the same outcome.',
      context: 'The prime auto loan rate tracks roughly 2-3 points above the Fed funds rate. With the Fed rate normalizing below 4%, 5% on a car loan is near the floor of where rates go.',
    },
    '7-6': {
      who: '1-point improvements from 7% are worth it for balances above $20K with 36+ months remaining. The people this makes sense for are buyers who were at the edge of the 7% tier and have since solidified their credit profile.',
      when: 'Check the terms carefully. Some lenders reset the loan term on refinancing, which extends the total repayment period even while lowering the rate. Request a refi that matches your remaining term, not a new 60-month term.',
      context: 'Refinancing to a longer term while lowering the rate is a common trap. A $20K balance refinanced from 7% to 6% with the term extended from 36 remaining months to 60 new months saves on the payment but increases total interest paid.',
    },
    '9-6': {
      who: 'A 3-point drop is the middle-case scenario for borrowers who bought used at a dealer rate and now qualify for direct-lender pricing. Most banks and credit unions price used vehicle loans at 7-9% for 700+ credit scores regardless of the vehicle age.',
      when: 'The breakeven on refinancing fees is typically 4-6 months at a 3-point rate drop. After that, every month is pure savings.',
      context: 'Bankrate Q1 2026 average for a 60-month used vehicle loan at good credit: 7.1%. If you are at 9% and your credit is solid, the spread between your rate and market rate is entirely lender margin.',
    },
    '9-5': {
      who: '9% to 5% is a 4-point drop available primarily to buyers whose credit score has moved from near-prime into prime-to-excellent territory (700+). This is the combination where a credit union membership pays for itself in the first month.',
      when: 'If your score is above 720 and you have a balance above $18,000 with 36+ months remaining, this is among the highest-ROI financial moves available to you right now. The application takes less time than the monthly payment you are overpaying.',
      context: 'The spread between 9% and 5% on a $25,000 balance over 60 months is $50-55/month and roughly $3,000-3,300 total. That is a meaningful return on a 30-minute refinance application.',
    },
    '10-5': {
      who: 'A 5-point drop from 10% to 5% requires top-tier credit (740+) and is typically accessible through credit unions, online lenders, or bank relationship pricing. It is uncommon but available.',
      when: 'At a $25,000 balance, this refinance saves $60-70/month and $3,600-4,200 total. If you have this credit score and this rate, you are leaving a significant amount on the table.',
      context: 'The 5-point spread between your current rate and the market rate for your credit profile is purely lender margin from the original deal. The dealer financing arm that originated your loan at 10% charged a rate premium that has been compounding against you since day one.',
    },
    '10-6': {
      who: '10% to 6% is a 4-point improvement accessible to buyers who financed near-prime and have since improved their score by 40-60 points. It is also the natural outcome for buyers who used dealer financing when their credit union would have offered significantly less.',
      when: 'The 10% to 6% refinance is worth doing on any balance above $15,000 with 30+ months remaining. The total savings justify the paperwork at virtually any loan size in that range.',
      context: 'Cox Automotive data shows that 42% of new vehicle buyers in 2023 used dealer-arranged financing. Dealer financing markup over the lender buy rate averaged 1.8% during that period. If you are at 10%, there is a reasonable probability 1-2 points of that rate is dealer profit, not risk pricing.',
    },
    '11-5': {
      who: '11% to 5% is a 6-point drop requiring dramatic credit improvement (60+ points) or a loan that was significantly mispriced at origination. Both scenarios exist in the 2022-2026 auto finance period.',
      when: 'If you can achieve 5%, take it. On a $20,000 balance with 48 months remaining, you are saving $75-85/month and $3,600-4,100 total. The life of this loan changes entirely.',
      context: '6-point spreads typically indicate one of three things: the original loan was through a high-markup lender, the credit score has improved dramatically, or the rate environment has shifted significantly. All three occurred between 2022 and 2026.',
    },
    '11-6': {
      who: '5 points from 11% to 6% is achievable for buyers whose credit has moved from subprime to prime in the 18-24 months since purchase. Consistent payment history is the single most reliable driver of score improvement at the subprime-to-prime boundary.',
      when: 'The breakeven on a refinance at this rate drop is typically 2-4 months. After that you are saving real money every month for the life of the loan.',
      context: 'Experian data: the average credit score improvement after 24 months of on-time auto loan payments is 22 points. For subprime borrowers the improvement is often higher because the installment mix effect is larger at lower starting scores.',
    },
    '12-5': {
      who: '12% to 5% is a 7-point improvement and the most dramatic refinance scenario on this list. It exists for buyers who financed with limited credit history or through a lender that aggressively marked up the rate and have since addressed both.',
      when: 'On a $20,000 balance with 48 months remaining, a 7-point improvement saves $80-95/month and $3,800-4,600 total. That is a year of car insurance, or 12 months of maximum Roth IRA contributions over the remaining loan life.',
      context: '12% to 5% requires credit in the 740+ range. If your score is there, every day you stay at 12% is money leaving your household for no reason. Apply with a credit union first.',
    },
    '12-6': {
      who: 'A 6-point drop from 12% to 6% is available to borrowers whose credit has improved from subprime to prime. This is the refinance for the buyer who financed under financial pressure and has since stabilized their credit profile.',
      when: 'The ROI on this refinance is among the highest of any financial action available at this income and credit level. On a $22,000 balance with 48 months remaining, you save $70-80/month and $3,400-3,900 total.',
      context: '6% is a reasonable market rate for a prime borrower (700+) on a vehicle with a clean title less than 7 years old. If your score has crossed 700 and your vehicle qualifies, you likely qualify at a credit union or online lender today.',
    },
    '7-4': {
      who: '4% is near the floor of what is available outside manufacturer promotional offers. Achieving it requires excellent credit (760+), a newer vehicle, and typically a credit union membership that offers relationship pricing.',
      when: 'A drop from 7% to 4% is worth pursuing if you qualify. On a $25,000 balance with 48 months remaining you save $35-42/month and roughly $1,700-2,000 total.',
      context: '4% auto loans are available but not widely advertised. Credit unions with low overhead are the most consistent source. Call your credit union directly rather than relying on aggregator sites.',
    },
    '13-6': {
      who: '13% typically indicates a high-risk loan: significant derogatory credit history, a high loan-to-value ratio, or financing through a buy-here-pay-here dealer. The situation that created that rate needs to be addressed before a standard refinance is possible.',
      when: 'Standard refinance lenders will not offer 6% to a borrower who originally qualified for 13% unless the credit situation has dramatically changed. The path: improve score to 680+, pay down balance below vehicle value, then refinance. Sequence matters.',
      context: 'Buy-here-pay-here and subprime indirect lenders account for roughly 10% of auto originations and the majority of rates above 12%. These loans often carry prepayment penalties. Read your current loan agreement before applying to refinance.',
    },
    '14-7': {
      who: '14% is firmly in the high-risk lending range. This rate indicates either a buy-here-pay-here arrangement or a severe credit situation at origination: multiple derogatory marks, recent bankruptcy, or a very high debt-to-income ratio.',
      when: 'The path to 7% from 14% is not a quick refinance. It requires 18-24 months of consistent on-time payments, credit score improvement to at least 680, and positive equity in the vehicle. Build the credit first.',
      context: 'A 7-point improvement from 14% to 7% saves approximately $85-95/month on a $20,000 balance. The monthly motivation to work on your credit score is sitting right there in that number.',
    },
    '15-7': {
      who: '15% is above the rate ceiling most major lenders use and indicates either a buy-here-pay-here arrangement, a subprime specialty lender, or extreme credit risk at origination.',
      when: 'At 15%, the interest cost on a $15,000 balance over 60 months is approximately $6,400 — 43% on top of what you borrowed. The urgency to refinance is real but the credit work has to come first. Most standard lenders will not refinance until the score is above 640.',
      context: 'If you are at 15% and 24 months into the loan, you have already paid a significant interest premium. Calculate the remaining balance, check your current credit score, and identify the threshold score needed for a standard refi. That target number is what you work toward.',
    },
  };

  const found = contexts[key];
  if (found) return found;

  // Fallback for any unlisted combination
  return {
    who: `A ${diff}-point rate drop from ${oldRate}% to ${newRate}% is worth pursuing if you have 18+ months remaining on your loan and your credit score has improved since purchase. The higher your balance and the longer your remaining term, the more compelling the math.`,
    when: `Run the numbers on your specific balance and remaining term. If total savings exceed $1,000 and breakeven is under 12 months, the refinance is worth the application time.`,
    context: `Current Bankrate national average for a 60-month auto refinance loan with good credit: 6.2-7.4% depending on whether the vehicle is new or used. If you are above ${oldRate}% with a 700+ score, the market has likely moved in your favor.`,
  };
}


// Genuine editorial perspective per payment/salary combination
// Uses three axes: payment tier (what it finances), income tier (who you are), intent angle
// Produces content that cannot be generated by number substitution alone

export function scenarioContext(payment, salary, angle) {
  // Payment tier - what this monthly number actually buys
  function paymentTier(p) {
    if (p < 300) return { vehicle: 'a high-mileage used sedan or older compact', tier: 'budget', note: 'At this payment, you are financing a vehicle with limited remaining life. The true cost question is not the payment - it is how long before you need another one.' };
    if (p < 400) return { vehicle: 'a late-model used sedan or economy hatchback', tier: 'practical', note: 'This is the payment range where depreciation works in your favor. The steepest drop happened when the previous owner drove it off the lot.' };
    if (p < 500) return { vehicle: 'a new economy car or a 2-3 year old crossover', tier: 'midrange', note: 'You are at the decision point between new-with-warranty and used-with-value. The math usually favors used by $80-120/month in total cost.' };
    if (p < 600) return { vehicle: 'a new midsize sedan, new compact SUV, or a gently used luxury sedan', tier: 'comfortable', note: 'The $500-600 payment range is where dealers do most of their volume. The monthly number feels manageable. The 7-year loan that makes it manageable often does not.' };
    if (p < 700) return { vehicle: 'a new crossover, a new midsize SUV, or an entry-level luxury vehicle', tier: 'premium', note: 'This payment, annualized, is $7,200-8,400 before insurance, fuel, or maintenance. That is a meaningful number to apply toward an investment account instead.' };
    if (p < 800) return { vehicle: 'a new full-size SUV, a new midsize truck, or a near-new luxury midsize', tier: 'high', note: 'The vehicles in this payment tier depreciate faster than the national average. Year 3 resale on a new full-size SUV typically recovers 50-55 cents on the dollar at best.' };
    if (p < 1000) return { vehicle: 'a new full-size truck, a new luxury SUV, or a near-new European luxury sedan', tier: 'luxury', note: 'At this payment level, ownership drag is real and measurable. The difference between this payment and a 15%-rule compliant payment is compounding against your net worth every month.' };
    return { vehicle: 'a high-trim truck, a new luxury or near-luxury SUV, or an entry-level performance vehicle', tier: 'aspirational', note: 'Payments above $1,000 put you in the top 8% of US car buyers by monthly commitment. The question is whether the top 8% of your financial decisions reflects the same prioritization.' };
  }

  // Income tier - what this salary means for the car decision
  function incomeTier(s) {
    if (s < 50000) return { context: 'On a sub-$50K income, the car payment is rarely just a car payment. It competes with housing cost increases, emergency fund gaps, and the absence of any real investment margin. Every dollar above the 15% ceiling is a dollar not available for anything else.', label: 'budget-constrained' };
    if (s < 70000) return { context: 'The $50-70K income range is where most car finance mistakes are made. Income feels comfortable. Credit is good enough to get approved for more than is wise. The monthly payment that clears the bank does not feel wrong until month 18 when there is still no savings rate.', label: 'middle-income' };
    if (s < 90000) return { context: 'At $70-90K, the car decision is still meaningful but less binary. There is real financial margin here. The question shifts from "can I afford this" to "what does this choice cost me in 10 years" - which is the more useful question at any income level.', label: 'comfortable' };
    if (s < 120000) return { context: 'At $90-120K, most people feel like the car payment is not a problem. It is still a problem - it is just a slower-moving one. The opportunity cost of an above-ceiling car payment at this income level is measured in years of early retirement, not months of savings.', label: 'above-average' };
    if (s < 160000) return { context: 'At $120-160K, the car payment is a lifestyle choice, not a financial constraint. The right question is not whether you can afford it. It is whether your net worth trajectory reflects someone earning at this level - and whether the car is accelerating or decelerating that trajectory.', label: 'high-income' };
    return { context: 'Above $160K, car affordability is not the issue. Optimization is. The question is whether the capital allocated to depreciating transportation is calibrated to the size of your other financial ambitions. It often is not.', label: 'high-net-worth' };
  }

  // Angle-specific observation - what this specific person needs to hear
  const angleObs = {
    underwater: `The number that matters here is not the payment. It is the gap between what you owe and what the car is worth. Until that gap closes, every option involves a cost - the question is which cost you choose to pay.`,
    stretched: `The 15% rule exists because the people who wrote it watched enough financial plans fail to know where the friction starts. Being above it does not guarantee failure. It does mean the margin for other financial goals is tighter than it looks.`,
    borderline: `Being at the edge of the 15% ceiling is not the same as being over it. But it is worth knowing how thin the margin is. A rate increase on a refinance, an insurance premium adjustment, or a fuel price move can push borderline into stretched without any decision being made.`,
    healthy: `Being inside the 15% ceiling is the floor, not the goal. The question worth asking is what the gap between your payment and the ceiling is doing. That gap, invested monthly, is the number that changes the 10-year picture.`,
  };

  const pt = paymentTier(payment);
  const it = incomeTier(salary);
  const obs = angleObs[angle] || angleObs.borderline;

  return { pt, it, obs };
}

// ── Affordability page editorial context ──
// Income-specific observations that cannot be generated from a payment formula
export function affordEditorial(salary) {
  const editorials = {
    40000: 'On a $40,000 income, the car is not a financial decision - it is a financial constraint. The 15% ceiling exists not as a guideline but as a survival mechanism. Every dollar above it compresses housing, savings, and emergency cushion simultaneously. The most financially useful car at this income is the one that runs reliably and costs less than $250/month total. That vehicle exists. It requires patience and the willingness to buy used.',
    45000: 'A $45,000 income gives you slightly more margin than the median renter but not enough to absorb an aggressive car payment without consequence. The practical ceiling is around $340/month for the payment alone. At that number you are financing a vehicle in the $17-20K range - which is a legitimate, reliable car if you buy right. The 72-month loan that makes a $25K car "affordable" at $45K is the trap.',
    50000: 'At $50,000, you are near the national median income. The average American at this income carries a car payment that is 25-30% of take-home. The average American at this income also has less than $1,000 in liquid savings. These facts are related. Your ceiling is around $390/month. That is not a small payment - it finances a real car.',
    55000: 'The $55,000 income level is where car payments start to feel manageable. They often are not. The 15% rule puts your ceiling at about $430/month. The dealer puts you in a $550-600/month payment and it feels fine because you can make it. The difference between those two numbers is $120-170/month - which over 60 months is $7,200-10,200 that left your household and went to the lender.',
    60000: 'At $60,000, your 15% ceiling is around $490/month for payment and insurance combined. After insurance, the payment ceiling is approximately $315-340/month depending on your coverage. Most new vehicles do not have a $315 payment at standard terms. This is by design. The car industry is built around the psychology of what monthly payment you will say yes to, not what you can actually afford.',
    65000: 'A $65,000 income gives you a payment ceiling of approximately $515/month total - $340-365/month after insurance. That finances a real vehicle at standard terms. The question at this income level is whether you are buying a car or buying a payment. Those are different decisions. The car question: what do I need to get around reliably? The payment question: how much do I want to spend per month? They almost never lead to the same vehicle.',
    70000: 'At $70,000, the 15% ceiling is roughly $545/month total. You have real options at this number. The discipline required is not saying no to the upgrade trim - it is saying no to the longer loan term that makes the upgrade trim "affordable." A 72-month loan at this income is rarely the right answer. It extends the breakeven point past the point where the vehicle is worth trading.',
    75000: 'On a $75,000 salary, you are in the top 35% of US earners and have meaningful financial flexibility. The car payment ceiling is around $580/month total. That is a number most people at this income underutilize - meaning the cars they actually need cost less, and the gap represents money that could be doing other things. The 911 GT3 goal starts with using that gap consistently.',
    80000: 'At $80,000, the payment ceiling is roughly $620/month total. The practical reality: most buyers at this income are driving vehicles whose true monthly cost exceeds their ceiling by $200-300 because of insurance, fuel, and maintenance they did not fully account for at the point of purchase. The sticker price is not the cost. The monthly cash out the door is the cost.',
    90000: 'A $90,000 income puts you solidly in the bracket where car payments are a choice, not a constraint. Your ceiling is around $700/month total. At this income, the financial discipline is not about whether you can afford a nicer car - it is about whether the allocation to depreciating transportation is calibrated to your other financial goals. Most people at $90K are not on track with retirement contributions. That is the first number to fix.',
    100000: 'At $100,000, you earn in the top 20% of US households. Your car payment ceiling is roughly $780/month total. The irony of higher income and car payments: as income rises, the tendency is to fill the payment ceiling rather than stay well below it. The financially optimal move at this income is to drive a car that costs 8-10% of take-home, not 15%, and put the difference somewhere it compounds.',
    110000: 'On a $110,000 income, the car ceiling is approximately $855/month total. This is enough to finance most non-exotic vehicles. The more useful question is what percentage of your net worth the car represents. A vehicle worth $40,000 on a $200,000 net worth is a 20% allocation to a depreciating asset. That math does not improve with income unless the investment activity accelerates alongside it.',
    120000: 'At $120,000, the 15% ceiling is about $935/month total - enough for genuine luxury vehicles at standard terms. The buyers in this income range who remain financially ahead are disproportionately driving boring cars. Not because they cannot afford better. Because they understood that the car is not the point.',
    135000: 'A $135,000 income gives you a ceiling of roughly $1,050/month total. This covers almost everything that is not an exotic. The discipline at this income level is not affordability - it is intentionality. The question is whether the vehicle serves a genuine purpose or whether it is the financial equivalent of wearing a logo.',
    150000: 'At $150,000, you are in the top 8% of US earners. Your car ceiling is approximately $1,165/month total. Drivers at this income level who remain ahead financially are typically driving vehicles that consume 6-10% of take-home rather than 15%. The gap between those percentages, compounding over a decade, is the difference between financial independence and financial comfort.',
    175000: 'On a $175,000 income, the car is a rounding error in the income statement but a meaningful choice in the wealth statement. Your ceiling is roughly $1,360/month total. The more useful metric at this income level is what percentage of net worth is parked in the driveway. Optimize for that number first.',
    200000: 'At $200,000, you earn in the top 5% of US households. The car ceiling calculation still matters - not because $1,550/month is hard to make, but because the habits that got you to $200K are the same habits that determine whether $200K becomes the beginning or the ceiling. The car you drive at this income is a data point about your relationship with status and money.',
  };
  return editorials[salary] || null;
}

// ── Afford page anchor text map ──
// Varied anchor text for internal links — Google penalizes exact-match repetition
export const AFFORD_ANCHOR_TEXT = {
  40000:  'What car can I afford on $40K?',
  45000:  '$45,000 salary car budget breakdown',
  50000:  'Car affordability on a $50K salary',
  55000:  'I make $55K — what car can I afford?',
  60000:  '$60K salary: car affordability calculator',
  65000:  'What kind of car can I afford making $65K?',
  70000:  '$70,000 salary: realistic car payment ceiling',
  75000:  'How much car can I afford on $75K?',
  80000:  'I make $80K a year — what car can I afford?',
  90000:  '$90K salary: true car affordability',
  100000: '$100K salary car budget (15% rule)',
  110000: 'Car costs on a $110,000 salary',
  120000: 'What car can I afford with $120K salary?',
  135000: '$135K salary: car affordability analysis',
  150000: 'Car budget on $150K income',
  175000: '$175K salary: how much to spend on a car',
  200000: 'Car affordability on $200K income',
};

// ── Afford page vehicle examples ──
// Three vehicle tiers per salary: safe pick, stretch, luxury
// Each links to the relevant /cars/ page
export function affordVehicleExamples(salary) {
  const ceiling = threshold15(salary);
  const paymentCeiling = Math.max(0, ceiling - 175); // subtract avg insurance

  // Vehicle tiers mapped to salary ranges
  if (salary <= 45000) return {
    safe:    { name: '2025 Toyota Corolla', slug: '2025-toyota-corolla', payment: 215, why: 'Lowest insurance in class, 35+ MPG, parts everywhere. The car that lets you save.' },
    stretch: { name: '2025 Honda Civic', slug: '2025-honda-civic', payment: 265, why: 'A step up with nearly the same reliability. Still under the ceiling with room.' },
    luxury:  { name: '2025 Mazda3', slug: null, payment: 340, why: 'Near-luxury feel at economy-car running costs. Pushes your ceiling — only if insurance is low.' },
  };
  if (salary <= 60000) return {
    safe:    { name: '2025 Honda Civic', slug: '2025-honda-civic', payment: 265, why: 'Below your ceiling with $100+/month to spare. Use that gap for the emergency fund.' },
    stretch: { name: '2025 Toyota RAV4', slug: '2025-toyota-rav4', payment: 420, why: 'America\'s best-selling SUV. Sits right at your ceiling. No room for surprises.' },
    luxury:  { name: '2025 Honda CR-V', slug: '2025-honda-cr-v', payment: 449, why: 'Tight at this salary. Insurance pushes the true cost past the ceiling most months.' },
  };
  if (salary <= 75000) return {
    safe:    { name: '2025 Toyota RAV4', slug: '2025-toyota-rav4', payment: 420, why: 'Well inside your ceiling with $120/month cushion. Best resale in the segment.' },
    stretch: { name: '2025 Honda CR-V', slug: '2025-honda-cr-v', payment: 449, why: 'Comfortable at this income. True cost is $1,287/month — track the full number.' },
    luxury:  { name: '2025 Tesla Model 3', slug: '2025-tesla-model-3', payment: 499, why: 'Electric savings offset the higher payment. Only makes sense with home charging.' },
  };
  if (salary <= 100000) return {
    safe:    { name: '2025 Honda CR-V', slug: '2025-honda-cr-v', payment: 449, why: 'Well under your ceiling. The surplus is the point — put it somewhere it compounds.' },
    stretch: { name: '2025 Tesla Model Y', slug: '2025-tesla-model-y', payment: 549, why: 'Inside the ceiling with home charging. Insurance is high — factor that in first.' },
    luxury:  { name: '2025 BMW 3 Series', slug: '2025-bmw-3-series', payment: 699, why: 'Technically affordable. Out-of-warranty service costs will change the math.' },
  };
  return {
    safe:    { name: '2025 Tesla Model Y', slug: '2025-tesla-model-y', payment: 549, why: 'Well under your ceiling. The gap between this and your max is the wealth-building number.' },
    stretch: { name: '2025 BMW 3 Series', slug: '2025-bmw-3-series', payment: 699, why: 'Comfortable at this income. Watch total cost of ownership, not just the payment.' },
    luxury:  { name: '2025 Porsche Cayenne', slug: '2025-porsche-cayenne', payment: 1200, why: 'At or above the ceiling depending on income tier. Maintenance costs are real.' },
  };
}

// ── Afford page APR scenario math ──
export function affordAPRScenarios(salary) {
  const paymentCeiling = Math.max(0, threshold15(salary) - 175);
  function loanAmount(payment, apr, months) {
    const r = apr / 100 / 12;
    return Math.round(payment * (1 - Math.pow(1 + r, -months)) / r);
  }
  return {
    ceiling: paymentCeiling,
    scenarios: [
      { apr: 7,  label: '7% APR (good credit)', vehicle: loanAmount(paymentCeiling, 7, 60) },
      { apr: 9,  label: '9% APR (fair credit)',  vehicle: loanAmount(paymentCeiling, 9, 60) },
      { apr: 11, label: '11% APR (subprime)',    vehicle: loanAmount(paymentCeiling, 11, 60) },
    ],
  };
}

// ── Payment page APR buying power table ──
// Shows what different APR scenarios mean for buying power at this payment
export function paymentAPRTable(payment) {
  function loanAmount(pmt, apr, months) {
    const r = apr / 100 / 12;
    return Math.round(pmt * (1 - Math.pow(1 + r, -months)) / r);
  }
  return [
    { apr: 5.9,  label: '5.9% (excellent credit)',  vehicle60: loanAmount(payment, 5.9, 60),  vehicle72: loanAmount(payment, 5.9, 72) },
    { apr: 7.5,  label: '7.5% (good credit)',        vehicle60: loanAmount(payment, 7.5, 60),  vehicle72: loanAmount(payment, 7.5, 72) },
    { apr: 9.9,  label: '9.9% (fair credit)',         vehicle60: loanAmount(payment, 9.9, 60),  vehicle72: loanAmount(payment, 9.9, 72) },
    { apr: 12.0, label: '12.0% (subprime)',           vehicle60: loanAmount(payment, 12, 60),   vehicle72: loanAmount(payment, 12, 72) },
  ];
}
