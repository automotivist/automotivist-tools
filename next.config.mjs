/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },

  async headers() {
    return [
      // Allow calculator page to be embedded in Beehiiv posts and iframes
      {
        source: '/calculator',
        headers: [{ key: 'X-Frame-Options', value: 'ALLOWALL' }],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Proxy Beehiiv newsletter paths through automotivist.com
        // newsletter.automotivist.com must be set as custom domain in Beehiiv settings
        { source: '/p/:slug*',        destination: 'https://newsletter.automotivist.com/p/:slug*' },
        { source: '/posts/:slug*',    destination: 'https://newsletter.automotivist.com/posts/:slug*' },
        { source: '/subscribe',       destination: 'https://newsletter.automotivist.com/subscribe' },
        { source: '/unsubscribe',     destination: 'https://newsletter.automotivist.com/unsubscribe' },
        { source: '/confirm/:slug*',  destination: 'https://newsletter.automotivist.com/confirm/:slug*' },
        { source: '/rss',             destination: 'https://newsletter.automotivist.com/rss' },
      ],
    };
  },

  // async rewrites() {
  //   return { beforeFiles: [] };
  // },
};

export default nextConfig;
