// pages/guides/car-payment-guide.js
// Hub page: The 15% car payment rule — authoritative guide
// Links to all /afford/ salary pages and top /car-payment/ pages
import Layout from '../../components/Layout';
import Link from 'next/link';
import { AFFORD_SALARIES, fmtDollar, monthlyTakeHome, threshold15 } from '../../lib/calculations';
import { IMAGES, unsplashUrl } from '../../lib/page-images';

const SAMPLE_SALARIES = [40000,50000,60000,75000,90000,100000,120000,150000];

const FAQS = [
  { q: 'What is the 15% car payment rule?', a: 'The 15% rule states that your total monthly car costs — payment plus insurance — should not exceed 15% of your gross monthly income. On a $75,000 salary, that is about $937/month for payment and insurance combined. If insurance costs $175/month, your payment ceiling is around $762/month.' },
  { q: 'Is the 15% rule based on gross or take-home income?', a: 'Most versions of the rule use take-home (after-tax) income, which is more conservative. On a $75,000 salary, your take-home is roughly $5,250/month. 15% of that is $787/month — the ceiling for payment plus insurance combined.' },
  { q: 'What happens if you go over the 15% rule?', a: 'Nothing breaks immediately, but the math works against you. Every dollar above the ceiling is a dollar that cannot go toward housing, retirement, or savings. Over a 5-year loan, $100/month over the ceiling is $6,000 you could not invest. At S&P 500 historical returns, that $6,000 compounds to over $12,000 in 10 years.' },
  { q: 'Should I use the 10% or 15% rule for car payments?', a: 'Use 10% if you have high-interest debt, are behind on retirement savings, or live in a high cost-of-living city. Use 15% as the absolute ceiling if your finances are otherwise healthy. The 15% ceiling exists to protect every other financial priority — not to tell you what to spend.' },
  { q: 'How much car can I afford on a $60,000 salary?', a: 'On $60,000/year, monthly take-home is roughly $3,900. The 15% ceiling is $585/month for payment and insurance combined. After insurance, your payment ceiling is around $410/month — which finances a vehicle priced near $21,000 at 7.5% APR over 60 months.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function CarPaymentGuide() {
  return (
    <Layout
      title="The 15% Car Payment Rule — Complete Guide by Salary"
      description="The 15% rule: your car payment should not exceed 15% of monthly take-home. The national average is 32%. Exact ceilings for every salary from $40K to $200K."
      canonical="https://tools.automotivist.com/guides/car-payment-guide"
      schemas={[faqSchema]}
    >
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Complete Guide</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px,6vw,58px)', marginBottom: 24 }}>
            The 15% car payment rule — <em>what it actually means</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">The Rule</div>
            <div className="answer-text">
              Your total monthly car costs — <strong>payment plus insurance</strong> — should not exceed <strong>15% of your monthly take-home pay</strong>. Most people apply this to the payment alone and wonder why they still feel squeezed. The payment is only part of the cost.
            </div>
          </div>
          <img
            src={unsplashUrl(IMAGES.carPaymentGuide.id, 1200, 480)}
            alt={IMAGES.carPaymentGuide.alt}
            style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginTop: 32, display: 'block' }}
            loading="eager"
          />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 12 }}>
            DATA UPDATED: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — Experian Q4 2025, Bankrate Q1 2026
          </div>
        </div>
      </section>

      {/* Salary table */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 24 }}>
            Payment ceiling <em>by salary</em>
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Annual salary</th>
                <th>Monthly take-home</th>
                <th>15% ceiling (total)</th>
                <th>Payment ceiling (after $175 ins.)</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SALARIES.map(s => (
                <tr key={s}>
                  <td>
                    <Link href={`/afford/${s}-salary`} style={{ color: 'var(--amber)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      {fmtDollar(s)}
                    </Link>
                  </td>
                  <td>{fmtDollar(monthlyTakeHome(s))}</td>
                  <td>{fmtDollar(threshold15(s))}</td>
                  <td style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{fmtDollar(Math.max(0, threshold15(s) - 175))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why it matters */}
      <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 20 }}>
            Why the ceiling <em>exists</em>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.75, marginBottom: 16 }}>
            The 15% rule is not about the car. It is about everything the car cannot be. Housing, retirement, savings, and debt payoff all compete for the same take-home. A car payment above 15% does not just stretch a budget — it structurally prevents wealth building at the margins that compound the most.
          </p>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.75 }}>
            The average American car payment hit $738/month in Q4 2025 (Experian). On a median household income of $80,000, that is 23% of take-home. The rule is broken at scale — which is why most households feel permanently squeezed despite having jobs and income growth.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 40 }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Affordability by salary — spoke links */}
      <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 24 }}>
            Car affordability — <em>by salary</em>
          </h2>
          <div className="related-grid">
            {AFFORD_SALARIES.map(s => (
              <Link key={s} href={`/afford/${s}-salary`} className="related-card">
                <div className="related-card-label">Affordability Analysis</div>
                <div className="related-card-title">How much car on {fmtDollar(s)}?</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Payment ceiling: {fmtDollar(Math.max(0, threshold15(s) - 175))}/mo</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
