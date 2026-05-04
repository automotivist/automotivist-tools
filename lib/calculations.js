// lib/calculations.js
export const BEEHIIV_PUB_ID = 'pub_b0b30438-1b65-4641-9b8f-904280c400a8';

// ── Core math ──
export function monthlyTakeHome(s) { let r; if(s<40000)r=0.82;else if(s<60000)r=0.78;else if(s<80000)r=0.75;else if(s<100000)r=0.72;else if(s<150000)r=0.70;else r=0.67;return Math.round((s*r)/12); }
export function threshold15(s) { return Math.round(monthlyTakeHome(s)*0.15); }
export function threshold10(s) { return Math.round(monthlyTakeHome(s)*0.10); }
export function paymentPercent(p,s) { return parseFloat((p/monthlyTakeHome(s)*100).toFixed(1)); }
export function estimateInsurance(p) { if(p<300)return 110;else if(p<500)return 145;else if(p<700)return 175;else if(p<900)return 210;else if(p<1100)return 245;else return 280; }
export function estimateFuel() { return Math.round((15000/28)*3.50/12); }
export function estimateMaintenance() { return Math.round((0.10*15000)/12); }
export function trueMonthlyCost(p) { return p+estimateInsurance(p)+estimateFuel()+estimateMaintenance(); }
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
export function generateFAQs(payment,salary) { const pct=paymentPercent(payment,salary);const thresh=threshold15(salary);const sp5=sp500_5yr(payment);const sp10=sp500_10yr(payment);const trueM=trueMonthlyCost(payment);const verdict=getVerdict(payment,salary);const over=Math.max(0,payment-thresh);return[{question:`Is a $${payment.toLocaleString()} car payment too high on a $${salary.toLocaleString()} salary?`,answer:verdict==='too-high'?`Yes. At $${salary.toLocaleString()}, the 15% rule caps your car payment at $${thresh.toLocaleString()}/month. A $${payment.toLocaleString()} payment is $${over.toLocaleString()} over that ceiling.`:`At $${salary.toLocaleString()}, a $${payment.toLocaleString()} payment represents ${pct}% of your take-home -- inside the 15% rule.`},{question:`What is the maximum car payment for a $${salary.toLocaleString()} salary?`,answer:`The 15% rule puts the maximum at $${thresh.toLocaleString()}/month on a $${salary.toLocaleString()} income.`},{question:`How much does a $${payment.toLocaleString()} car payment actually cost per month?`,answer:`The payment alone is $${payment.toLocaleString()}. Add insurance, fuel, maintenance and the true monthly cost is closer to $${trueM.toLocaleString()}.`},{question:`What would $${payment.toLocaleString()}/month invested instead be worth in 5 years?`,answer:`At the S&P 500's 50-year average of 10.5% annual return, $${payment.toLocaleString()}/month for 5 years = $${sp5.toLocaleString()}. Over 10 years: $${sp10.toLocaleString()}. Illustrative. Not financial advice.`},{question:`How do I lower my car payment on a $${salary.toLocaleString()} salary?`,answer:'Refinancing, downsizing, or paying off the loan. Refinancing works if rates have dropped or your credit score has improved.'}]; }
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
