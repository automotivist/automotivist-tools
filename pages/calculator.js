// pages/calculator.js
import Layout from '../components/Layout';
import Calculator from '../components/Calculator';

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Ownership Score Calculator',
  url: 'https://tools.automotivist.com/calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Calculate the true monthly cost of car ownership, your Car Ownership Score, and the 10-year wealth impact of your payment using the 15% rule, AAA driving cost data, and S&P 500 historical returns.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What percentage of income should go to a car payment?', acceptedAnswer: { '@type': 'Answer', text: 'The 15% rule caps your total car costs — payment plus insurance — at 15% of monthly take-home pay. Most financial planners treat 10% as conservative and 20% as the absolute ceiling. The national average in 2025 sits at 32% of take-home, which is why so many households feel permanently squeezed.' } },
    { '@type': 'Question', name: 'How much car can I afford on a $60,000 salary?', acceptedAnswer: { '@type': 'Answer', text: 'On a $60,000 salary your monthly take-home is roughly $3,900. The 15% rule puts your ceiling at about $585/month for payment and insurance combined. If insurance runs $175/month, your actual car payment ceiling is around $410. Most dealerships will try to put you in something $200-300 higher than that.' } },
    { '@type': 'Question', name: 'Is a $700 car payment too high?', acceptedAnswer: { '@type': 'Answer', text: 'It depends entirely on income. On a $90,000 salary, $700 is inside the 15% ceiling. On a $60,000 salary, it represents 22% of take-home — well above it. The payment alone is not the answer. Your income is half the equation.' } },
    { '@type': 'Question', name: 'What is the true monthly cost of car ownership beyond the payment?', acceptedAnswer: { '@type': 'Answer', text: "AAA's 2024 driving cost study puts the average all-in monthly cost of a new vehicle at $1,020 — that includes the payment, insurance, fuel, maintenance, registration, and depreciation. The payment is usually only 60-65% of what you actually spend on the car each month." } },
    { '@type': 'Question', name: 'What does a $600/month car payment cost over 5 years?', acceptedAnswer: { '@type': 'Answer', text: 'The payment alone totals $36,000 over 60 months. Add insurance at $175/month and that is $46,500. Add interest on a 7.5% APR loan and the total loan cost rises to around $42,000. The opportunity cost: $600/month invested in the S&P 500 for 5 years at historical returns is worth approximately $46,000.' } },
    { '@type': 'Question', name: 'How do I know if I am overpaying on my car loan?', acceptedAnswer: { '@type': 'Answer', text: 'Three signals: your APR is above 7% and your credit score has improved since you bought, you are in a 72-84 month term because the payment felt manageable, or you have negative equity. All three are refinancing signals.' } },
    { '@type': 'Question', name: 'Should I pay off my car loan early or invest the extra money?', acceptedAnswer: { '@type': 'Answer', text: 'Compare your APR to what you would earn investing. If your car loan is at 7.5% APR and the S&P 500 averages 10.5%, investing wins mathematically. If your loan is at 4% or below, investing almost always wins. If your loan is above 8%, paying it off first is often the better guaranteed return.' } },
  ],
};

export default function CalculatorPage() {
  return (
    <Layout
      title="Car Ownership Score Calculator — Free Tool"
      description="What is your car actually costing you? Enter your payment and income to get your Ownership Score, true monthly cost, and 10-year wealth impact."
      canonical="https://tools.automotivist.com/calculator"
      schemas={[webAppSchema, faqSchema]}
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
