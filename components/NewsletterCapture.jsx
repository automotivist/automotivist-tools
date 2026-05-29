// components/NewsletterCapture.jsx
// Inline newsletter capture - appears mid-page on all content pages
// Lower friction than the calculator gate - no tool required to subscribe
import { useState } from 'react';
import { BEEHIIV_PUB_ID } from '../lib/calculations';

export default function NewsletterCapture({ context = 'default', slug = '' }) {
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | done | error

  const COPY = {
    'car-payment': {
      eyebrow: 'Every Friday',
      headline: 'The car math no one runs for you.',
      sub: 'Payment breakdowns. Ownership scores. The numbers behind the decisions. Free.',
    },
    'afford': {
      eyebrow: 'Every Friday',
      headline: 'Know your ceiling before you walk into a dealership.',
      sub: 'Real affordability math, not the monthly payment they want you to focus on.',
    },
    'refinance': {
      eyebrow: 'Every Friday',
      headline: 'Is your current rate costing you more than you think?',
      sub: 'Refinancing math, ownership costs, and the decisions that actually move the needle.',
    },
    'cars': {
      eyebrow: 'Every Friday',
      headline: 'The true cost of every car - not just the payment.',
      sub: 'Insurance, depreciation, fuel, maintenance. The number the sticker never shows.',
    },
    'guides': {
      eyebrow: 'Every Friday',
      headline: 'The 15% rule is the floor, not the goal.',
      sub: 'Car finance math that most people never run. Free, every Friday.',
    },
    'default': {
      eyebrow: 'Every Friday',
      headline: 'The car math no one else runs for you.',
      sub: 'Real numbers, real decisions. The Automotivist newsletter. Free.',
    },
  };

  const copy = COPY[context] || COPY.default;

  async function subscribe() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus('loading');
    try {
      await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'seo',
          utm_medium: 'inline-capture',
          utm_campaign: slug || context,
        }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div style={S.wrap}>
        <div style={S.done}>
          <div style={S.doneIcon}>✓</div>
          <div>
            <div style={S.doneHead}>You are in. First issue lands Friday.</div>
            <div style={S.doneSub}>Check your inbox to confirm - then you are set.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={S.left}>
          <div style={S.eyebrow}>{copy.eyebrow}</div>
          <div style={S.headline}>{copy.headline}</div>
          <div style={S.sub}>{copy.sub}</div>
        </div>
        <div style={S.right}>
          <div style={S.row}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && subscribe()}
              placeholder="your@email.com"
              style={S.input}
            />
            <button
              onClick={subscribe}
              disabled={status === 'loading'}
              style={{ ...S.btn, opacity: status === 'loading' ? .7 : 1 }}
            >
              {status === 'loading' ? '...' : 'Subscribe Free'}
            </button>
          </div>
          <div style={S.privacy}>No spam. Unsubscribe anytime. Free forever.</div>
          {status === 'error' && <div style={S.errMsg}>Something went wrong. Try again.</div>}
        </div>
      </div>
    </div>
  );
}

const S = {
  wrap: {
    background: '#0e0e0e',
    border: '1px solid #1e1e1e',
    borderLeft: '3px solid #E8A020',
    borderRadius: '0 12px 12px 0',
    padding: '28px 32px',
    margin: '40px 0',
  },
  inner: {
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  left: {
    flex: '1 1 260px',
  },
  right: {
    flex: '1 1 280px',
  },
  eyebrow: {
    fontFamily: 'var(--font-display, "Barlow Condensed")',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: '#E8A020',
    marginBottom: 8,
  },
  headline: {
    fontFamily: 'var(--font-display, "Barlow Condensed")',
    fontSize: 'clamp(18px,2.5vw,22px)',
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.25,
    marginBottom: 8,
  },
  sub: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 13,
    color: '#666',
    lineHeight: 1.6,
  },
  row: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: 7,
    padding: '11px 14px',
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 14,
    color: '#fff',
    outline: 'none',
    minWidth: 0,
  },
  btn: {
    background: '#E8A020',
    color: '#080808',
    border: 'none',
    borderRadius: 7,
    padding: '11px 18px',
    fontFamily: 'var(--font-display, "Barlow Condensed")',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '.03em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  privacy: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 11,
    color: '#333',
  },
  errMsg: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 11,
    color: '#cc3232',
    marginTop: 4,
  },
  done: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  doneIcon: {
    width: 40,
    height: 40,
    background: 'rgba(77,200,77,.12)',
    border: '1px solid rgba(77,200,77,.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4DC84D',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  doneHead: {
    fontFamily: 'var(--font-display, "Barlow Condensed")',
    fontSize: 18,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },
  doneSub: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: 13,
    color: '#555',
  },
};
