/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      // Allow calculator page to be embedded in Beehiiv posts and iframes
      {
        source: '/calculator',
        headers: [{ key: 'X-Frame-Options', value: 'ALLOWALL' }],
      },
    ];
  },

  // async rewrites() {
  //   return { beforeFiles: [] };
  // },
};

export default nextConfig;
