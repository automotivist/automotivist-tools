// pages/guides/car-loan-refinancing.js
// Hub: When and how to refinance a car loan — links to all /refinance/ pages
import Layout from '../../components/Layout';
import Link from 'next/link';
import { REFI_COMBOS } from '../../lib/calculations';

const FAQS = [
  { q: 'When should I refinance my car loan?', a: 'Three conditions make refinancing worth it: (1) your current APR is at least 1.5-2% above current market rates, (2) you have more than 12 months left on your loan, and (3) you are not already in the final year of repayment where most principal is paid. If all three apply, refinancing typically saves $40-100/month on a $20-25K balance.' },
  { q: 'How much does refinancing a car loan save?', a: 'A 2-point rate drop (e.g., 9% to 7%) on a $25,000 balance with 48 months remaining saves approximately $45/month and $2,160 over the remaining term. A 3-point drop saves roughly $65/month. The savings scale directly with balance size and rate differential.' },
  { q: 'Does refinancing a car loan hurt your credit?', a: 'Refinancing triggers a hard inquiry, which typically drops your score 5-10 points temporarily. This is minor and recovers within a few months. The benefit — lower payment, lower total interest — almost always outweighs the short-term credit impact if you qualify for a meaningfully lower rate.' },
  { q: 'What credit score do I need to refinance a car loan?', a: 'Most lenders require 600+ to refinance. The best rates (under 6%) require 720+. If your score has improved since your original purchase — even from 620 to 680 — you may qualify for a 2-3 point better rate, which can save thousands over the remaining term.' },
  { q: 'Can I refinance a car loan if I owe more than it is worth?', a: 'Technically yes, but few lenders approve loans with a loan-to-value ratio above 125%. If you are significantly underwater, refinancing may not be available. Your priority in that case should be paying down the balance aggressively to get above water before the car deteriorates further.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function RefiGuide() {
  return (
    <Layout
      title="Car Loan Refinancing Guide — When to Refi and How Much You Save"
      description="Refinancing from 10% to 7% saves $45-65/month on a $25K balance — with no fees and 24-hour approval. When to refinance, how much you save, and how to qualify."
      canonical="https://tools.automotivist.com/guides/car-loan-refinancing"
      schemas={[faqSchema]}
    >
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Complete Guide</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(34px,6vw,56px)', marginBottom: 24 }}>
            Car loan refinancing — <em>the math on whether it is worth it</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">The Case For It</div>
            <div className="answer-text">
              If your APR is above current market rates and you have more than 12 months left, refinancing a car loan costs nothing and takes 24 hours. A <strong>2-point rate drop saves $40-60/month</strong> on a $25,000 balance — that is $500-700/year back in your pocket with no lifestyle change required.
            </div>
          </div>
        </div>
      </section>

      {/* When to refi */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 24 }}>
            The 3 signals that mean <em>refi now</em>
          </h2>
          {[
            { signal: 'Your APR is 2+ points above current market', detail: 'Bankrate average for good credit was 6.8% in Q1 2026. If you bought at 9%, 10%, or above — especially in 2022-2023 when rates spiked — you likely qualify for a lower rate today.' },
            { signal: 'Your credit score has improved since purchase', detail: 'Every 20-40 point improvement in your credit score typically unlocks a better rate tier. If you bought at 640 and are now at 700, you may qualify for rates 2-3 points lower.' },
            { signal: 'You have more than 12 months remaining', detail: 'Refinancing in the final year saves less because most of the interest is already paid. The earlier in your loan term you refinance, the more interest you avoid.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--dark-border)', padding: '18px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--amber)', marginBottom: 8 }}>{i + 1}. {item.signal}</div>
              <div style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.65 }}>{item.detail}</div>
            </div>
          ))}
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

      {/* Refi spoke links */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: 24 }}>
            Savings by <em>rate combination</em>
          </h2>
          <div className="related-grid">
            {(REFI_COMBOS || []).slice(0, 12).map(c => (
              <Link key={`${c.oldRate}-${c.newRate}`} href={`/refinance/${c.oldRate}-percent-to-${c.newRate}-percent`} className="related-card">
                <div className="related-card-label">Refinance Analysis</div>
                <div className="related-card-title">{c.oldRate}% → {c.newRate}%</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>How much you save</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link href="/guides/true-cost-of-ownership" style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>
              → See the full true cost of ownership
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
