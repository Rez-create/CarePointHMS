/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Disable the loading indicator
  devIndicators: {
    buildActivity: false,
  },
}

export default nextConfig