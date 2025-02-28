/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    // Handle client-side modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }

    // Handle audio files
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Enable better ESM support
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['firebase', '@firebase/auth'],
  },
};

export default nextConfig;
