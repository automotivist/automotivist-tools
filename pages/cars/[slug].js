// pages/cars/[slug].js
// "2025 [Make] [Model] true cost — what it really costs per month"
// 35 pages at launch, infinitely expandable via vehicles-data.js
import Head from 'next/head';
import Layout from '../../components/Layout';
import NewsletterCapture from '../../components/NewsletterCapture';
import Calculator from '../../components/Calculator';
import Link from 'next/link';
import { VEHICLES, getVehicle, vehicleTrueCost, vehicleFAQs, vehicleEditorial } from '../../lib/vehicles-data';
import { getVehicleImage, unsplashUrl, fallbackUrl } from '../../lib/page-images';

export async function getStaticPaths() {
  return {
    paths: VEHICLES.map(v => ({ params: { slug: v.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const vehicle = getVehicle(params.slug);
  if (!vehicle) return { notFound: true };
  const cost = vehicleTrueCost(vehicle);
  const faqs = vehicleFAQs(vehicle);
  return { props: { vehicle, cost, faqs } };
}

export default function CarPage({ vehicle, cost, faqs }) {
  const fmtS = n => '$' + Math.round(n).toLocaleString();
  const { year, make, model, msrp, type } = vehicle;
  const { payment, insMonthly, maintMonthly, fuelMonthly, depreciationY1, trueMo, trueYear, true5yr, totalInterest } = cost;

  const overPayment = trueMo - payment;
  const overPct = Math.round((overPayment / payment) * 100);
  const vehicleImg = getVehicleImage(type);
  const imgAlt = typeof vehicleImg.alt === 'function' ? vehicleImg.alt(year, make, model) : vehicleImg.alt;
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const editorial = vehicleEditorial(vehicle.slug);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  // Related vehicles in same type
  const related = VEHICLES
    .filter(v => v.type === type && v.slug !== vehicle.slug)
    .slice(0, 4);

  return (
    <Layout
      title={`${year} ${make} ${model} True Monthly Cost — What It Really Costs to Own`}
      description={`The ${year} ${make} ${model} costs ${fmtS(trueMo)}/month all-in — ${fmtS(overPayment)} more than the ${fmtS(payment)} payment the dealer quotes. Insurance, fuel, maintenance, and depreciation all counted.`}
      canonical={`https://tools.automotivist.com/cars/${vehicle.slug}`}
      schemas={[faqSchema]}
    >
      <Head>
        <meta property="og:image" content={unsplashUrl(vehicleImg.id)} />
        <meta property="og:image:alt" content={imgAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={unsplashUrl(vehicleImg.id)} />
      </Head>
      {/* Hero */}
      <section style={{ background: 'var(--dark-bg)', paddingTop: 56, paddingBottom: 48 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12 }}>True Cost of Ownership — {year} {make} {model}</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(34px,5.5vw,54px)', marginBottom: 24 }}>
            The {year} {make} {model} doesn't cost <em>{fmtS(payment)}/month.</em>
          </h1>
          <div className="answer-block">
            <div className="answer-verdict">The Real Number</div>
            <div className="answer-text">
              The payment is <strong>{fmtS(payment)}/month</strong>. But the true all-in monthly cost of owning a {year} {make} {model} is <strong>{fmtS(trueMo)}/month</strong> — <strong>{overPct}% more</strong> than what the dealership quotes. That gap is {fmtS(overPayment)}/month the payment number hides.
            </div>
          </div>
          <img
            src={unsplashUrl(vehicleImg.id, 1200, 480)}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl(1200, 480); }}
            alt={imgAlt}
            style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 12, marginTop: 28, display: 'block' }}
            loading="eager"
          />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginTop: 10, marginBottom: 8 }}>
            DATA UPDATED: {lastUpdated} — KBB, AAA, Edmunds
          </div>

          {/* True cost breakdown */}
          <div style={{ marginTop: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 20 }}>Monthly cost breakdown</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cost Component</th>
                  <th>Monthly</th>
                  <th>Annual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Loan payment (20% down, 60mo, 7.5% APR)</td>
                  <td>{fmtS(payment)}</td>
                  <td>{fmtS(payment * 12)}</td>
                </tr>
                <tr>
                  <td>Insurance (full coverage estimate)</td>
                  <td>{fmtS(insMonthly)}</td>
                  <td>{fmtS(insMonthly * 12)}</td>
                </tr>
                <tr>
                  <td>Maintenance &amp; repairs (AAA estimate)</td>
                  <td>{fmtS(maintMonthly)}</td>
                  <td>{fmtS(maintMonthly * 12)}</td>
                </tr>
                <tr>
                  <td>Fuel (15,000 mi/yr)</td>
                  <td>{fmtS(fuelMonthly)}</td>
                  <td>{fmtS(fuelMonthly * 12)}</td>
                </tr>
                <tr>
                  <td>Depreciation (year 1 avg: 15% of MSRP)</td>
                  <td>{fmtS(depreciationY1)}</td>
                  <td>{fmtS(depreciationY1 * 12)}</td>
                </tr>
                <tr className="total">
                  <td><strong>True monthly total</strong></td>
                  <td><strong style={{ color: 'var(--amber)' }}>{fmtS(trueMo)}</strong></td>
                  <td><strong style={{ color: 'var(--amber)' }}>{fmtS(trueYear)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5-year total */}
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(20px,3.5vw,30px)', marginBottom: 28 }}>
            The 5-year <em>full picture</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, background: 'var(--dark-border)', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
            {[
              { label: '5-year total cost', value: fmtS(true5yr), sub: 'all-in ownership' },
              { label: 'Total interest paid', value: fmtS(totalInterest), sub: 'loan cost above principal' },
              { label: 'MSRP vs total cost', value: fmtS(true5yr - msrp), sub: 'what ownership adds above sticker' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--dark-bg)', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: 'var(--amber)', lineHeight: 1, marginBottom: 8 }}>{item.value}</div>
                <div style={{ fontSize: 11, color: 'var(--mid)', lineHeight: 1.4, fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border-2)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>The Automotivist Frame</div>
            <p style={{ fontSize: 15, color: 'var(--light)', lineHeight: 1.7 }}>
              "The test drive is designed to make you forget the math." A {year} {make} {model} at {fmtS(msrp)} sticker costs {fmtS(true5yr)} over 5 years. The sticker is the beginning of the number — not the number.
            </p>
          </div>
        </div>
      </section>

      {/* The Automotivist Take — unique editorial per vehicle */}
      {editorial && (
        <section className="section-sm" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
          <div className="container-sm">
            <div style={{ background: 'var(--dark-card)', borderLeft: '3px solid var(--amber)', borderRadius: '0 12px 12px 0', padding: '24px 28px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>
                The Automotivist Take
              </div>
              <p style={{ fontSize: 16, color: 'var(--light)', lineHeight: 1.8 }}>{editorial}</p>
            </div>
          </div>
        </section>
      )}

      {/* Calculator */}
      <section style={{ background: '#EDE8E0', paddingTop: 56, paddingBottom: 72 }}>
        <div className="container-sm">
          <p className="eyebrow" style={{ marginBottom: 12, color: 'var(--amber-dark)' }}>Your situation</p>
          <h2 className="h-light" style={{ fontSize: 'clamp(20px,3vw,30px)', marginBottom: 32 }}>
            Enter your actual payment to get your <em>Ownership Score</em>
          </h2>
          <Calculator preloadPayment={payment} />
        </div>
      </section>

      {/* Newsletter capture */}
              <NewsletterCapture context="cars" slug={vehicle.slug} />

              {/* FAQs */}
      <section className="section" style={{ background: 'var(--dark-bg)' }}>
        <div className="container-sm">
          <h2 className="h-display" style={{ fontSize: 'clamp(22px,3.5vw,32px)', marginBottom: 40 }}>
            {make} {model} — <em>Frequently Asked Questions</em>
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
      <section className="section-sm" style={{ background: 'var(--dark-card)', borderTop: '1px solid var(--dark-border)' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Similar Vehicles</p>
          <div className="related-grid">
            {related.map(v => {
              const c = vehicleTrueCost(v);
              return (
                <Link key={v.slug} href={`/cars/${v.slug}`} className="related-card">
                  <div className="related-card-label">True Cost</div>
                  <div className="related-card-title">{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                    {fmtS(c.trueMo)}/mo all-in · {fmtS(v.msrp)} MSRP
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
