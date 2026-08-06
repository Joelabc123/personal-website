import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:locale(de|en)/robots.txt",
        destination: "/robots.txt",
        permanent: true,
      },
    ];
  },
  experimental: {
    globalNotFound: true,
    viewTransition: true,
  },
  images: {
    qualities: [75, 90],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
