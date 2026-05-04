// pages/afford/[slug].js
// "How much car can I afford on a $X salary?"
// 17 pages covering $40K-$200K salaries
import Layout from '../../components/Layout';
import Calculator from '../../components/Calculator';
import Link from 'next/link';
import {
  getAllAffordPaths, parseAffordSlug, affordData, affordFAQs,
  AFFORD_SALARIES, fmtDollar
} from '../../lib/calculations';

export async function getStaticPaths() {
  return { paths: getAllAffordPaths(), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const parsed = parseAffordSlug(params.slug);
  if (!parsed) return { notFound: true };
  const data = affordData(parsed.salary);
  const faqs = affordFAQs(parsed.salary);
  return { props: { data, faqs, slug: params.slug } };
}

export default function AffordPage({ data, faqs, slug }) {
  const { salary, takeHome, max15, paymentCeiling15, paymentCeiling10, vehicleAt15, vehicleAt10, sp10_15 } = data;

  const fmtS = n => '$' + n.toLocaleString();
  const salaryLabel = '$' + (salary >= 1000 ? (salary/1000).toFixed(0) + 'K' : salary.toLocaleString());

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How Much Car Can I Afford on a ${fmtS(salary)} Salary?`,
    description: `Car affordability breakdown for a ${fmtS(salary)} income. 15% rule ceiling, payment limits, and vehicle price ranges.`,
    author: { '@type': 'Organization', name: 'The Automotivist' },
    publisher: { '@type': 'Organization', name: 'The Automotivist', url: 'https://tools.automotivist.com' },
  };

  // Related salaries
  const idx = AFFORD_SALARIES.indexOf(salary);
  const related = [
    idx > 0 && AFFORD_SALARIES[idx - 1],
    idx < AFFORD_SALARIES.length - 1 && AFFORD_SALARIES[idx + 1],
    idx > 1 && AFFORD_SALARIES[idx - 2],
    idx < AFFORD_SALARIES.length - 2 && AFFORD_SALARIES[idx + 2],
  ].filter(Boolean).slice(0, 4);

  return (
    <Layout
      title={`How Much Car Can I Afford on a ${fmtS(salary)} Salary? — The Automotivist`}
      description={`On a ${fmtS(salary)} salary your car payment ceiling is ${fmtS(paymentCeiling15)}/month. That finances a vehicle around ${fmtS(vehicleAt15)}. Full breakdown here.`}
      canonical={`https://tools.automotivist.com/afford/${slug}`}
      schemas={[faqSchema, articleSchema]}
    >
      {/* Direct answer block */}
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Car Affordability — {salaryLabel} Salary</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px,6vw,58px)', marginBottom: 24 }}>
            How much car can you afford on a <em>{fmtS(salary)} salary?</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">Direct Answer</div>
            <div className="answer-text">
              On a <strong>{fmtS(salary)} salary</strong>, your take-home is roughly <strong>{fmtS(takeHome)}/month</strong>. The 15% rule caps total car costs at <strong>{fmtS(max15)}/month</strong>. After insurance, your car <strong>payment ceiling is {fmtS(paymentCeiling15)}/month</strong> — which finances a vehicle priced around <strong>{fmtS(vehicleAt15)}</strong>.
            </div>
          </div>

          {/* Key numbers grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, background: 'var(--dark-border)', borderRadius: 12, overflow: 'hidden', marginTop: 32 }}>
            {[
              { label: 'Monthly take-home', value: fmtS(takeHome), sub: 'after estimated taxes' },
              { label: '15% ceiling (total car)', value: fmtS(max15), sub: 'payment + insurance combined' },
              { label: 'Payment ceiling (15%)', value: fmtS(paymentCeiling15), sub: 'after $175 insurance estimate' },
              { label: 'Max vehicle price', value: fmtS(vehicleAt15), sub: '60-month loan, 7.5% APR' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--dark-card)', padding: '22px 20px' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '.12em', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,32px)', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: 6 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conservative vs aggressive table */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 28 }}>Conservative vs. <em>aggressive ceiling</em></h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Total car budget</th>
                <th>Payment ceiling</th>
                <th>Max vehicle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: 'var(--green)' }}>10% rule</strong> — conservative</td>
                <td>{fmtS(data.max10)}/mo</td>
                <td>{fmtS(paymentCeiling10)}/mo</td>
                <td>{fmtS(vehicleAt10)}</td>
              </tr>
              <tr className="total">
                <td><strong style={{ color: 'var(--amber)' }}>15% rule</strong> — standard ceiling</td>
                <td>{fmtS(max15)}/mo</td>
                <td>{fmtS(paymentCeiling15)}/mo</td>
                <td>{fmtS(vehicleAt15)}</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
            Vehicle price assumes a 60-month loan at 7.5% APR. Insurance estimated at $175/month. Your actual insurance may vary by state, age, and driving history.
          </p>
        </div>
      </section>

      {/* Opportunity cost */}
      <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 16 }}>
            What that payment costs <em>long-term</em>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.65, marginBottom: 28 }}>
            {fmtS(paymentCeiling15)}/month invested in the S&P 500 at 10.5% historical average returns grows to <strong style={{ color: 'var(--amber)' }}>{fmtS(sp10_15)}</strong> over 10 years. That is the real price of every car decision — not the payment, not the sticker. The opportunity cost.
          </p>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border-2)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>The Automotivist Frame</div>
            <p style={{ fontSize: 16, color: 'var(--light)', lineHeight: 1.7 }}>
              "Your car is the only asset most people own that fights their wealth every single month."
              A {fmtS(salary)} income gives you room around the car. Use it.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ background: '#EDE8E0', paddingTop: 56, paddingBottom: 72 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12, color: 'var(--amber-dark)' }}>Run your numbers</p>
          <h2 className="h-light" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 32 }}>
            Enter your actual payment to get your <em>Ownership Score</em>
          </h2>
          <Calculator preloadPayment={paymentCeiling15} preloadSalary={salary} />
        </div>
      </section>

      {/* FAQs */}
      <section className="section" style={{ background: 'var(--dark-bg)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 40 }}>
            Frequently Asked Questions — <em>{salaryLabel} salary</em>
          </h2>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">{f.question}</div>
              <div className="faq-a">{f.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Other Salary Ranges</p>
          <div className="related-grid">
            {related.map(s => (
              <Link key={s} href={`/afford/${s}-salary`} className="related-card">
                <div className="related-card-label">Car Affordability</div>
                <div className="related-card-title">How much car on a {fmtS(s)} salary?</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Payment ceiling: {fmtS(Math.max(0, Math.round(monthlyTakeHome_static(s) * 0.15) - 175))}/mo</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Static helper for related cards (avoids importing full function on client)
function monthlyTakeHome_static(s) {
  let r;
  if(s<40000)r=0.82;else if(s<60000)r=0.78;else if(s<80000)r=0.75;
  else if(s<100000)r=0.72;else if(s<150000)r=0.70;else r=0.67;
  return Math.round((s*r)/12);
}
