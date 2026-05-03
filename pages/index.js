// pages/index.js — Calculator landing page
import Layout from '../components/Layout';
import Calculator from '../components/Calculator';
import Link from 'next/link';

const PROOF_STATS = [
  { value: '$738', label: 'Average US car payment — Experian Q4 2025' },
  { value: '32%',  label: 'Of take-home income the average payment consumes' },
  { value: '$47K', label: 'S&P 500 value of a $600/mo payment invested over 10yr' },
];

export default function Home() {
  return (
    <Layout
      title="Car Ownership Score Calculator"
      description="Find out what your car payment is actually costing you"
      canonical="https://tools.automotivist.com"
    >
      <section style={{ background: 'var(--dark-bg)', paddingTop: 64, paddingBottom: 0 }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <h1 className="h-display" style={{ fontSize: 'clamp(36px,7vw,60px)', marginBottom: 20 }}>
            The payment is the number<br inline />
            <em>they sell you.</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--mid)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 40px' }}>
            This is the number that tells the truth -- total cost, income impact, 10-year wealth loss.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--dark-border)', borderRadius: 14, overflow: 'hidden', maxWidth: 640, margin: '0 auto' }}>
            {PROOF_STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--dark-card)', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--amber)', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 48, background: 'linear-gradient(to bottom, var(--dark-bg), #EDE8E0)', marginTop: 48 }} />
      </section>
      <section style={{ background: '#EDE8E0', paddingBottom: 72 }}>
        <div className="container-sm"><Calculator /></div>
      </section>
      <section className="section-sm" style={{ background: 'var(--dark-bg)' }}>
        <div className="container">
          <div className="related-grid">
            {[
              { slug: '700-per-month-65000-salary', title: '$700/mo on a $65,000 salary', verdictLabel: 'TOO HIGH', verdictClass: 'verdict-high' },
              { slug: '500-per-month-65000-salary', title: '$500/mo on a $65,000 salary', verdictLabel: 'WITHIN RANGE', verdictClass: 'verdict-ok' },
              { slug: '850-per-month-80000-salary', title: '$850/mo on an $80,000 salary', verdictLabel: 'TOO HIGH', verdictClass: 'verdict-high' },
            ].map(p => (
              <Link key={p.slug} href={`/car-payment/${p.slug}`} className="related-card">
                <div className="related-card-label">Payment Analysis</div>
                <div className="related-card-title">{p.title}</div>
                <span className={`verdict ${p.verdictClass}`}>{p.verdictLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
