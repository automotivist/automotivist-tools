// pages/home.js — The Automotivist brand homepage
// Served at automotivist.com via hostname middleware
// Proxies newsletter paths to Beehiiv via next.config.mjs rewrites
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { BEEHIIV_PUB_ID } from '../lib/calculations';

const STATS = [
  { value: '$738',  label: 'Average US car payment — Q4 2025' },
  { value: '32%',   label: 'Of take-home the average payment takes' },
  { value: '$1,020', label: 'What the average car actually costs monthly' },
];

const BULLETS = [
  'The real monthly cost of popular cars — not the dealer number',
  'Car payment math broken down by your actual income',
  'When to refinance, when to walk, when to negotiate',
  'The wealth cost of every car decision, in plain numbers',
  'Scenarios from real ownership situations — not theory',
];

const TOOLS = [
  {
    href: 'https://tools.automotivist.com/calculator',
    label: 'Ownership Score Calculator',
    desc: 'Enter your payment and income. Get your Ownership Score, true monthly cost, and 10-year wealth impact.',
    tag: 'Free Tool',
  },
  {
    href: 'https://tools.automotivist.com/guides/car-payment-guide',
    label: 'The 15% Car Payment Rule',
    desc: 'Payment ceilings for every salary from $40K to $200K. The rule most people apply wrong.',
    tag: 'Guide',
  },
  {
    href: 'https://tools.automotivist.com/guides/true-cost-of-ownership',
    label: 'True Cost of Car Ownership',
    desc: 'The payment is 60% of what the car actually costs. The other 40% broken down.',
    tag: 'Guide',
  },
];

