// pages/guides/car-payment-guide.js
// Hub page: The 15% car payment rule - authoritative guide
// Links to all /afford/ salary pages and top /car-payment/ pages
import Layout from '../../components/Layout';
import NewsletterCapture from '../../components/NewsletterCapture';
import Link from 'next/link';
import { AFFORD_SALARIES, fmtDollar, monthlyTakeHome, threshold15, DATA_UPDATED, AFFORD_ANCHOR_TEXT } from '../../lib/calculations';
import { VEHICLES } from '../../lib/vehicles-data';
import { STORIES } from '../../lib/stories-data';
import { IMAGES, unsplashUrl, fallbackUrl } from '../../lib/page-images';

const SAMPLE_SALARIES = [40000,50000,60000,75000,90000,100000,120000,150000];

const FAQS = [
  { q: 'What is the 15% car payment rule?', a: 'The 15% rule states that your total monthly car costs - payment plus insurance - should not exceed 15% of your gross monthly income. On a $75,000 salary, that is about $937/month for payment and insurance combined. If insurance costs $175/month, your payment ceiling is around $762/month.' },
  { q: 'Is the 15% rule based on gross or take-home income?', a: 'Most versions of the rule use take-home (after-tax) income, which is more conservative. On a $75,000 salary, your take-home is roughly $5,250/month. 15% of that is $787/month - the ceiling for payment plus insurance combined.' },
  { q: 'What happens if you go over the 15% rule?', a: 'Nothing breaks immediately, but the math works against you. Every dollar above the ceiling is a dollar that cannot go toward housing, retirement, or savings. Over a 5-year loan, $100/month over the ceiling is $6,000 you could not invest. At S&P 500 historical returns, that $6,000 compounds to over $12,000 in 10 years.' },
  { q: 'Should I use the 10% or 15% rule for car payments?', a: 'Use 10% if you have high-interest debt, are behind on retirement savings, or live in a high cost-of-living city. Use 15% as the absolute ceiling if your finances are otherwise healthy. The 15% ceiling exists to protect every other financial priority - not to tell you what to spend.' },
  { q: 'How much car can I afford on a $60,000 salary?', a: 'On $60,000/year, monthly take-home is roughly $3,900. The 15% ceiling is $585/month for payment and insurance combined. After insurance, your payment ceiling is around $410/month - which finances a vehicle priced near $21,000 at 7.5% APR over 60 months.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function CarPaymentGuide() {
  return (
    <Layout
      title="The 15% Rule: What % of Income Should Go to a Car (2026)"
      description="Most Americans spend 32% of take-home on a car. The 15% rule shows what you should actually spend by income. See the math for your salary in 30 seconds."
      canonical="https://tools.automotivist.com/guides/car-payment-guide"
      schemas={[faqSchema]}
    >
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Complete Guide</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px,6vw,58px)', marginBottom: 24 }}>
            The 15% car payment rule - <em>what it actually means</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">The Rule</div>
            <div className="answer-text">
              Your total monthly car costs - <strong>payment plus insurance</strong> - should not exceed <strong>15% of your monthly take-home pay</strong>. Most people apply this to the payment alone and wonder why they still feel squeezed. The payment is only part of the cost.
            </div>
          </div>
          <img
            src={unsplashUrl(IMAGES.carPaymentGuide.id, 1200, 480)}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl(1200, 480); }}
            alt={IMAGES.carPaymentGuide.alt}
            style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginTop: 32, display: 'block' }}
            loading="eager"
          />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 12 }}>
            DATA UPDATED: {DATA_UPDATED} — Experian, Bankrate
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
            The 15% rule is not about the car. It is about everything the car cannot be. Housing, retirement, savings, and debt payoff all compete for the same take-home. A car payment above 15% does not just stretch a budget - it structurally prevents wealth building at the margins that compound the most.
          </p>
          <p style={{ fontSize: 17, color: 'var(--mid)', lineHeight: 1.75 }}>
            The average American car payment hit $738/month in Q4 2025 (Experian). On a median household income of $80,000, that is 23% of take-home. The rule is broken at scale - which is why most households feel permanently squeezed despite having jobs and income growth.
          </p>
        </div>
      </section>

      {/* Personal perspective section */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 20 }}>
            Why I built this calculator
          </h2>
          <div style={{ borderLeft: '3px solid var(--amber)', paddingLeft: 24 }}>
            <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 16 }}>
              My first real car was a G35 coupe. I financed it to impress people. The people I was trying to impress do not remember the car. The payment lasted 60 months. The opportunity cost - what that money would have been worth invested instead - is something I calculated years later and wish I had run before I signed.
            </p>
            <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 16 }}>
              The 15% rule was not something I learned from a financial advisor. I learned it by paying off a Porsche Cayenne early and watching what happened to my cash flow afterward. The freedom created by a car payment disappearing from your budget is disproportionate to the dollar amount. It changes what is possible.
            </p>
            <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8 }}>
              This guide exists because the dealership does not give you a ceiling. They give you a monthly payment that clears your checking account. Those are not the same number. Someone needs to give you the ceiling. That is what this is.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter capture */}
        <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
          <div className="container-sm">
            <NewsletterCapture context="guides" slug="car-payment-guide" />
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

      {/* Affordability by salary - spoke links */}
      <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 24 }}>
            Car affordability - <em>by salary</em>
          </h2>
          <div className="related-grid">
            {AFFORD_SALARIES.map(s => (
              <Link key={s} href={`/afford/${s}-salary`} className="related-card">
                <div className="related-card-label">Affordability Analysis</div>
                <div className="related-card-title">{AFFORD_ANCHOR_TEXT[s] || `How much car on ${fmtDollar(s)}?`}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Payment ceiling: {fmtDollar(Math.max(0, threshold15(s) - 175))}/mo</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Payment analysis pages — top combinations by search volume */}
      <section className="section-sm" style={{ borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 8 }}>Payment analysis</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24 }}>Is your specific payment too high? Find your combination.</p>
          <div className="related-grid">
            {[
              [400,50000],[400,60000],[400,75000],
              [500,60000],[500,75000],[500,90000],
              [600,65000],[600,75000],[600,90000],
              [700,75000],[700,90000],[700,100000],
              [800,90000],[800,100000],[800,120000],
              [900,100000],[900,120000],[1000,120000],
            ].map(([p,s]) => (
              <Link key={`${p}-${s}`} href={`/car-payment/${p}-per-month-${s}-salary`} className="related-card">
                <div className="related-card-label">Payment Analysis</div>
                <div className="related-card-title">{fmtDollar(p)}/mo on {fmtDollar(s)}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                  {Math.round(p / (s * 0.72 / 12) * 100)}% of take-home
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle true cost pages */}
      <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 8 }}>True monthly cost by vehicle</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24 }}>The payment is only part of what each vehicle costs per month.</p>
          <div className="related-grid">
            {VEHICLES.slice(0, 18).map(v => (
              <Link key={v.slug} href={`/cars/${v.slug}`} className="related-card">
                <div className="related-card-label">True Cost</div>
                <div className="related-card-title">{v.year} {v.make} {v.model}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>MSRP from {fmtDollar(v.msrp)}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stories — gives Googlebot crawl path to all 10 story pages from this indexed hub */}
      <section className="section-sm" style={{ borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 8 }}>From the Automotivist</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 24 }}>First-person accounts of what cars actually cost — and what getting the math right changes.</p>
          <div className="related-grid">
            {STORIES.map(s => (
              <Link key={s.slug} href={`/stories/${s.slug}`} className="related-card">
                <div className="related-card-label">{s.category}</div>
                <div className="related-card-title">{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{s.readTime} read</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA */}
      <section style={{ background: 'var(--amber)', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#17140D', marginBottom: 12 }}>
            Get your Ownership Score in 30 seconds
          </div>
          <p style={{ fontSize: 15, color: '#5a3e00', marginBottom: 24 }}>Enter your payment and income. See your score, your true monthly cost, and what it costs you over 10 years.</p>
          <Link href="/calculator" style={{ display: 'inline-block', background: '#17140D', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 8, textDecoration: 'none' }}>
            Free Calculator →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
