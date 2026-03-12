/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dzlauufqbyfqfivbiipg.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  sassOptions: {
    silenceDeprecations: ["import"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
