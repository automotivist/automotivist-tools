// pages/index.js — Calculator landing page
import Head from 'next/head';
import Layout from '../components/Layout';
import Calculator from '../components/Calculator';
import Link from 'next/link';

const PROOF_STATS = [
  { value: '$738', label: 'Average US car payment — Experian Q4 2025' },
  { value: '32%',  label: 'Of take-home the average payment consumes' },
  { value: '$47K', label: 'S&P 500 value of $600/mo invested over 10 years' },
];

const FAQS = [
  {
    q: 'What percentage of income should go to a car payment?',
    a: "The 15% rule caps your total car costs — payment plus insurance — at 15% of monthly take-home pay. Most financial planners treat 10% as conservative and 20% as the absolute ceiling. The national average in 2025 sits at 32% of take-home, which is why so many households feel permanently squeezed.",
  },
  {
    q: 'How much car can I afford on a $60,000 salary?',
    a: "On a $60,000 salary your monthly take-home is roughly $3,900. The 15% rule puts your ceiling at about $585/month for payment and insurance combined. If insurance runs $175/month, your actual car payment ceiling is around $410. Most dealerships will try to put you in something $200-300 higher than that.",
  },
  {
    q: 'Is a $700 car payment too high?',
    a: "It depends entirely on income. On a $90,000 salary, $700 is inside the 15% ceiling. On a $60,000 salary, it represents 22% of take-home — well above it. Use the calculator above with your exact numbers. The payment alone is not the answer. Your income is half the equation.",
  },
  {
    q: 'What is the true monthly cost of car ownership beyond the payment?',
    a: "AAA's 2024 driving cost study puts the average all-in monthly cost of a new vehicle at $1,020 — that includes the payment, insurance, fuel, maintenance, registration, and depreciation. The payment is usually only 60-65% of what you actually spend on the car each month.",
  },
  {
    q: 'What does a $600/month car payment cost over 5 years?',
    a: "The payment alone totals $36,000 over 60 months. Add insurance at $175/month and that is $46,500. Add interest on a 7.5% APR loan and the total loan cost rises to around $42,000. The real cost question is the opportunity cost: $600/month invested in the S&P 500 for 5 years at historical returns is worth approximately $46,000.",
  },
  {
    q: 'How do I know if I am overpaying on my car loan?',
    a: "Three signals: your APR is above 7% and your credit score has improved since you bought, you are in a 72-84 month term because the payment felt manageable, or you have negative equity. All three are refinancing signals. The calculator shows your interest total — if it is more than 15% of your principal, it is worth running refi numbers.",
  },
  {
    q: 'Should I pay off my car loan early or invest the extra money?',
    a: "Compare your APR to what you would earn investing. If your car loan is at 7.5% APR and the S&P 500 averages 10.5%, investing wins mathematically. If your loan is at 4% or below, investing almost always wins. If your loan is above 8%, paying it off first is often the better guaranteed return — especially if the loan has no prepayment penalty.",
  },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Home() {
  return (
    <Layout
      title="Car Ownership Score Calculator — Is Your Car Payment Too High?"
      description="Enter your car payment, APR, and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact in 30 seconds."
      canonical="https://tools.automotivist.com"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />
      </Head>

      <section style={{ background: 'var(--dark-bg)', paddingTop: 72, paddingBottom: 0 }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Car Ownership Calculator</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(44px,8vw,72px)', marginBottom: 24 }}>
            The payment is the number<br />
            <em>they sell you.</em>
          </h1>
          <p style={{ fontSize: 'clamp(18px,2.2vw,22px)', color: 'var(--mid)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 48px' }}>
            This is the number that tells the truth -- total cost, income impact, 10-year wealth loss.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'var(--dark-border)', borderRadius: 14, overflow: 'hidden', maxWidth: 660, margin: '0 auto' }}>
            {PROOF_STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--dark-card)', padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,44px)', fontWeight: 800, color: 'var(--amber)', marginBottom: 10, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.45 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 56, background: 'linear-gradient(to bottom, var(--dark-bg), #EDE8E0)', marginTop: 56 }} />
      </section>

      <section style={{ background: '#EDE8E0', paddingBottom: 80 }}>
        <div className="container-sm"><Calculator /></div>
      </section>

      <section className="section" style={{ background: 'var(--dark-bg)' }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Frequently Asked Questions</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(28px,4vw,42px)', marginBottom: 48 }}>
            Frequently Asked Questions — <em>car ownership costs</em>
          </h2>
          <div>
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 20 }}>Payment Analyses</p>
          <div className="related-grid">
            {[
              { slug: '700-per-month-65000-salary', title: '$700/mo on a $65,000 salary', verdictLabel: 'TOO HIGH', verdictClass: 'verdict-high' },
              { slug: '500-per-month-65000-salary', title: '$500/mo on a $65,000 salary', verdictLabel: 'WITHIN RANGE', verdictClass: 'verdict-ok' },
              { slug: '850-per-month-80000-salary', title: '$850/mo on an $80,000 salary', verdictLabel: 'TOO HIGH', verdictClass: 'verdict-high' },
              { slug: '600-per-month-75000-salary', title: '$600/mo on a $75,000 salary', verdictLabel: 'BORDERLINE', verdictClass: 'verdict-border' },
              { slug: '400-per-month-55000-salary', title: '$400/mo on a $55,000 salary', verdictLabel: 'WITHIN RANGE', verdictClass: 'verdict-ok' },
              { slug: '1000-per-month-120000-salary', title: '$1,000/mo on a $120,000 salary', verdictLabel: 'BORDERLINE', verdictClass: 'verdict-border' },
            ].map(p => (
              <Link key={p.slug} href={`/car-payment/${p.slug}`} className="related-card">
                <div className="related-card-label">Payment Analysis</div>
                <div className="related-card-title">{p.title}</div>
                <div className="related-card-verdict">
                  <span className={`verdict ${p.verdictClass}`}>{p.verdictLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
