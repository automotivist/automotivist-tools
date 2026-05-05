// components/Calculator.jsx
import { useState, useRef, useEffect } from 'react';
import { BEEHIIV_PUB_ID } from '../lib/calculations';

const fmt  = n => '$' + Math.round(n).toLocaleString();
const fmtP = n => n.toFixed(1) + '%';
const fmtK = n => n >= 1000 ? '$' + (n / 1000).toFixed(0) + 'K' : fmt(n);

function fvAnn(pmt, rate, yrs) {
  const r = rate / 12, n = yrs * 12;
  if (r === 0) return pmt * n;
  return pmt * ((Math.pow(1 + r, n) - 1) / r);
}

function estPrincipal(pmt, apr, mo) {
  if (apr === 0) return pmt * mo;
  const r = apr / 100 / 12;
  return pmt * (1 - Math.pow(1 + r, -mo)) / r;
}

// Smart estimates based on payment as proxy for vehicle size
function estimateFuel(pmt) {
  if (pmt < 300) return 125;
  if (pmt < 450) return 150;
  if (pmt < 600) return 170;
  if (pmt < 800) return 195;
  if (pmt < 1000) return 220;
  return 250;
}
function estimateMaint(pmt) {
  if (pmt < 300) return 90;
  if (pmt < 500) return 110;
  if (pmt < 700) return 135;
  if (pmt < 900) return 155;
  return 185;
}
function estimateReg() { return 15; } // $180/yr national avg

function calcScore(ip, apr, term) {
  let s = 100;
  if      (ip < 8)  s -= 0;
  else if (ip < 10) s -= 8;
  else if (ip < 12) s -= 16;
  else if (ip < 15) s -= 28;
  else if (ip < 18) s -= 40;
  else if (ip < 22) s -= 52;
  else              s -= 62;
  if      (apr <= 0) s -= 0;
  else if (apr < 3)  s -= 2;
  else if (apr < 5)  s -= 8;
  else if (apr < 7)  s -= 15;
  else if (apr < 10) s -= 21;
  else               s -= 25;
  if      (term <= 36) s -= 0;
  else if (term <= 48) s -= 4;
  else if (term <= 60) s -= 8;
  else if (term <= 72) s -= 12;
  else                 s -= 15;
  return Math.max(0, Math.min(100, Math.round(s)));
}

function getGrade(s) {
  if (s >= 85) return { g: 'A', desc: 'Your car works for you.', color: '#4DC84D' };
  if (s >= 70) return { g: 'B', desc: 'Solid. Room to optimize.', color: '#7BC85A' };
  if (s >= 55) return { g: 'C', desc: 'Stretched. Worth a closer look.', color: '#E8A020' };
  if (s >= 40) return { g: 'D', desc: 'Ownership drag is real.', color: '#E87030' };
  return        { g: 'F', desc: 'This car is breaking you.', color: '#CC3232' };
}

