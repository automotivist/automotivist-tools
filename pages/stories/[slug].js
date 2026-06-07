// pages/stories/[slug].js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import NewsletterCapture from '../../components/NewsletterCapture';
import CrossLinks from '../../components/CrossLinks';
import { STORIES, getStory, getAllStorySlugs } from '../../lib/stories-data';
import { DATA_UPDATED } from '../../lib/calculations';

export async function getStaticPaths() {
  return { paths: getAllStorySlugs(), fallback: false };
}

export async function getStaticProps({ params }) {
  const story = getStory(params.slug);
  if (!story) return { notFound: true };
  return { props: { story }, revalidate: 2592000 };
}

export default function StoryPage({ story }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.subtitle,
    author: { '@type': 'Person', name: 'The Automotivist', url: 'https://automotivist.com' },
    publisher: { '@type': 'Organization', name: 'The Automotivist', url: 'https://automotivist.com' },
    datePublished: story.date,
    dateModified: DATA_UPDATED,
    mainEntityOfPage: 'https://tools.automotivist.com/stories/' + story.slug,
  };

  return (
    <Layout title={story.title + ' | The Automotivist'} description={story.subtitle} canonical={'https://tools.automotivist.com/stories/' + story.slug} schemas={[articleSchema]}>
      <article>
        <header style={{ background: '#080808', padding: '64px 24px 56px', borderBottom: '1px solid #141414' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <nav style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
              <Link href="/" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#333', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#222', fontSize: 12 }}>›</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#E8A020' }}>{story.category}</span>
            </nav>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 20 }}>{story.title}</h1>
            <p style={{ fontSize: 18, color: '#666', lineHeight: 1.65, marginBottom: 32, maxWidth: 600 }}>{story.subtitle}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '3px solid #E8A020', borderRadius: '0 10px 10px 0', padding: '16px 24px' }}>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 42, fontWeight: 900, color: '#E8A020', lineHeight: 1 }}>{story.heroStat}</div>
                <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, color: '#444', marginTop: 4 }}>{story.heroStatLabel}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 24, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#333' }}>The Automotivist</span>
              <span style={{ color: '#222' }}>·</span>
              <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, color: '#333' }}>{story.date}</span>
              <span style={{ color: '#222' }}>·</span>
              <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, color: '#333' }}>{story.readTime} read</span>
            </div>
          </div>
        </header>

        <div style={{ background: '#F5F2EB', padding: '56px 24px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {story.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: 40 }}>
                {section.heading && <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 24, fontWeight: 800, color: '#17140D', marginBottom: 16 }}>{section.heading}</h2>}
                {section.body.split('\\n\\n').map((para, j) => (
                  <p key={j} style={{ fontSize: 17, color: '#2a2520', lineHeight: 1.8, marginBottom: 16, fontFamily: 'Barlow, sans-serif' }}>{para}</p>
                ))}
              </div>
            ))}
            {story.relatedPages?.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #D8D3C8', borderRadius: 12, padding: '24px 28px', marginTop: 40 }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>Run the numbers</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {story.relatedPages.map((p, i) => (
                    <Link key={i} href={p.href} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#E8A020', textDecoration: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 700 }}>
                      <span>→</span> {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 48 }}><NewsletterCapture context="guides" slug={story.slug} /></div>
          </div>
        </div>

        <section style={{ background: '#0a0a0a', borderTop: '1px solid #141414', padding: '48px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#333', marginBottom: 20 }}>More stories</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {STORIES.filter(s => s.slug !== story.slug).slice(0, 6).map(s => (
                <Link key={s.slug} href={'/stories/' + s.slug} style={{ display: 'block', background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, padding: '16px 18px', textDecoration: 'none' }}>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#E8A020', marginBottom: 6 }}>{s.category}</div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: 12, color: '#444', lineHeight: 1.5 }}>{s.readTime} read</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <CrossLinks type="guides" context={{}} />
      </article>
    </Layout>
  );
}
