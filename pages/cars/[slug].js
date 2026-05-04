// pages/cars/[slug].js — Tier 3: vehicle true-cost pages
// Targets: "2025 Toyota Camry monthly payment", "true cost of owning Ford F-150"
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Calculator from '../../components/Calculator';
import { VEHICLES, getVehicle, vehicleMonthlyPayment, vehicleTrueMonthlyCost, vehicleFAQs, getAllVehiclePaths } from '../../lib/vehicles';
import { fmtDollar, fmtK, sp500_10yr } from '../../lib/calculations';

export default function VehiclePage({ vehicle, costs, faqs }) {
  const v = vehicle;
  const incomeNeeded = Math.round((costs.payment + v.insurance) / 0.15 * 12 / 1000) * 1000;
  const sp10 = Math.round(costs.payment * ((Math.pow(1.00875, 120) - 1) / 0.00875));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } }))
  };

  const related = VEHICLES.filter(r => r.slug !== v.slug && r.category === v.category).slice(0, 4);

  return (
    <Layout
      title={`${v.year} ${v.make} ${v.model}: True Monthly Cost of Ownership (2025)`}
      description={`The ${v.year} ${v.make} ${v.model} has a $${costs.payment.toLocaleString()}/month payment but costs $${costs.total.toLocaleString()}/month all-in. See the full ownership cost breakdown.`}
      canonical={`https://tools.automotivist.com/cars/${v.slug}`}
    >
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <section style={{ background: 'var(--dark-bg)', padding: '56px 0 0' }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 16 }}>{v.year} {v.category} — True Cost Analysis</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(34px,6vw,58px)', marginBottom: 28 }}>
            {v.year} {v.make} {v.model}<br />
            <em>True monthly cost</em>
          </h1>
          <div className="answer-block" style={{ marginBottom: 40 }}>
            <div className="answer-verdict">DIRECT ANSWER</div>
            <div className="answer-text">
              The <strong>{v.year} {v.make} {v.model}</strong> has an MSRP of <strong>{fmtDollar(v.price)}</strong>.
              At 7.5% APR over 60 months with 10% down, the monthly payment is <strong>{fmtDollar(costs.payment)}</strong>.
              Add insurance, fuel, and maintenance and the true all-in monthly cost is <strong>{fmtDollar(costs.total)}</strong>.
              That requires an income of roughly <strong>{fmtDollar(incomeNeeded)}/year</strong> to stay inside the 15% rule.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'var(--dark-border)', borderRadius: 14, overflow: 'hidden', marginBottom: 48 }}>
            {[
              { label: 'Monthly payment', value: fmtDollar(costs.payment), sub: '60mo, 7.5% APR, 10% down' },
              { label: 'True monthly cost', value: fmtDollar(costs.total), sub: 'payment + ins + fuel + maint' },
              { label: 'Income needed', value: fmtDollar(incomeNeeded), sub: 'to stay inside 15% rule' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--dark-card)', padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, color: 'var(--amber)', marginBottom: 8, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--mid)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 48, background: 'linear-gradient(to bottom, var(--dark-bg), #EDE8E0)' }} />
      </section>

      {/* Calculator */}
      <section style={{ background: '#EDE8E0', paddingBottom: 72 }}>
        <div className="container-sm">
          <h2 className="h-light" style={{ fontSize: 'clamp(20px,3vw,30px)', marginBottom: 8, paddingTop: 8 }}>Run your numbers</h2>
          <p style={{ color: 'var(--light-muted)', fontSize: 16, marginBottom: 28 }}>Pre-loaded with the {v.model} estimated payment. Adjust to your actual terms.</p>
          <Calculator preloadPayment={costs.payment} />
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="section" style={{ background: 'var(--dark-bg)' }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Cost breakdown</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3vw,34px)', marginBottom: 32 }}>
            What the {v.model} <em>actually costs</em> per month
          </h2>
          <table className="data-table" style={{ marginBottom: 40 }}>
            <thead><tr><th>Cost Item</th><th>Source</th><th>Monthly</th></tr></thead>
            <tbody>
              <tr><td>Loan payment</td><td>7.5% APR, 60mo, 10% down on {fmtDollar(v.price)}</td><td>{fmtDollar(costs.payment)}</td></tr>
              <tr><td>Insurance</td><td>Estimated avg for {v.category}</td><td>{fmtDollar(v.insurance)}</td></tr>
              <tr><td>Fuel</td><td>{v.mpge ? `${v.mpge}MPGe, electricity ~$0.035/mi` : `${v.mpg}mpg, $3.50/gal, 15K mi/yr`}</td><td>{fmtDollar(costs.fuel)}</td></tr>
              <tr><td>Maintenance</td><td>AAA 2024 data, {v.mpge ? 'EV adjusted' : 'gas vehicle avg'}</td><td>{fmtDollar(costs.maintenance)}</td></tr>
              <tr className="total"><td>True monthly total</td><td>Payment + all operating costs</td><td>{fmtDollar(costs.total)}</td></tr>
            </tbody>
          </table>

          <div className="answer-block">
            <div className="answer-verdict">OPPORTUNITY COST</div>
            <div className="answer-text">
              Your <strong>{fmtDollar(costs.payment)}/month</strong> payment invested in the S&amp;P 500 for 10 years
              grows to approximately <strong>{fmtDollar(sp10)}</strong> at historical average returns.
              That is the wealth cost of this vehicle. Know it before you sign.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 16 }}>FAQ</p>
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3vw,34px)', marginBottom: 40 }}>
            {v.year} {v.make} {v.model} — <em>ownership questions</em>
          </h2>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">{f.question}</div>
              <div className="faq-a">{f.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Related vehicles */}
      {related.length > 0 && (
        <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
          <div className="container">
            <p className="eyebrow" style={{ marginBottom: 20 }}>Compare {v.category} vehicles</p>
            <div className="related-grid">
              {related.map(r => {
                const rc = vehicleTrueMonthlyCost(r);
                return (
                  <Link key={r.slug} href={`/cars/${r.slug}`} className="related-card">
                    <div className="related-card-label">{r.year} {r.category}</div>
                    <div className="related-card-title">{r.make} {r.model}</div>
                    <div style={{ fontSize: 13, color: 'var(--amber)', marginTop: 6 }}>
                      {fmtDollar(rc.payment)}/mo payment
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  return { paths: getAllVehiclePaths(), fallback: false };
}

export async function getStaticProps({ params }) {
  const vehicle = getVehicle(params.slug);
  if (!vehicle) return { notFound: true };
  const costs = vehicleTrueMonthlyCost(vehicle);
  const faqs = vehicleFAQs(vehicle);
  return { props: { vehicle, costs, faqs } };
}