function buildShareCard(canvas, score, g, d) {
  const ctx = canvas.getContext('2d');
  const W = 1080, H = 1080;
  canvas.width = W; canvas.height = H;
  ctx.fillStyle = '#080808'; ctx.fillRect(0, 0, W, H);
  const [r, gr, b] = [parseInt(g.color.slice(1,3),16), parseInt(g.color.slice(3,5),16), parseInt(g.color.slice(5,7),16)];
  const vg = ctx.createRadialGradient(W/2, 0, 0, W/2, H/2, 640);
  vg.addColorStop(0, `rgba(${r},${gr},${b},0.07)`);
  vg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = g.color; ctx.fillRect(80, 68, 920, 3);
  ctx.fillStyle = g.color; ctx.beginPath(); ctx.arc(72, 116, 6, 0, 2*Math.PI); ctx.fill();
  ctx.fillStyle = '#888888'; ctx.font = '600 24px "Barlow Condensed"'; ctx.textAlign = 'left';
  ctx.fillText('THE AUTOMOTIVIST', 88, 124);
  ctx.fillStyle = '#555555'; ctx.font = '600 20px "Barlow Condensed"'; ctx.textAlign = 'center';
  ctx.fillText('YOUR OWNERSHIP SCORE', W/2, 214);
  const cx = W/2, cy = 435, R = 166, lw = 16;
  ctx.strokeStyle = '#1E1E1E'; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2*Math.PI); ctx.stroke();
  const ang = -Math.PI/2 + (score/100)*2*Math.PI;
  ctx.shadowColor = g.color; ctx.shadowBlur = 22;
  ctx.strokeStyle = g.color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI/2, ang); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFFFFF'; ctx.font = '800 128px "Barlow Condensed"'; ctx.textAlign = 'center';
  ctx.fillText(String(score), cx, cy + 24);
  ctx.fillStyle = '#555555'; ctx.font = '400 28px "Barlow Condensed"';
  ctx.fillText('/100', cx, cy + 68);
  ctx.fillStyle = g.color; ctx.font = '800 96px "Barlow Condensed"';
  ctx.fillText(g.g, cx, cy + 192);
  ctx.fillStyle = '#888888'; ctx.font = '300 28px "Barlow"';
  ctx.fillText(g.desc, cx, cy + 238);
  ctx.strokeStyle = '#1E1E1E'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 726); ctx.lineTo(1000, 726); ctx.stroke();
  const stats = [
    { l: 'INCOME %', v: fmtP(d.ip) },
    { l: '10-YR S&P 500 COST', v: fmtK(d.sp10) },
    { l: 'TRUE MONTHLY COST', v: fmtK(d.trueMo) },
  ];
  const cw = (W - 160) / 3;
  stats.forEach((s, i) => {
    const x = 80 + i * cw + cw / 2;
    ctx.fillStyle = '#555555'; ctx.font = '600 18px "Barlow Condensed"'; ctx.textAlign = 'center';
    ctx.fillText(s.l, x, 778);
    ctx.fillStyle = '#FFFFFF'; ctx.font = '700 36px "Barlow Condensed"';
    ctx.fillText(s.v, x, 828);
    if (i < 2) {
      ctx.strokeStyle = '#1E1E1E'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(80 + (i+1)*cw, 748); ctx.lineTo(80 + (i+1)*cw, 846); ctx.stroke();
    }
  });
  ctx.fillStyle = '#333333'; ctx.font = '300 italic 22px "Barlow"'; ctx.textAlign = 'center';
  ctx.fillText('"I love cars. But I refuse to let them keep me broke."', W/2, 928);
  ctx.fillStyle = '#444444'; ctx.font = '400 20px "Barlow Condensed"';
  ctx.fillText('automotivist.com/calculator', W/2, 974);
  ctx.fillStyle = g.color; ctx.fillRect(80, 1008, 920, 3);
}

