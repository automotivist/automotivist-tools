// pages/car-payment/[slug].js
// Generates 238+ pages from salary/payment combinations
// Each page: direct answer + math table + embedded calculator + FAQs + related pages
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Calculator from '../../components/Calculator';
import NewsletterCapture from '../../components/NewsletterCapture';
import CrossLinks from '../../components/CrossLinks';
import Image from 'next/image';
import { getPaymentImage, unsplashUrl, fallbackUrl } from '../../lib/page-images';
import {
  parseSlug, getAllPagePaths,
  monthlyTakeHome, threshold15, paymentPercent,
  estimateInsurance, estimateFuel, estimateMaintenance, trueMonthlyCost,
  totalLoanCost, totalInterest, sp500_5yr, sp500_10yr, monthlyOverspend,
  getVerdict, verdictLabel, verdictClass,
  directAnswerText, generateFAQs, relatedPages, intentProfile, scenarioContext,
  fmtDollar, fmtK,
} from '../../lib/calculations';

export default function PaymentPage({ payment, salary, data }) {
  const {
    takeHome, thresh15, pct, insEst, fuelEst, maintEst, trueMonthly,
    loan60, loan72, interest60, interest72, sp5, sp10, overspend,
    verdict, faqs, related, intent, scenario,
  } = data;

  const vClass  = verdictClass(verdict);
  const vLabel  = verdictLabel(verdict);
  const isHigh  = verdict === 'too-high';
  const isBorder = verdict === 'borderline';
  const pageImage = getPaymentImage(intent?.angle || 'borderline');
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Schema markup
  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: intent?.h1 || `Is a ${fmtDollar(payment)} Car Payment Too High on a ${fmtDollar(salary)} Salary?`,
    image: unsplashUrl(pageImage.id),
    author: { '@type': 'Person', name: 'The Automotivist', url: 'https://x.com/_automotivist' },
    publisher: { '@type': 'Organization', name: 'The Automotivist', url: 'https://tools.automotivist.com' },
    datePublished: '2026-04-01',
    dateModified: new Date().toISOString().split('T')[0],
    description: `${fmtDollar(payment)}/month on a ${fmtDollar(salary)} salary = ${pct}% of take-home. The 15% rule ${isHigh ? 'flags this as too high' : 'says this fits'}. True all-in cost: see full breakdown.`,
  };

  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ...(data.intent?.intentFAQs || []),
      ...faqs,
    ].map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tools.automotivist.com' },
      { '@type': 'ListItem', position: 2, name: 'Car Payment Analysis', item: 'https://tools.automotivist.com/car-payment' },
      { '@type': 'ListItem', position: 3, name: `${fmtDollar(payment)}/mo on ${fmtDollar(salary)} salary` },
    ],
  };

  return (
    <Layout
      title={(() => {
        const angle = data.intent?.angle;
        const over = Math.max(0, payment - thresh15);
        if (angle === 'underwater') return `${fmtDollar(payment)}/Month Car Payment on ${fmtDollar(salary)} Salary - ${pct}% of Take-Home (${fmtDollar(over)} Over)`;
        if (angle === 'stretched')  return `Is ${fmtDollar(payment)}/Month Too Much on ${fmtDollar(salary)}? You Are at ${pct}% of Take-Home`;
        if (angle === 'borderline') return `${fmtDollar(payment)}/Month Car Payment on ${fmtDollar(salary)} Salary - Right at the 15% Rule`;
        return `${fmtDollar(payment)}/Month Car Payment on ${fmtDollar(salary)} Salary - Inside the 15% Rule`;
      })()}
      description={(() => {
        const angle = data.intent?.angle;
        const over = Math.max(0, payment - thresh15);
        const sp10k = fmtK(sp10);
        if (angle === 'underwater') return `${fmtDollar(payment)}/month on a ${fmtDollar(salary)} salary is ${pct}% of take-home — ${fmtDollar(over)} over the 15% ceiling every month. That gap costs ${sp10k} in S&P 500 wealth over 10 years.`;
        if (angle === 'stretched')  return `${fmtDollar(payment)}/month on a ${fmtDollar(salary)} salary is ${pct}% of take-home — ${fmtDollar(over)} above the 15% rule ceiling. True all-in cost with insurance, fuel, and maintenance: ${fmtDollar(trueMonthly)}/month.`;
        if (angle === 'borderline') return `${fmtDollar(payment)}/month on a ${fmtDollar(salary)} salary = ${pct}% of take-home — right at the 15% ceiling. True all-in monthly cost: ${fmtDollar(trueMonthly)}. Full breakdown + Ownership Score calculator.`;
        return `${fmtDollar(payment)}/month on a ${fmtDollar(salary)} salary = ${pct}% of take-home — inside the 15% rule. True all-in cost: ${fmtDollar(trueMonthly)}/month. Run your free Ownership Score.`;
      })()}
      canonical={`https://tools.automotivist.com/car-payment/${payment}-per-month-${salary}-salary`}
    >
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
        <meta property="og:image" content={unsplashUrl(pageImage.id)} />
        <meta property="og:image:alt" content={typeof pageImage.alt === 'function' ? pageImage.alt(fmtDollar(payment), fmtDollar(salary)) : pageImage.alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={unsplashUrl(pageImage.id)} />
      </Head>

      {/* ── Page hero (dark) ── */}
      <div style={{ background: 'var(--dark-bg)', paddingTop: 40, paddingBottom: 0 }}>
        <div className="container">

          {/* Breadcrumb */}
          <nav style={{ marginBottom: 20, fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Car Payment Analysis</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'var(--light)' }}>{fmtDollar(payment)}/mo on {fmtDollar(salary)}</span>
          </nav>

          {/* Verdict badge */}
          <div style={{ marginBottom: 16 }}>
            <span className={`verdict ${vClass}`}>{vLabel}</span>
            {intent && <span style={{ marginLeft: 10, fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em' }}>{intent.situationLabel}</span>}
          </div>

          {/* H1 — intent-differentiated */}
          <h1 className="h-display" style={{ fontSize: 'clamp(26px,4.5vw,44px)', marginBottom: 16, maxWidth: 720 }}>
            {intent ? intent.h1 : `Is a ${fmtDollar(payment)} Car Payment Too High on a ${fmtDollar(salary)} Salary?`}
          </h1>

          {/* Hero stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
            <HeroStat label="% of take-home" value={`${pct}%`} color={isHigh ? 'var(--red)' : isBorder ? 'var(--amber)' : 'var(--green)'} />
            <HeroStat label="15% rule ceiling" value={fmtDollar(thresh15)} color="var(--mid)" />
            <HeroStat label="True monthly cost" value={fmtDollar(trueMonthly)} color="var(--amber)" />
            <HeroStat label="10-yr S&P 500 cost" value={fmtK(sp10)} color="var(--sp500)" />
          </div>

          {/* Last Updated */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.1em', marginBottom: 32 }}>
            DATA UPDATED: {lastUpdated} — Experian, Bankrate, AAA
          </div>

          {/* Hero image */}
          <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 0, maxHeight: 320, position: 'relative' }}>
            <img
              src={unsplashUrl(pageImage.id, 1200, 480)}
                  onError={(e) => { e.target.onerror = null; e.target.src = fallbackUrl(1200, 480); }}
              alt={typeof pageImage.alt === 'function' ? pageImage.alt(fmtDollar(payment), fmtDollar(salary)) : pageImage.alt}
              style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>

        <div style={{ height: 40, background: 'linear-gradient(to bottom, var(--dark-bg), #EDE8E0)', marginTop: 0 }} />
      </div>

      {/* ── Main content (light bg) ── */}
      <div style={{ background: '#EDE8E0', paddingTop: 40, paddingBottom: 72 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40, alignItems: 'start' }}>

            {/* Main column */}
            <div>

              {/* Intent intro — unique angle per page */}
              {intent && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#4A4540', lineHeight: 1.75, marginBottom: 24, borderLeft: '3px solid var(--amber)', paddingLeft: 16 }}>
                  {intent.intro}
                </p>
              )}

              {/* Direct answer — AEO money shot */}
              <div className="answer-block">
                <div className="answer-verdict">{vLabel}</div>
                <p className="answer-text" dangerouslySetInnerHTML={{ __html: directAnswerText(payment, salary) }} />
              </div>

              {/* Math section */}
              <section aria-label="Payment math breakdown" style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#17140D', marginBottom: 20 }}>
                  The math
                </h2>

                <div style={cardLight}>
                  <h3 style={cardTitle}>Monthly cost breakdown</h3>
                  <table className="data-table" style={{ background: 'var(--dark-card)' }}>
                    <thead>
                      <tr>
                        <th>Cost component</th>
                        <th style={{ textAlign: 'right' }}>Monthly estimate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Loan payment</td>
                        <td>{fmtDollar(payment)}</td>
                      </tr>
                      <tr>
                        <td>Insurance (national avg, this payment tier)</td>
                        <td>{fmtDollar(insEst)}</td>
                      </tr>
                      <tr>
                        <td>Fuel (15k mi/yr, 28 MPG, avg gas price)</td>
                        <td>{fmtDollar(fuelEst)}</td>
                      </tr>
                      <tr>
                        <td>Maintenance (AAA 2024 data, 15k mi/yr)</td>
                        <td>{fmtDollar(maintEst)}</td>
                      </tr>
                      <tr className="total">
                        <td><strong>True monthly total</strong></td>
                        <td>{fmtDollar(trueMonthly)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, fontFamily: 'var(--font-body)' }}>
                    Sources: Experian Q4 2025, AAA Your Driving Costs 2024, Bankrate national average fuel and insurance data.
                    Estimates. Your actual costs will vary.
                  </p>
                </div>

                <div style={{ ...cardLight, marginTop: 16 }}>
                  <h3 style={cardTitle}>Income impact</h3>
                  <table className="data-table" style={{ background: 'var(--dark-card)' }}>
                    <thead>
                      <tr>
                        <th>Figure</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Annual salary</td>
                        <td>{fmtDollar(salary)}</td>
                      </tr>
                      <tr>
                        <td>Est. monthly take-home (after tax)</td>
                        <td>{fmtDollar(takeHome)}</td>
                      </tr>
                      <tr>
                        <td>15% rule max payment</td>
                        <td>{fmtDollar(thresh15)}</td>
                      </tr>
                      <tr className={isHigh ? 'total' : ''}>
                        <td>Your payment as % of take-home</td>
                        <td style={{ color: isHigh ? 'var(--red)' : isBorder ? 'var(--amber)' : 'var(--green)' }}>
                          {pct}%
                        </td>
                      </tr>
                      {isHigh && (
                        <tr className="total">
                          <td>Monthly overspend above 15% rule</td>
                          <td style={{ color: 'var(--red)' }}>+{fmtDollar(overspend)}/mo</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ ...cardLight, marginTop: 16 }}>
                  <h3 style={cardTitle}>Total loan cost</h3>
                  <table className="data-table" style={{ background: 'var(--dark-card)' }}>
                    <thead>
                      <tr>
                        <th>Loan term</th>
                        <th style={{ textAlign: 'right' }}>Total paid</th>
                        <th style={{ textAlign: 'right' }}>Est. interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>60 months (5 years)</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--light)' }}>{fmtDollar(loan60)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)' }}>{fmtDollar(interest60)}</td>
                      </tr>
                      <tr>
                        <td>72 months (6 years)</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--light)' }}>{fmtDollar(loan72)}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--red)' }}>{fmtDollar(interest72)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, fontFamily: 'var(--font-body)' }}>
                    Interest estimated at 7.5% APR (Bankrate national average, good credit tier, Q1 2026).
                  </p>
                </div>
              </section>

              {/* Investment alternative */}
              <section aria-label="Investment opportunity cost" style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#17140D', marginBottom: 16 }}>
                  What it costs in wealth
                </h2>
                <div style={cardLight}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--light)', lineHeight: 1.7, marginBottom: 16 }}>
                    The payment sent to a lender is a payment that cannot compound in an investment account.
                    At the S&P 500's 50-year historical average of 10.5% annual return:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <OpCostCard label={`${fmtDollar(payment)}/mo invested for 5 years`} value={fmtDollar(sp5)} color="var(--sp500)" />
                    <OpCostCard label={`${fmtDollar(payment)}/mo invested for 10 years`} value={fmtDollar(sp10)} color="var(--sp500)" />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16, fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                    Illustrative. Not financial advice. Past returns do not guarantee future results.
                  </p>
                </div>
              </section>

              {/* Calculator embed */}
              <section aria-label="Car ownership calculator" style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#17140D', marginBottom: 8 }}>
                  Run your actual numbers
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#6A6560', marginBottom: 20, lineHeight: 1.6 }}>
                  Pre-loaded with this page's values. Adjust for your real insurance rate, APR, and loan term.
                </p>
                <Calculator
                  preloadPayment={payment}
                  preloadSalary={salary}
                  slug={`${payment}-per-month-${salary}-salary`}
                  compact
                />
              </section>

              {/* The Automotivist Take — unique editorial per payment/income combination */}
              {scenario && (
                <div style={{ margin: '32px 0' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#E8A020', marginBottom: 20 }}>The Automotivist Take</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: 'var(--light-surface, #F5F2EB)', border: '1px solid var(--light-border, #D8D3C8)', borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9A5C00', marginBottom: 8 }}>What this payment finances</div>
                      <p style={{ fontSize: 14, color: 'var(--light-text, #17140D)', lineHeight: 1.75 }}>
                        <strong>{fmtDollar(payment)}/month</strong> at 7.5% APR over 60 months finances {scenario.pt.vehicle}. {scenario.pt.note}
                      </p>
                    </div>
                    <div style={{ background: 'var(--light-surface, #F5F2EB)', border: '1px solid var(--light-border, #D8D3C8)', borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9A5C00', marginBottom: 8 }}>What this income means for the decision</div>
                      <p style={{ fontSize: 14, color: 'var(--light-text, #17140D)', lineHeight: 1.75 }}>{scenario.it.context}</p>
                    </div>
                    <div style={{ background: 'rgba(232,160,32,.06)', border: '1px solid rgba(232,160,32,.2)', borderRadius: 10, padding: '16px 20px' }}>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9A5C00', marginBottom: 8 }}>The honest frame</div>
                      <p style={{ fontSize: 14, color: 'var(--light-text, #17140D)', lineHeight: 1.75 }}>{scenario.obs}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Newsletter capture — between calculator and FAQ */}
              <NewsletterCapture context="car-payment" slug={`${payment}-per-month-${salary}-salary`} />

              {/* FAQ */}
              <section aria-label="Frequently asked questions" style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#17140D', marginBottom: 0 }}>
                  Frequently Asked Questions
                </h2>
                <div>
                  {/* Intent-specific FAQs first — differentiate from other pages */}
                  {intent && intent.intentFAQs.map((faq, i) => (
                    <div key={`intent-${i}`} className="faq-item" style={{ borderColor: '#D8D3C8' }}>
                      <h3 className="faq-q" style={{ color: '#17140D' }}>{faq.question}</h3>
                      <p className="faq-a" style={{ color: '#6A6560' }}>{faq.answer}</p>
                    </div>
                  ))}
                  {/* General FAQs */}
                  {faqs.map((faq, i) => (
                    <div key={`gen-${i}`} className="faq-item" style={{ borderColor: '#D8D3C8' }}>
                      <h3 className="faq-q" style={{ color: '#17140D' }}>{faq.question}</h3>
                      <p className="faq-a" style={{ color: '#6A6560' }}>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <aside style={{ position: 'sticky', top: 24 }}>
              <div style={{ background: '#080808', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 12 }}>
                  The Automotivist
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--white)', marginBottom: 8, lineHeight: 1.2 }}>
                  The car math no one shows you. Every Friday.
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--mid)', lineHeight: 1.6, marginBottom: 18 }}>
                  Real scenarios. Exact numbers. Free.
                </p>
                <a
                  href="https://automotivist.beehiiv.com/subscribe"
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary btn-md"
                  style={{ width: '100%', display: 'block', textAlign: 'center' }}
                >
                  Subscribe Free
                </a>
              </div>

              {/* Hub guides — authority links up the chain */}
              <div style={{ background: '#080808', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
                  Related Guides
                </div>
                {[
                  { href: '/guides/car-payment-guide', label: 'The 15% Car Payment Rule — Complete Guide' },
                  { href: '/guides/true-cost-of-ownership', label: 'True Cost of Car Ownership Explained' },
                  { href: `/afford/${salary}-salary`, label: `How much car on a ${fmtDollar(salary)} salary?` },
                ].map((link, i) => (
                  <Link key={i} href={link.href}
                    style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--amber)', marginBottom: 10, lineHeight: 1.4, textDecoration: 'none' }}>
                    → {link.label}
                  </Link>
                ))}
              </div>

              {/* Subscribe */}
              <div style={{ background: '#080808', borderRadius: 14, padding: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
                  Related Analyses
                </div>
                {related.map(p => (
                  <Link key={p.slug} href={`/car-payment/${p.slug}`}
                    style={{ display: 'block', background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 9, padding: '12px 14px', marginBottom: 8, textDecoration: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>
                      {fmtDollar(p.payment)}/mo on {fmtDollar(p.salary)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`verdict ${verdictClass(p.verdict)}`} style={{ fontSize: 10 }}>{verdictLabel(p.verdict)}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)' }}>{p.pct}% of income</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>

          </div>
        </div>
      </div>
      <CrossLinks type="car-payment" context={{ payment, salary }} />
    </Layout>
  );
}

// ── Sub-components ────────────────────────────────────────────
function HeroStat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginTop: 5, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function OpCostCard({ label, value, color }) {
  return (
    <div style={{ background: 'var(--dark-card-2)', border: '1px solid var(--dark-border)', borderRadius: 10, padding: 16 }}>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

const cardLight = {
  background: '#080808', border: '1px solid #1E1E1E',
  borderRadius: 12, padding: 24,
};
const cardTitle = {
  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
  color: 'var(--light)', marginBottom: 16, letterSpacing: '.04em',
  textTransform: 'uppercase', fontSize: 11,
};

// ── Static generation ─────────────────────────────────────────
export async function getStaticPaths() {
  return {
    paths: getAllPagePaths(),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const parsed = parseSlug(params.slug);
  if (!parsed) return { notFound: true };

  const { payment, salary } = parsed;
  const APR_60 = 7.5;
  const APR_72 = 7.5;

  const data = {
    takeHome:    monthlyTakeHome(salary),
    thresh15:    threshold15(salary),
    pct:         paymentPercent(payment, salary),
    insEst:      estimateInsurance(payment),
    fuelEst:     estimateFuel(),
    maintEst:    estimateMaintenance(),
    trueMonthly: trueMonthlyCost(payment),
    loan60:      totalLoanCost(payment, 60),
    loan72:      totalLoanCost(payment, 72),
    interest60:  Math.round(totalInterest(payment, APR_60, 60)),
    interest72:  Math.round(totalInterest(payment, APR_72, 72)),
    sp5:         sp500_5yr(payment),
    sp10:        sp500_10yr(payment),
    overspend:   monthlyOverspend(payment, salary),
    verdict:     getVerdict(payment, salary),
    faqs:        generateFAQs(payment, salary),
    related:     relatedPages(payment, salary),
    intent:      intentProfile(payment, salary),
    scenario:    scenarioContext(payment, salary, intentProfile(payment, salary)?.angle || 'borderline'),
  };

  return {
    props: { payment, salary, data },
    revalidate: 2592000, // 30 days — pages auto-regenerate with fresh data
  };
}
