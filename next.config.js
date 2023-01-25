const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { withPlaiceholder } = require("@plaiceholder/next");
const dotenv = require('dotenv');
dotenv.config({
  path: '.env.local',
});

const bundleAnalyzer = withBundleAnalyzer({enabled: process.env.ANALYZE === 'true'});

const devMode = process.env.NODE_ENV === 'development' ? true : false;


const nextConfig = {
  reactStrictMode: true,
  env: {
    COMPANY_PHONE: process.env.COMPANY_PHONE,
    COMPANY_EMAIL: process.env.COMPANY_EMAIL,
    CRYPTO_SECRET_KEY: process.env.CRYPTO_SECRET_KEY,
    CRYPTO_SECRET_IV: process.env.CRYPTO_SECRET_IV,
    QRNG_API_KEY: process.env.QRNG_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    RANDOM_ORG_API_KEY: process.env.RANDOM_ORG_API_KEY,
    RANDOM_ORG_HAPI_KEY: process.env.RANDOM_ORG_HAPI_KEY,
  },
  swcMinify: true,
  compiler: {
    removeConsole: !devMode,
  },
  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack(config, options) {
    const { isServer } = options;
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
          fs: false
      }
    }
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    },
    {
      test: /\.txt$/i,
      use: [
        {
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    }
    );
    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/qr',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ]
  // }
}

module.exports = withPlugins([[bundleAnalyzer], [withPlaiceholder]], nextConfig);

module.exports = {
  serverRuntimeConfig: {
    apiRoutes: {
      readFiles: '/api/readFiles'
    }
  },
  publicRuntimeConfig: {
    apiRoutes: {
      readFiles: '/api/readFiles'
    }
  }
};