// pages/refinance/[slug].js
// "Refinancing a car loan from X% to Y%" — 18 pages
import Layout from '../../components/Layout';
import Calculator from '../../components/Calculator';
import Link from 'next/link';
import {
  getAllRefiPaths, parseRefiSlug, refiData, refiFAQs, refiSavings, REFI_COMBOS
} from '../../lib/calculations';

export async function getStaticPaths() {
  return { paths: getAllRefiPaths(), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const parsed = parseRefiSlug(params.slug);
  if (!parsed) return { notFound: true };
  const data = refiData(parsed.oldRate, parsed.newRate);
  const faqs = refiFAQs(parsed.oldRate, parsed.newRate);
  return { props: { data, faqs, slug: params.slug, oldRate: parsed.oldRate, newRate: parsed.newRate } };
}

export default function RefinancePage({ data, faqs, slug, oldRate, newRate }) {
  const fmtS = n => '$' + Math.round(n).toLocaleString();
  const rateDiff = oldRate - newRate;
  const sample25k = data.rows.find(r => r.balance === 25000) || data.rows[3];
  const sample20k = data.rows.find(r => r.balance === 20000) || data.rows[2];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const relatedCombos = REFI_COMBOS
    .filter(c => c.oldRate === oldRate && c.newRate !== newRate)
    .slice(0, 2)
    .concat(REFI_COMBOS.filter(c => c.newRate === newRate && c.oldRate !== oldRate).slice(0, 2))
    .slice(0, 4);

  return (
    <Layout
      title={`Refinance Car Loan from ${oldRate}% to ${newRate}% — How Much Do You Save?`}
      description={`Dropping from ${oldRate}% to ${newRate}% saves ${fmtS(sample25k.monthlySaving)}/month and ${fmtS(sample25k.totalSaving)} total on a $25,000 balance. No fees to refinance. See the full savings breakdown by loan amount.`}
      canonical={`https://tools.automotivist.com/refinance/${slug}`}
      schemas={[faqSchema]}
    >
      {/* Direct answer */}
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Car Loan Refinancing — {oldRate}% to {newRate}%</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(34px,6vw,56px)', marginBottom: 24 }}>
            Refinancing from <em>{oldRate}% to {newRate}%</em> — what you actually save
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">Direct Answer</div>
            <div className="answer-text">
              Dropping from <strong>{oldRate}%</strong> to <strong>{newRate}%</strong> on a $25,000 balance with 60 months remaining saves <strong>{fmtS(sample25k.monthlySaving)}/month</strong> and <strong>{fmtS(sample25k.totalSaving)} total</strong>. Refinancing costs $0-300 in fees — you break even in roughly <strong>{data.breakeven} months</strong>.
            </div>
          </div>

          {/* Savings table by balance */}
          <h2 className="h-display" style={{ fontSize: 'clamp(18px,3vw,26px)', marginTop: 48, marginBottom: 24 }}>
            Monthly savings by <em>loan balance</em>
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Loan Balance</th>
                <th>Old payment ({oldRate}%)</th>
                <th>New payment ({newRate}%)</th>
                <th>Monthly savings</th>
                <th>Total savings (60mo)</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i} className={row.balance === 25000 ? 'total' : ''}>
                  <td>{fmtS(row.balance)}</td>
                  <td>{fmtS(row.oldPmt)}</td>
                  <td>{fmtS(row.newPmt)}</td>
                  <td style={{ color: 'var(--green)' }}>{fmtS(row.monthlySaving)}/mo</td>
                  <td>{fmtS(row.totalSaving)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12 }}>60-month remaining term assumed. Actual savings depend on your balance and remaining months.</p>
        </div>
      </section>

      {/* Is it worth it analysis */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 24 }}>
            Is a {rateDiff}% rate drop <em>worth the paperwork?</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: 'var(--dark-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
            {[
              { label: 'Monthly savings (25K balance)', value: fmtS(sample25k.monthlySaving) },
              { label: 'Total savings over loan', value: fmtS(sample25k.totalSaving) },
              { label: 'Breakeven point', value: data.breakeven + ' months' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--dark-bg)', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: 8 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, color: 'var(--light)', lineHeight: 1.7 }}>
            At {rateDiff}%, this is a refinance worth doing. Most lenders charge no fees on auto refinancing. Free application, 24-hour approval, and {fmtS(sample25k.monthlySaving)} back in your pocket every month. The only reason not to: if you are within 12 months of paying the loan off.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ background: '#EDE8E0', paddingTop: 56, paddingBottom: 72 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12, color: 'var(--amber-dark)' }}>Run your numbers</p>
          <h2 className="h-light" style={{ fontSize: 'clamp(20px,3vw,30px)', marginBottom: 32 }}>
            See your full <em>Ownership Score</em> with the new rate
          </h2>
          <Calculator preloadApr={newRate} />
        </div>
      </section>

      {/* FAQs */}
      <section className="section" style={{ background: 'var(--dark-bg)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 40 }}>
            Frequently Asked Questions — <em>{oldRate}% to {newRate}%</em>
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
          <p className="eyebrow" style={{ marginBottom: 16 }}>Related Rate Comparisons</p>
          <div className="related-grid">
            {relatedCombos.map(c => (
              <Link key={`${c.oldRate}-${c.newRate}`} href={`/refinance/${c.oldRate}-percent-to-${c.newRate}-percent`} className="related-card">
                <div className="related-card-label">Refinance Analysis</div>
                <div className="related-card-title">{c.oldRate}% to {c.newRate}% — how much you save</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
