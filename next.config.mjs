/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com'],
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/calculator',
        headers: [{ key: 'X-Frame-Options', value: 'ALLOWALL' }],
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
