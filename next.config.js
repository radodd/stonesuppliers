/** @type {import('next').NextConfig} */
const nextConfig = {
  // module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dzlauufqbyfqfivbiipg.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
