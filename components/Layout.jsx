// components/Layout.jsx
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children, title, description, canonical, schemas }) {
  const siteName = 'The Automotivist';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Car Ownership Intelligence`;
  const metaDesc = description || 'The real math behind car ownership.';

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDesc} />
        {canonical && <link rel="canonical" href={canonical} />}
        {schemas && schemas.map((s, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
        ))}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:site_name" content={siteName} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@_automotivist" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ borderBottom: '1px solid var(--dark-border)', background: 'var(--dark-bg)' }}>
          <div className="container">
            <nav className="site-nav">
              <Link href="/" className="brand-mark" style={{ textDecoration: 'none' }}>
                <div className="brand-dot" />
                <span className="brand-name">The Automotivist</span>
              </Link>
              <div className="nav-links">
                <Link href="/calculator" className="nav-link">Calculator</Link>
                <a href="https://x.com/_automotivist" target="_blank" rel="noopener" className="nav-link">@_automotivist</a>
                <a href="https://automotivist.beehiiv.com/subscribe" target="_blank" rel="noopener" className="btn btn-primary btn-sm">Subscribe Free</a>
              </div>
            </nav>
          </div>
        </header>
        <main style={{ flex: 1 }}>{children}</main>
        <footer className="site-footer" style={{ background: 'var(--dark-bg)' }}>
          <div className="container">
            <div className="footer-inner">
              <div>
                <div className="brand-mark" style={{ marginBottom: 8 }}><div className="brand-dot" /><span className="brand-name">The Automotivist</span></div>
                <p className="footer-copy">Car math no one else shows you. Every Friday.</p>
              </div>
              <div className="footer-links">
                <a href="https://automotivist.beehiiv.com" target="_blank" rel="noopener" className="footer-link">Newsletter</a>
                <a href="https://x.com/_automotivist" target="_blank" rel="noopener" className="footer-link">X</a>
                <Link href="/calculator" className="footer-link">Calculator</Link>
              </div>
            </div>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--dark-border)' }}>
              <p className="footer-copy" style={{ fontSize: 12 }}>Data sources: Experian, Bankrate, AAA, Edmunds, KBB/Cox Automotive. Not financial advice. &copy; {new Date().getFullYear()} The Automotivist.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
