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
  
  // more configs
  
};

export default nextConfig;
