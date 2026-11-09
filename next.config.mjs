/** @type {import('next').NextConfig} */
const API = process.env.API_URL || 'http://localhost:4000';
export default {
  reactStrictMode: true,
  poweredByHeader: false,
  // Same-origin proxy: browser talks to /api/v1/* on the web origin, so HttpOnly cookies work without CORS tricks.
  async rewrites() { return [{ source: '/api/v1/:path*', destination: `${API}/api/v1/:path*` }]; },
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
