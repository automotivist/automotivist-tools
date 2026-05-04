// pages/calculator.js
import Layout from '../components/Layout';
import Calculator from '../components/Calculator';

export default function CalculatorPage() {
  return (
    <Layout
      title="Car Ownership Score Calculator — Free Tool"
      description="What is your car actually costing you? Enter your payment and income to get your Ownership Score, true monthly cost, and 10-year wealth impact."
      canonical="https://tools.automotivist.com/calculator"
    >
      {/* Subscribe banner */}
      <div style={{ background: 'var(--amber)', padding: '12px 24px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#080808', letterSpacing: '.02em' }}>
          The car math no one shows you — every Friday.{' '}
          <a
            href="https://automotivist.beehiiv.com/subscribe"
            target="_blank"
            rel="noopener"
            style={{ color: '#080808', textDecoration: 'underline', fontWeight: 800 }}
          >
            Subscribe free →
          </a>
        </span>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--dark-bg)', paddingTop: 52, paddingBottom: 0 }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Free Tool</div>
          <h1 className="h-display" style={{ fontSize: 'clamp(38px,7vw,64px)', marginBottom: 18 }}>
            What is your car <em>actually costing you?</em>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--mid)', maxWidth: 480, margin: '0 auto' }}>
            Enter your payment, APR, and income. Get your Ownership Score in 30 seconds.
          </p>
        </div>
        <div style={{ height: 48, background: 'linear-gradient(to bottom, var(--dark-bg), #EDE8E0)', marginTop: 40 }} />
      </div>

      {/* Calculator */}
      <div style={{ background: '#EDE8E0', paddingBottom: 80 }}>
        <div className="container-sm">
          <Calculator slug="calculator" />
        </div>
      </div>
    </Layout>
  );
}
