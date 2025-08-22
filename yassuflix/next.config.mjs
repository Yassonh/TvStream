/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add image domains to allow them to be loaded
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
  
  // Your other configuration options go here.
};

export default nextConfig;
