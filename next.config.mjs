/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
      };
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

    return config;
  },
  transpilePackages: [
    '@firebase/auth',
    '@firebase/app',
    '@firebase/firestore',
    'firebase',
    '@supabase/supabase-js',
    'undici'
  ]
};

export default nextConfig;
