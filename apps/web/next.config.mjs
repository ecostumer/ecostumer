/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'github.com' },
    ],
  },

  /**
   * @param {import('webpack').Configuration} config
   */
  webpack: (config) => {
    /**
     * Suppress warning about not found modules
     */
    config.resolve.fallback = {
      'aws-crt': false,
      encoding: false,
      '@aws-sdk/signature-v4-crt': false,
      bufferutil: false,
      'utf-8-validate': false,
    }

    // Ignorar arquivos .d.ts no processo de build
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'null-loader', // Isso garante que o Webpack ignore arquivos .d.ts
    })

    return config
  },
}

export default nextConfig
