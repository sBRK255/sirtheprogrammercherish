/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
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

      // Add undici to external modules
      config.externals = [...(config.externals || []), 'undici'];
    }

    // Handle audio files
    config.module.rules.push({
      test: /\.mp3$/,
      type: 'asset/resource',
    });

    return config;
  },
  // Transpile specific modules
  transpilePackages: ['@firebase/auth'],
  experimental: {
    // Disable experimental features that might cause issues
    esmExternals: false,
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