export default function Home() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle');

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
          utm_source: 'homepage',
          utm_medium: 'hero-form',
          utm_campaign: 'automotivist-homepage',
        }),
      });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Head>
        <title>The Automotivist — The car math no one shows you</title>
        <meta name="description" content="Your car costs more than the payment. Every Friday, free: the real numbers behind car ownership, payments, and the wealth decisions hiding inside every car choice." />
        <meta name="google-site-verification" content="t33PyQgKjpuFE_d3krZETe3uWmponMWJBhUP6gyGRkw" />
        <link rel="canonical" href="https://automotivist.com" />
        <meta property="og:title" content="The Automotivist — The car math no one shows you" />
        <meta property="og:description" content="Your car costs more than the payment. Every Friday, free." />
        <meta property="og:url" content="https://automotivist.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; }
          body { background: #080808; color: #fff; font-family: 'Barlow', sans-serif; line-height: 1.6; -webkit-font-smoothing: antialiased; }
          a { color: inherit; text-decoration: none; }
          input { font-family: 'Barlow', sans-serif; }
        `}</style>
      </Head>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #141414', padding: '0 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8A020' }} />
            <span style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#ccc' }}>
              The Automotivist
            </span>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <a href="https://tools.automotivist.com/calculator" style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: 600, letterSpacing: '.08em', color: '#555', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#555'}>
              Calculator
            </a>
            <a href="https://tools.automotivist.com" style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: 600, letterSpacing: '.08em', color: '#555', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#555'}>
              Tools
            </a>
            <a href="https://x.com/_automotivist" target="_blank" rel="noopener" style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: 600, letterSpacing: '.08em', color: '#555', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='#555'}>
              X
            </a>
            <a href="/subscribe" style={{ background: '#E8A020', color: '#080808', fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: 700, letterSpacing: '.06em', padding: '7px 16px', borderRadius: 6, transition: 'opacity .15s' }}
              onMouseEnter={e => e.target.style.opacity='.85'} onMouseLeave={e => e.target.style.opacity='1'}>
              Subscribe Free
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 12, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#E8A020', marginBottom: 20 }}>
            Free Newsletter — Every Friday
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(48px, 9vw, 80px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '.01em', color: '#fff', marginBottom: 24 }}>
            Your car costs more<br />than{' '}
            <span style={{ color: '#E8A020' }}>the payment.</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px, 2.2vw, 20px)', color: '#666', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            The numbers behind car ownership that dealerships, lenders, and manufacturers prefer you never run. Every Friday. Free.
          </p>

          {/* Subscribe form */}
          {status === 'done' ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#0e1f0e', border: '1px solid #1a3a1a', borderRadius: 10, padding: '16px 24px' }}>
              <span style={{ fontSize: 20, color: '#4DC84D' }}>✓</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 17, fontWeight: 700, color: '#fff' }}>You are in. First issue lands Friday.</div>
                <div style={{ fontSize: 13, color: '#4a6a4a' }}>Check your inbox to confirm.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && subscribe()}
                placeholder="your@email.com"
                style={{ flex: '1 1 220px', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '13px 16px', fontSize: 15, color: '#fff', outline: 'none' }}
              />
              <button
                onClick={subscribe}
                disabled={status === 'loading'}
                style={{ background: '#E8A020', color: '#080808', border: 'none', borderRadius: 8, padding: '13px 24px', fontFamily: 'Barlow Condensed', fontSize: 17, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', whiteSpace: 'nowrap', opacity: status === 'loading' ? .7 : 1 }}
              >
                {status === 'loading' ? '...' : 'Get the Free Newsletter'}
              </button>
            </div>
          )}
          {status === 'error' && <p style={{ fontSize: 12, color: '#cc3232', marginTop: 8 }}>Something went wrong. Try again.</p>}
          <p style={{ fontSize: 12, color: '#333', marginTop: 12 }}>No spam. No upsell every issue. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#0e0e0e', borderTop: '1px solid #141414', borderBottom: '1px solid #141414' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 2 ? '1px solid #141414' : 'none' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 800, color: '#E8A020', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#E8A020', marginBottom: 16 }}>Every Friday — Free</div>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 32, lineHeight: 1.1 }}>
            The math most people<br /><span style={{ color: '#E8A020' }}>never run before they buy.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {BULLETS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(232,160,32,.12)', border: '1px solid rgba(232,160,32,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: '#E8A020', fontSize: 11, fontWeight: 700 }}>→</span>
                </div>
                <span style={{ fontSize: 16, color: '#888', lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {status === 'done' ? (
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 16, color: '#4DC84D', fontWeight: 700 }}>✓ You are subscribed.</div>
            ) : (
              <a href="/subscribe" style={{ background: '#E8A020', color: '#080808', fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700, letterSpacing: '.04em', padding: '12px 24px', borderRadius: 8, display: 'inline-block' }}>
                Subscribe Free
              </a>
            )}
            <a href="/p" style={{ background: 'transparent', color: '#555', fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 600, letterSpacing: '.04em', padding: '12px 24px', borderRadius: 8, border: '1px solid #1e1e1e', display: 'inline-block' }}>
              Read Past Issues
            </a>
          </div>
        </div>
      </section>

      {/* Tools section */}
      <section style={{ padding: '72px 24px', background: '#0a0a0a', borderTop: '1px solid #141414' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Free Tools</div>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#fff', marginBottom: 32, lineHeight: 1.1 }}>
            Run the numbers before<br /><span style={{ color: '#E8A020' }}>someone else runs them for you.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {TOOLS.map((t, i) => (
              <a key={i} href={t.href} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: '22px 22px', display: 'block', transition: 'border-color .2s, transform .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#E8A020'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#1e1e1e'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#E8A020', marginBottom: 8 }}>{t.tag}</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.25 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{t.desc}</div>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <a href="https://tools.automotivist.com" style={{ fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: 600, letterSpacing: '.08em', color: '#333', transition: 'color .15s' }}
              onMouseEnter={e => e.target.style.color='#E8A020'} onMouseLeave={e => e.target.style.color='#333'}>
              View all tools at tools.automotivist.com →
            </a>
          </div>
        </div>
      </section>

      {/* The voice section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#333', marginBottom: 24 }}>The philosophy</div>
          <blockquote style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 24, fontStyle: 'normal' }}>
            "I love cars. But I refuse to let them keep me broke."
          </blockquote>
          <p style={{ fontSize: 15, color: '#444', lineHeight: 1.75 }}>
            Son of a taxi driver. Financed a G35 to impress people who do not remember the car.
            Paid off a Cayenne early — expensive lesson. Now drives a Tesla Model Y on rideshare
            with home solar. Still saving for a 911 GT3. 90% Bitcoin conviction.
            This newsletter is the math I wish I had run earlier.
          </p>
          <a href="https://x.com/_automotivist" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: 600, letterSpacing: '.08em', color: '#444', transition: 'color .15s' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#444'}>
            @_automotivist on X →
          </a>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ background: '#0e0e0e', borderTop: '1px solid #141414', padding: '72px 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
            The car math. Every Friday. Free.
          </h2>
          <p style={{ fontSize: 14, color: '#444', marginBottom: 28 }}>No spam. No ads. Just the numbers.</p>
          {status === 'done' ? (
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 17, color: '#4DC84D', fontWeight: 700 }}>✓ You are subscribed. Check your inbox.</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && subscribe()}
                placeholder="your@email.com"
                style={{ flex: '1 1 200px', maxWidth: 280, background: '#111', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#fff', outline: 'none' }} />
              <button onClick={subscribe} disabled={status === 'loading'}
                style={{ background: '#E8A020', color: '#080808', border: 'none', borderRadius: 8, padding: '12px 22px', fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer', opacity: status === 'loading' ? .7 : 1 }}>
                {status === 'loading' ? '...' : 'Subscribe Free'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #111', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'Barlow Condensed', fontSize: 12, color: '#2a2a2a', letterSpacing: '.1em' }}>
            © {new Date().getFullYear()} THE AUTOMOTIVIST
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Calculator', 'https://tools.automotivist.com/calculator'], ['Tools', 'https://tools.automotivist.com'], ['X', 'https://x.com/_automotivist'], ['Newsletter', '/subscribe']].map(([label, href]) => (
              <a key={label} href={href} style={{ fontFamily: 'Barlow Condensed', fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: '#2a2a2a', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color='#555'} onMouseLeave={e => e.target.style.color='#2a2a2a'}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
