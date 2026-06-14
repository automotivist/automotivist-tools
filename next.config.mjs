/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com'],
  },

  async redirects() {
    return [
      // ── Fix: /home duplicate (/home exists at both www and non-www)
      { source: '/home', destination: '/', permanent: true },

      // ── Fix: 404s — old Beehiiv paths Google discovered
      { source: '/authors',                        destination: '/',                               permanent: true },
      { source: '/publications',                   destination: '/',                               permanent: true },
      { source: '/best-cars-for-the-apocalypse',   destination: '/stories/rideshare-car-trap',     permanent: true },
      { source: '/best-cars-for-the-apocalypse/',  destination: '/stories/rideshare-car-trap',     permanent: true },

      // ── Fix: old Beehiiv tag pages
      { source: '/tag/:tag*', destination: '/', permanent: true },
    ];
  },

  async headers() {
    return [
      // Calculator embeddable
      {
        source: '/calculator',
        headers: [{ key: 'X-Frame-Options', value: 'ALLOWALL' }],
      },
      // Fix: canonical for subscribe with query params — tell Google the clean URL
      {
        source: '/subscribe',
        headers: [{ key: 'Link', value: '<https://automotivist.com/subscribe>; rel="canonical"' }],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        { source: '/p/:slug*',        destination: 'https://newsletter.automotivist.com/p/:slug*' },
        { source: '/posts/:slug*',    destination: 'https://newsletter.automotivist.com/posts/:slug*' },
        { source: '/subscribe',       destination: 'https://newsletter.automotivist.com/subscribe' },
        { source: '/unsubscribe',     destination: 'https://newsletter.automotivist.com/unsubscribe' },
        { source: '/confirm/:slug*',  destination: 'https://newsletter.automotivist.com/confirm/:slug*' },
        { source: '/rss',             destination: 'https://newsletter.automotivist.com/rss' },
      ],
    };
  },
};

export default nextConfig;
