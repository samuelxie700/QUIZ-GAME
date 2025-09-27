// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next 15+ uses this key
  serverExternalPackages: ['@google-cloud/datastore'],

  // Tell Turbopack the real root is this directory
  turbopack: {
    root: __dirname,
  },

  // (Optional) Keep it external for webpack too, if used for server build
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = Array.isArray(config.externals)
        ? config.externals
        : (config.externals ? [config.externals] : []);
      externals.push('@google-cloud/datastore');
      config.externals = externals;
    }
    return config;
  },
};

export default nextConfig;
