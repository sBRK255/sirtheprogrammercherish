/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add polyfills for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "undici": false,
        "encoding": false,
        "crypto": false,
        "stream": false,
        "http": false,
        "https": false,
        "zlib": false,
        "net": false,
        "tls": false,
        fs: false,
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
  transpilePackages: [
    'undici',
    '@firebase/auth',
    '@firebase/app',
    '@firebase/firestore',
    'firebase',
    '@supabase/supabase-js'
  ],
  experimental: {
    // Disable experimental features that might cause issues
    esmExternals: false,
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