export default function Calculator({ preloadPayment, preloadSalary, preloadApr, slug, compact = false }) {
  const [payment,   setPayment]   = useState(preloadPayment || '');
  const [rate,      setRate]      = useState(preloadApr     || '');
  const [term,      setTerm]      = useState(60);
  const [insurance, setInsurance] = useState('');
  const [fuel,      setFuel]      = useState('');
  const [maint,     setMaint]     = useState('');
  const [reg,       setReg]       = useState('');
  const [income,    setIncome]    = useState(preloadSalary  || '');
  const [results,   setResults]   = useState(null);
  const [gated,     setGated]     = useState(false);
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});
  const canvasRef  = useRef(null);
  const resultsRef = useRef(null);

  // Auto-fill estimates when payment changes
  useEffect(() => {
    const p = parseFloat(payment);
    if (p > 0) {
      if (!fuel)  setFuel(String(estimateFuel(p)));
      if (!maint) setMaint(String(estimateMaint(p)));
      if (!reg)   setReg(String(estimateReg()));
    }
  }, [payment]);

  function validate() {
    const e = {};
    if (!payment   || payment  <= 0) e.payment   = true;
    if (!insurance || insurance <= 0) e.insurance = true;
    if (!income    || income   <= 0) e.income    = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function compute() {
    if (!validate()) return;
    const pmt  = parseFloat(payment);
    const apr  = parseFloat(rate) || 0;
    const ins  = parseFloat(insurance);
    const fuelV = parseFloat(fuel) || estimateFuel(pmt);
    const maintV = parseFloat(maint) || estimateMaint(pmt);
    const regV   = parseFloat(reg) || estimateReg();
    const inc  = parseFloat(income);
    const moInc    = inc / 12;
    const moTot    = pmt + ins;
    const trueMo   = pmt + ins + fuelV + maintV + regV;
    const ip       = (moTot / moInc) * 100;
    const totLoan  = pmt * term;
    const princ    = estPrincipal(pmt, apr, term);
    const interest = Math.max(0, totLoan - princ);
    const sp5      = fvAnn(pmt, 0.105, 5);
    const sp10     = fvAnn(pmt, 0.105, 10);
    const btc      = fvAnn(pmt, 0.40,  10);
    const re       = fvAnn(pmt, 0.08,  10);
    const gold     = fvAnn(pmt, 0.075, 10);
    const hy       = fvAnn(pmt, 0.045, 10);
    const score    = calcScore(ip, apr, term);
    const gradeObj = getGrade(score);
    setResults({ pmt, apr, term, ins, fuelV, maintV, regV, inc, moInc, moTot, trueMo, ip, totLoan, interest, sp5, sp10, btc, re, gold, hy, score, gradeObj });
    setGated(true);
    setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }

  function submitEmail() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: true, utm_source: 'programmatic-seo', utm_medium: 'calculator', utm_campaign: slug || 'calculator-landing' }),
    }).catch(() => {});
    setSubmitted(true);
    document.fonts.ready.then(() => {
      if (canvasRef.current && results) buildShareCard(canvasRef.current, results.score, results.gradeObj, results);
    });
  }

  function downloadCard() {
    canvasRef.current?.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'my-ownership-score.png';
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  }

  function shareX() {
    if (!results) return;
    const { score, gradeObj, ip, sp10, trueMo } = results;
    const tweet = `My car ownership score: ${score}/100 -- Grade ${gradeObj.g}\n\n${gradeObj.desc}\n\nCar costs: ${fmtP(ip)} of my income\nTrue monthly cost: ${fmt(trueMo)}\n10-yr S&P 500 opportunity cost: ${fmt(sp10)}\n\nRun yours -> automotivist.com/calculator\n\nvia @_automotivist`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet), '_blank', 'width=600,height=500');
  }

  const teaser = results ? (() => {
    const { ip } = results;
    if (ip < 10) return { text: 'HEALTHY',     bg: '#e6f5ed', color: '#1C6840' };
    if (ip < 15) return { text: 'MANAGEABLE',  bg: '#fff8e8', color: '#9A5C00' };
    if (ip < 20) return { text: 'STRETCHED',   bg: '#fff4ed', color: '#B05020' };
    return            { text: 'DANGER ZONE', bg: '#fbecea', color: '#B03428' };
  })() : null;

  const S = styles;

  return (
    <div style={S.wrapper}>
      <canvas ref={canvasRef} width={1080} height={1080} style={{ display: 'none' }} />

      {/* Input card */}
      <div style={S.card}>
        <div style={S.sectionLabel}>Your car situation</div>
        <div style={S.grid2}>
          <Field label="Monthly payment" error={errors.payment} prefix="$">
            <input style={{...S.input, ...(errors.payment ? S.inputErr : {})}}
              type="number" value={payment} onChange={e => setPayment(e.target.value)} placeholder="650" min="0" />
          </Field>
          <Field label="Interest rate (APR)" suffix="%">
            <input style={S.input} type="number" value={rate}
              onChange={e => setRate(e.target.value)} placeholder="7.5" step="0.1" />
          </Field>
          <Field label={<span>Loan term — <span style={{ color: '#E8A020', fontWeight: 700 }}>{term} months</span></span>}>
            <input type="range" style={S.slider} min={24} max={84} step={12} value={term}
              onChange={e => setTerm(parseInt(e.target.value))} />
            <div style={S.ticks}>
              {[24,36,48,60,72,84].map(v => <span key={v} style={S.tick}>{v}</span>)}
            </div>
          </Field>
          <Field label="Annual income (gross)" error={errors.income} prefix="$">
            <input style={{...S.input, ...(errors.income ? S.inputErr : {})}}
              type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="75000" min="0" />
          </Field>
        </div>

        {/* Running costs section */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: '#A8A49C', marginBottom: 14 }}>
            Monthly running costs <span style={{ fontSize: 10, color: '#C8C4BC', fontWeight: 400, letterSpacing: '.05em', textTransform: 'none' }}> — pre-filled estimates, edit to match your actuals</span>
          </div>
          <div style={S.grid2}>
            <Field label="Insurance" error={errors.insurance} prefix="$">
              <input style={{...S.input, ...(errors.insurance ? S.inputErr : {})}}
                type="number" value={insurance} onChange={e => setInsurance(e.target.value)} placeholder="175" min="0" />
            </Field>
            <Field label="Fuel" prefix="$">
              <input style={S.input} type="number" value={fuel}
                onChange={e => setFuel(e.target.value)} placeholder={payment ? String(estimateFuel(parseFloat(payment)||0)) : '155'} min="0" />
            </Field>
            <Field label="Maintenance & repairs" prefix="$">
              <input style={S.input} type="number" value={maint}
                onChange={e => setMaint(e.target.value)} placeholder={payment ? String(estimateMaint(parseFloat(payment)||0)) : '120'} min="0" />
            </Field>
            <Field label="Registration & fees (monthly)" prefix="$">
              <input style={S.input} type="number" value={reg}
                onChange={e => setReg(e.target.value)} placeholder="15" min="0" />
            </Field>
          </div>
        </div>

        <button style={S.calcBtn} onClick={compute}>Calculate My Ownership Score</button>
      </div>

      {/* Teaser results */}
      {gated && results && teaser && (
        <div ref={resultsRef} style={S.teaserCard}>
          <div style={S.teaserHead}>
            <span style={S.teaserLabel}>Ownership cost snapshot</span>
            <span style={{ ...S.badge, background: teaser.bg, color: teaser.color }}>{teaser.text}</span>
          </div>
          <div style={S.statGrid}>
            <StatCell label="Total loan cost over term" value={fmt(results.totLoan)} sub={`${results.term} months at ${results.apr}% APR`} color="red" />
            <StatCell label="Total interest paid" value={fmt(results.interest)} sub="over loan term" color="red" />
            <StatCell label="Payment + insurance" value={fmt(results.moTot)} sub="monthly out-of-pocket" color="amber" />
            <StatCell label="% of gross monthly income" value={fmtP(results.ip)} sub={results.ip < 15 ? 'Inside the 15% rule' : 'Above the 15% rule ceiling'} color={results.ip < 15 ? 'amber' : 'red'} />
          </div>
        </div>
      )}

      {/* Email gate */}
      {gated && !submitted && (
        <div style={S.gateCard}>
          <div style={S.gateEye}>Unlock your full results + Ownership Score</div>
          <h3 style={S.gateHeadline}>See where this money could go instead</h3>
          <p style={S.gateSub}>
            Enter your email to unlock your <strong style={{ color: '#17140D' }}>itemized true monthly cost</strong>, 10-year wealth impact across S&P 500, Bitcoin, real estate, gold, and HYSA — plus your <strong style={{ color: '#17140D' }}>Ownership Score</strong> you can download and share.
          </p>
          <div style={S.gateRow}>
            <input type="email" style={S.emailInput} value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitEmail()}
              placeholder="you@email.com" />
            <button style={S.gateBtn} onClick={submitEmail}>Unlock Full Results</button>
          </div>
          <p style={S.gatePriv}>One email per week. The Automotivist on Beehiiv. Unsubscribe anytime.</p>
        </div>
      )}

      {/* Full results */}
      {submitted && results && (
        <>
          {/* Itemized true cost breakdown */}
          <div style={S.card}>
            <div style={S.sectionLabel}>What this car actually costs per month</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <tbody>
                {[
                  { label: 'Loan payment',              value: results.pmt,   note: `${results.term}-month term at ${results.apr}% APR` },
                  { label: 'Insurance',                  value: results.ins,   note: 'full coverage estimate' },
                  { label: 'Fuel',                       value: results.fuelV, note: '~15,000 mi/yr estimate' },
                  { label: 'Maintenance & repairs',      value: results.maintV,note: 'AAA annual average' },
                  { label: 'Registration & fees',        value: results.regV,  note: '$180/yr national average' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '12px 0', fontFamily: 'var(--font-body)', fontSize: 14, color: '#6A6560' }}>{row.label}</td>
                    <td style={{ padding: '12px 0', fontSize: 11, color: '#B0ACA6', textAlign: 'center' }}>{row.note}</td>
                    <td style={{ padding: '12px 0', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#17140D', textAlign: 'right' }}>{fmt(row.value)}</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid #D8D3C8' }}>
                  <td style={{ padding: '14px 0', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#17140D' }}>True monthly total</td>
                  <td />
                  <td style={{ padding: '14px 0', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#B03428', textAlign: 'right' }}>{fmt(results.trueMo)}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ background: 'rgba(176,52,40,.06)', border: '1px solid rgba(176,52,40,.15)', borderRadius: 10, padding: '14px 18px' }}>
              <p style={{ fontSize: 13, color: '#6A6560', lineHeight: 1.65, margin: 0 }}>
                The dealership quoted you <strong style={{ color: '#17140D' }}>{fmt(results.pmt)}/month</strong>. The car costs <strong style={{ color: '#B03428' }}>{fmt(results.trueMo)}/month</strong>. That is a <strong style={{ color: '#B03428' }}>{fmt(results.trueMo - results.pmt)} gap</strong> — {Math.round(((results.trueMo - results.pmt) / results.pmt) * 100)}% more than the payment number they put in front of you.
              </p>
            </div>
          </div>

          {/* Income bars */}
          <div style={S.card}>
            <div style={S.sectionLabel}>What this car takes from your income</div>
            <BarRow label="Payment + insurance only" amount={fmt(results.moTot)} pct={Math.min(results.ip, 100)} note={fmtP(results.ip) + ' of gross monthly income — the number they quote'} color="#CC3232" />
            <BarRow label="True all-in monthly cost" amount={fmt(results.trueMo)} pct={Math.min((results.trueMo / results.moInc) * 100, 100)} note={fmtP((results.trueMo / results.moInc) * 100) + ' of gross monthly income — the real number'} color="#E8A020" />
            <BarRow label="Gross monthly income" amount={fmt(results.moInc)} pct={100} note="100% of monthly gross income" color="#4DC84D" />
          </div>

          {/* Opportunity cost */}
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 14, color: 'var(--light-text, #17140D)' }}>
              The 10-year opportunity cost
            </h3>
            <p style={{ fontSize: 13, color: 'var(--light-muted, #6A6560)', marginBottom: 14, lineHeight: 1.6 }}>
              What your monthly payment invested instead would be worth in 10 years.
            </p>
            <AssetRow name="S&P 500 Index" rate="10.5% avg annual — 50-year historical" value={fmt(results.sp10)} top badge="BEST RISK-ADJUSTED" />
            <AssetRow name="Bitcoin" rate="~40% avg annual — extreme volatility" value={fmt(results.btc)} />
            <AssetRow name="Real Estate" rate="~8% avg annual incl. appreciation" value={fmt(results.re)} />
            <AssetRow name="Gold / Silver" rate="~7.5% avg annual — inflation hedge" value={fmt(results.gold)} />
            <AssetRow name="High-Yield Savings (HYSA)" rate="4.5% — zero risk, current rate" value={fmt(results.hy)} />
            <div style={S.insightBox}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--light-text, #17140D)' }}>
                Every dollar sent to a lender over this loan creates a{' '}
                <strong style={{ color: '#9A5C00' }}>{(results.sp10 / results.totLoan).toFixed(1)}x opportunity cost</strong>{' '}
                against the S&P 500 -- {fmt(results.sp10)} in potential wealth for {fmt(results.totLoan)} in payments.
                That is not a car cost. That is a wealth decision.
              </p>
            </div>
          </div>

          {/* Score */}
          <div style={S.scoreSection}>
            <div style={S.scoreEye}>Your Ownership Score</div>
            <ScoreRing score={results.score} grade={results.gradeObj} />
            <div style={{ fontSize: 72, fontFamily: 'var(--font-display, "Barlow Condensed")', fontWeight: 800, color: results.gradeObj.color, lineHeight: 1, marginBottom: 8 }}>
              {results.gradeObj.g}
            </div>
            <div style={{ fontSize: 16, color: '#888888', marginBottom: 32, fontFamily: 'var(--font-body)' }}>
              {results.gradeObj.desc}
            </div>
            <div style={S.scoreStats}>
              <ScoreStat label="Income %" value={fmtP(results.ip)} />
              <ScoreStat label="True monthly" value={fmtK(results.trueMo)} />
              <ScoreStat label="10-yr S&P 500" value={fmtK(results.sp10)} />
            </div>
            <p style={{ fontSize: 13, color: '#888888', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
              Share your score. Make them run their numbers.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ ...S.shareBtn, background: '#1E1E1E', color: '#CCCCCC', border: '1px solid #2A2A2A' }} onClick={downloadCard}>
                ↓ Download Card
              </button>
              <button style={{ ...S.shareBtn, background: '#E8A020', color: '#080808', boxShadow: '0 4px 16px rgba(232,160,32,.30)' }} onClick={shareX}>
                Post to X →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, children, error, prefix, suffix }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--light-muted, #6A6560)', fontFamily: 'var(--font-body)' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={styles.prefix}>{prefix}</span>}
        {children}
        {suffix && <span style={styles.suffix}>{suffix}</span>}
      </div>
      {error && <span style={{ fontSize: 11, color: '#B03428' }}>Required</span>}
    </div>
  );
}

function StatCell({ label, value, sub, color }) {
  const colorMap = { red: '#B03428', amber: '#9A5C00', green: '#1C6840' };
  return (
    <div style={{ padding: '20px 24px', borderRight: '1px solid #D8D3C8', borderBottom: '1px solid #D8D3C8' }}>
      <div style={{ fontSize: 11, color: '#6A6560', fontWeight: 500, marginBottom: 7 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700, color: colorMap[color] || colorMap.amber }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: '#A8A49C', marginTop: 5 }}>{sub}</div>
    </div>
  );
}

function BarRow({ label, amount, pct, note, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(pct), 100); }, [pct]);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <span style={{ fontSize: 12, color: '#6A6560', fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color }}>{amount}</span>
      </div>
      <div style={{ height: 6, background: '#E5E0D8', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: color, width: width + '%', transition: 'width .9s cubic-bezier(.16,1,.3,1)' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#A8A49C', marginTop: 5 }}>{note}</div>
    </div>
  );
}

function AssetRow({ name, rate, value, top, badge }) {
  return (
    <div style={{ background: top ? 'rgba(28,104,64,.03)' : '#FFFFFF', border: `1px solid ${top ? '#1C6840' : '#D8D3C8'}`, borderRadius: 11, padding: '18px 20px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.04)' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#17140D' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#A8A49C', marginTop: 3 }}>{rate}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#1C6840' }}>{value}</div>
        {badge && <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 600, letterSpacing: '.06em', color: '#1C6840', display: 'block', marginTop: 3 }}>{badge}</span>}
      </div>
    </div>
  );
}

function ScoreRing({ score, grade }) {
  const [dash, setDash] = useState(565.49);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => setDash(565.49 - (score / 100) * 565.49), 200);
    const start = performance.now();
    const dur = 1100;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(score * e));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [score]);
  return (
    <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
      <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 200 200">
        <circle fill="none" stroke="#1E1E1E" strokeWidth={10} cx={100} cy={100} r={90} />
        <circle fill="none" stroke={grade.color} strokeWidth={10} strokeLinecap="round"
          cx={100} cy={100} r={90}
          strokeDasharray={565.49} strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>{count}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#555555', marginTop: 2 }}>/100</div>
      </div>
    </div>
  );
}

