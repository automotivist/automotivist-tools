// components/CrossLinks.jsx
// Cross-cluster internal links — connects all page types into a single crawlable network
// Appears at the bottom of every page, above footer

import Link from 'next/link';

export default function CrossLinks({ context = {}, type }) {
  const links = buildLinks(type, context);
  if (!links.length) return null;

  return (
    <nav aria-label="Related tools" style={S.wrap}>
      <div style={S.inner}>
        <div style={S.label}>Related tools</div>
        <div style={S.grid}>
          {links.map((l, i) => (
            <Link key={i} href={l.href} style={S.card}>
              <div style={S.tag}>{l.tag}</div>
              <div style={S.title}>{l.title}</div>
              <div style={S.desc}>{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function buildLinks(type, ctx) {
  const { payment, salary } = ctx;
  const fmtD = n => '$' + Math.round(n).toLocaleString();

  switch (type) {

    case 'car-payment': {
      const links = [];
      if (salary) links.push({
        tag: 'Affordability',
        href: `/afford/${salary}-salary`,
        title: `How Much Car on ${fmtD(salary)}?`,
        desc: `Full ${fmtD(salary)} salary breakdown — payment ceiling, vehicle range, and what most people at this income get wrong.`,
      });
      if (payment && payment > 400) links.push({
        tag: 'Refinancing',
        href: `/refinance/8-percent-to-6-percent`,
        title: 'Could You Be Paying Less?',
        desc: `If you financed at 7-10%, refinancing to 5-6% saves $20-50/month on a typical balance. See if the math works for you.`,
      });
      links.push({
        tag: 'True Cost',
        href: `/cars/2025-toyota-rav4`,
        title: 'What Does This Payment Finance?',
        desc: `The RAV4 is the most common vehicle in the $400-600/month range. Its true monthly cost — not the payment — is $1,261.`,
      });
      links.push({
        tag: 'Calculator',
        href: `/calculator`,
        title: 'Get Your Ownership Score',
        desc: `Enter your payment and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact in 30 seconds.`,
      });
      links.push({
        tag: 'Real Story',
        href: `/stories/g35-mistake`,
        title: 'The G35 Was a $51,000 Mistake',
        desc: `I financed a car to look like someone I was not. Here is the exact number that decision cost me over 5 years.`,
      });
      return links;
    }

    case 'afford': {
      const links = [];
      if (salary) {
        const ceil = Math.round(salary * 0.72 / 12 * 0.15 / 50) * 50;
        links.push({
          tag: 'Payment Analysis',
          href: `/car-payment/${ceil}-per-month-${salary}-salary`,
          title: `Is ${fmtD(ceil)}/Month Right for You?`,
          desc: `Your 15% ceiling is ${fmtD(ceil)}/month. See the full breakdown — true cost, wealth impact, and what ${fmtD(ceil)} actually finances.`,
        });
        const stretch = Math.round(ceil * 1.2 / 50) * 50;
        links.push({
          tag: 'Payment Analysis',
          href: `/car-payment/${stretch}-per-month-${salary}-salary`,
          title: `What About ${fmtD(stretch)}/Month?`,
          desc: `${fmtD(stretch)} is above your ceiling at this income. See exactly how much over budget it puts you and what that costs long-term.`,
        });
      }
      links.push({
        tag: 'True Cost',
        href: `/cars/2025-honda-cr-v`,
        title: 'A Real Vehicle at This Budget',
        desc: `The CR-V is one of the most common vehicles at a sensible payment. Its true all-in cost is $1,287/month — not the $449 payment.`,
      });
      // FIX: Link directly to a refinance page, not just the guide
      links.push({
        tag: 'Refinancing',
        href: `/refinance/8-percent-to-6-percent`,
        title: 'Already Have a Loan? See If You Can Lower It',
        desc: `Dropping from 8% to 6% saves $24/month on a $25K balance. If you financed above your ceiling, refinancing is the fastest way down.`,
      });
      links.push({
        tag: 'Calculator',
        href: `/calculator`,
        title: 'Get Your Ownership Score',
        desc: `Enter your payment and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact in 30 seconds.`,
      });
      return links;
    }

    case 'refinance': {
      return [
        {
          tag: 'Payment Analysis',
          href: `/car-payment/600-per-month-75000-salary`,
          title: 'Is Your Current Payment Affordable?',
          desc: `See whether your payment — before or after the refi — clears the 15% rule for your income. The rate is only part of the equation.`,
        },
        {
          tag: 'Affordability',
          href: `/afford/75000-salary`,
          title: 'What Is Your Actual Ceiling?',
          desc: `Most refinance decisions are made without first knowing the right number. Know your ceiling, then refi toward it.`,
        },
        {
          tag: 'True Cost',
          href: `/cars/2025-chevrolet-equinox`,
          title: 'What Owning This Vehicle Actually Costs',
          desc: `True monthly cost includes more than the payment rate. Insurance, fuel, and maintenance do not change when you refinance.`,
        },
        {
          tag: 'Calculator',
          href: `/calculator`,
          title: 'Get Your Ownership Score',
          desc: `Enter your payment and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact in 30 seconds.`,
        },
      ];
    }

    case 'vehicle': {
      return [
        {
          tag: 'Payment Analysis',
          href: `/car-payment/600-per-month-75000-salary`,
          title: 'Can You Afford This Payment?',
          desc: `A $449 payment on a $75K salary is 9.6% of take-home — inside the rule. But the true cost is $1,238/month. Run your numbers.`,
        },
        {
          tag: 'Affordability',
          href: `/afford/75000-salary`,
          title: 'Is This Vehicle in Your Range?',
          desc: `Your ceiling by salary — not by payment. Most people know the payment. Few know the number that actually matters.`,
        },
        {
          tag: 'Refinancing',
          href: `/refinance/8-percent-to-6-percent`,
          title: 'Already Financed? Lower Your Rate',
          desc: `If you financed at 7-10%, dropping to 6% saves $19-24/month on a $20-25K balance. See the exact savings by balance.`,
        },
        {
          tag: 'Real Story',
          href: `/stories/real-cost-car-nyc-year`,
          title: 'I Tracked Every Dollar for a Year',
          desc: `$34,164. That is what it actually cost to own a car in NYC for one year. Every line item, itemized.`,
        },
      ];
    }

    // FIX: guides type — used on story pages. Was returning [] — now links to all clusters
    case 'guides': {
      return [
        {
          tag: 'Calculator',
          href: `/calculator`,
          title: 'Get Your Ownership Score',
          desc: `Enter your payment and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact in 30 seconds.`,
        },
        {
          tag: 'Affordability',
          href: `/afford/75000-salary`,
          title: 'How Much Car on $75,000?',
          desc: `The 15% rule applied to a $75K salary — payment ceiling, vehicle range, and the national average comparison.`,
        },
        {
          tag: 'Payment Analysis',
          href: `/car-payment/600-per-month-75000-salary`,
          title: '$600/Month on $75K — Is It Too Much?',
          desc: `$600 on a $75K salary is 15.5% of take-home — just above the ceiling. See exactly what that costs over 10 years.`,
        },
        {
          tag: 'True Cost',
          href: `/cars/2025-toyota-rav4`,
          title: 'RAV4 True Monthly Cost',
          desc: `The RAV4 is the most common vehicle at the $400-600/month payment range. All-in cost: $1,261/month — not the $449 payment.`,
        },
        {
          tag: 'Guide',
          href: `/guides/car-payment-guide`,
          title: 'The 15% Rule by Salary',
          desc: `Payment ceilings for every salary from $40K to $200K. Most people apply this rule to the wrong number.`,
        },
      ];
    }

    default:
      return [];
  }
}

const S = {
  wrap: {
    background: '#f7f4ef',
    borderTop: '1px solid #e0dbd0',
    padding: '40px 24px',
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
  },
  label: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 16,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 10,
  },
  card: {
    display: 'block',
    background: '#fff',
    border: '1px solid #e0dbd0',
    borderRadius: 10,
    padding: '14px 16px',
    textDecoration: 'none',
    transition: 'border-color .15s',
  },
  tag: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    color: '#E8A020',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: 14,
    fontWeight: 700,
    color: '#17140D',
    lineHeight: 1.3,
    marginBottom: 5,
  },
  desc: {
    fontSize: 11,
    color: '#888',
    lineHeight: 1.6,
  },
};

