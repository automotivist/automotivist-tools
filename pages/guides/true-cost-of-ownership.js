// pages/guides/true-cost-of-ownership.js
// Hub: True cost of car ownership — links to all /cars/ pages
import Layout from '../../components/Layout';
import NewsletterCapture from '../../components/NewsletterCapture';
import Link from 'next/link';
import { VEHICLES, vehicleTrueCost } from '../../lib/vehicles-data';
import { IMAGES, unsplashUrl, fallbackUrl } from '../../lib/page-images';

const COST_COMPONENTS = [
  { name: 'Loan payment', note: 'What the dealership quotes. 60% of the real number.', monthly: null },
  { name: 'Insurance', note: 'Full coverage required on a financed vehicle. $130–$380/month depending on vehicle and state.', monthly: null },
  { name: 'Fuel', note: '15,000 miles/year, 28 MPG average, $3.50/gallon. $125–$250/month.', monthly: null },
  { name: 'Maintenance & repairs', note: 'AAA 2024 data: $90–$185/month depending on vehicle age and type.', monthly: null },
  { name: 'Registration & fees', note: 'National average $180/year = $15/month. Wide state variation.', monthly: null },
  { name: 'Depreciation', note: 'New vehicles lose 15–20% of value in year one. The largest hidden cost.', monthly: null },
];

const FAQS = [
  { q: 'What is the true monthly cost of owning a car?', a: 'AAA\'s 2024 driving cost study puts the average all-in monthly cost of a new vehicle at $1,020 — covering the loan payment, insurance, fuel, maintenance, registration, and depreciation. The payment alone is typically 55-65% of the actual monthly cost.' },
  { q: 'How much does car depreciation cost per month?', a: 'A new car loses roughly 15-20% of its value in the first year — about $4,500 on a $30,000 vehicle. That is $375/month in year one alone, purely from the clock ticking. Depreciation is the single largest cost of new car ownership that never appears on a payment statement.' },
  { q: 'Is it cheaper to own a used car vs a new car?', a: 'Yes, in almost every case. A 3-year-old vehicle has absorbed the steepest depreciation curve, often saving $150-250/month in depreciation alone compared to new. Maintenance costs are somewhat higher but rarely offset the depreciation savings for vehicles under 100,000 miles.' },
  { q: 'What is the cheapest car to own long-term?', a: 'Toyota and Honda consistently top total cost of ownership rankings due to lower maintenance costs and slower depreciation. A paid-off Toyota Camry or Honda Civic at 80,000 miles costs $400-600/month all-in versus $900-1,200/month for the equivalent new vehicle with a payment.' },
  { q: 'Does car insurance count toward the 15% rule?', a: 'Yes. The 15% rule applies to total car costs including insurance. If insurance is $175/month and your ceiling is $600/month, your actual payment ceiling is $425/month — not $600. This is one of the most common misapplications of the rule.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

const featuredVehicles = VEHICLES.slice(0, 12);

export default function TrueCostGuide() {
  return (
    <Layout
      title="True Cost of Car Ownership — What Your Car Actually Costs Per Month"
      description="The average car costs $1,020/month all-in. The average payment is $738. That $282 gap is what dealers never show you. Full breakdown for 35 popular vehicles."
      canonical="https://tools.automotivist.com/guides/true-cost-of-ownership"
      schemas={[faqSchema]}
    >
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Complete Guide</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(34px,6vw,56px)', marginBottom: 24 }}>
            True cost of car ownership — <em>what the payment hides</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">The Real Number</div>
            <div className="answer-text">
              The average American spends <strong>$1,020/month</strong> to own a new car (AAA 2024). The average monthly payment is <strong>$738</strong>. That $282 gap — insurance, fuel, maintenance, fees, depreciation — is what the payment number was designed to make you forget.
            </div>
          </div>
          <img
            src={unsplashUrl(IMAGES.trueCostGuide.id, 1200, 480)}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl(1200, 480); }}
            alt={IMAGES.trueCostGuide.alt}
            style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginTop: 32, display: 'block' }}
            loading="eager"
          />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 12 }}>
            DATA UPDATED: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — AAA Driving Costs 2024, KBB/Cox Automotive
          </div>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 24 }}>
            The 6 cost components <em>every owner pays</em>
          </h2>
          {COST_COMPONENTS.map((c, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--dark-border)', padding: '18px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.6 }}>{c.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter capture */}
        <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
          <div className="container-sm">
            <NewsletterCapture context="guides" slug="true-cost-of-ownership" />
          </div>
        </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
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

      {/* Vehicle spoke links */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 24 }}>
            True cost by <em>vehicle</em>
          </h2>
          <div className="related-grid">
            {featuredVehicles.map(v => {
              const c = vehicleTrueCost(v);
              return (
                <Link key={v.slug} href={`/cars/${v.slug}`} className="related-card">
                  <div className="related-card-label">True Cost</div>
                  <div className="related-card-title">{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>${Math.round(c.trueMo).toLocaleString()}/mo all-in</div>
                </Link>
              );
            })}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/guides/car-payment-guide" style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>
              → See the 15% rule by salary
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