function ScoreStat({ label, value }) {
  return (
    <div style={{ background: '#0D0D0D', padding: '16px 12px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#555555', marginBottom: 7 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,2.8vw,20px)', fontWeight: 700, color: '#FFFFFF' }}>{value}</div>
    </div>
  );
}

const styles = {
  wrapper: { maxWidth: 680, margin: '0 auto' },
  card: { background: '#FFFFFF', border: '1px solid #D8D3C8', borderRadius: 14, padding: '28px 28px 24px', marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,.05)' },
  sectionLabel: { fontFamily: 'var(--font-display, "Barlow Condensed")', fontSize: 11, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: '#A8A49C', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #E5E0D8' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  input: { width: '100%', background: '#F5F2EC', border: '1.5px solid #D8D3C8', borderRadius: 8, padding: '11px 12px 11px 28px', fontFamily: 'var(--font-display, "Barlow Condensed")', fontSize: 17, fontWeight: 600, color: '#17140D', outline: 'none' },
  inputErr: { borderColor: '#B03428' },
  prefix: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: '#A8A49C', pointerEvents: 'none' },
  suffix: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontSize: 13, color: '#A8A49C', pointerEvents: 'none' },
  slider: { width: '100%', marginTop: 8, accentColor: '#E8A020' },
  ticks: { display: 'flex', justifyContent: 'space-between', marginTop: 6 },
  tick: { fontFamily: 'var(--font-display)', fontSize: 11, color: '#A8A49C' },
  calcBtn: { width: '100%', padding: 16, background: '#17140D', color: '#FAF8F4', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display, "Barlow Condensed")', fontSize: 18, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', marginTop: 10 },
  teaserCard: { background: '#FFFFFF', border: '1px solid #D8D3C8', borderRadius: 14, overflow: 'hidden', marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,.05)' },
  teaserHead: { padding: '16px 24px', borderBottom: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  teaserLabel: { fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.18em', color: '#A8A49C' },
  badge: { fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', padding: '3px 10px', borderRadius: 4 },
  statGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
  gateCard: { background: '#FFFFFF', border: '1.5px solid rgba(232,160,32,.22)', borderRadius: 14, padding: 28, marginBottom: 18, boxShadow: '0 2px 12px rgba(0,0,0,.04)' },
  gateEye: { fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.2em', color: '#E8A020', marginBottom: 10 },
  gateHeadline: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#17140D', letterSpacing: '.01em' },
  gateSub: { fontSize: 15, color: '#6A6560', lineHeight: 1.65, marginBottom: 22, fontFamily: 'var(--font-body)' },
  gateRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  emailInput: { flex: 1, minWidth: 200, padding: '12px 14px', background: '#F5F2EC', border: '1.5px solid #D8D3C8', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 15, color: '#17140D', outline: 'none' },
  gateBtn: { padding: '12px 22px', background: '#E8A020', color: '#0C0A06', border: 'none', borderRadius: 8, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', whiteSpace: 'nowrap' },
  gatePriv: { fontSize: 12, color: '#A8A49C', marginTop: 10, fontFamily: 'var(--font-body)' },
  insightBox: { background: 'rgba(232,160,32,.08)', border: '1px solid rgba(232,160,32,.22)', borderRadius: 11, padding: '18px 20px', margin: '18px 0' },
  scoreSection: { background: '#080808', borderRadius: 20, padding: '48px 32px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: 24 },
  scoreEye: { fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '.25em', textTransform: 'uppercase', color: '#555555', marginBottom: 32 },
  scoreStats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: '#1E1E1E', borderRadius: 12, overflow: 'hidden', marginBottom: 36 },
  shareBtn: { padding: '13px 24px', borderRadius: 9, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', border: 'none' },
};
