const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const resolve = (dir) => path.resolve(__dirname, dir);
const cracoBabelLoader = require('craco-babel-loader');
// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = (relativePath) => path.resolve(appDirectory, relativePath);

const { getLoader, loaderByName } = require('@craco/craco');
// Replace `components` with your folder's structure.
// Again, Here I'm showcasing my current project.
const absolutePath = path.join(__dirname, '../../packages');

module.exports = {
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          resolvePackage('node_modules/@stafihub/apps-util'),
          resolvePackage('node_modules/@stafihub/apps-wallet'),
          resolvePackage('node_modules/@stafihub/types'),
        ],
      },
    },
  ],
  webpack: {
    alias: {
      // buffer: 'buffer',
      // stream: 'stream-browserify',
      //   path: false,
      //   fs: false,
      // crypto: 'crypto-browserify',
      '@components': resolve('src/components'),
      '@images': resolve('src/assets/images'),
      '@features': resolve('src/features'),
      '@servers': resolve('src/servers'),
      '@util': resolve('src/util'),
      '@keyring': resolve('src/keyring'),
      '@config': resolve('src/config'),
      '@shared': resolve('src/shared'),
    },
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include) ? match.loader.include : [match.loader.include];
        // match.loader.include = include.concat(absolutePath, schonComponents);
        match.loader.include = include.concat(absolutePath);
      }

      if (env === 'production') {
        webpackConfig.optimization = {
          splitChunks: {
            chunks: 'all',
            minSize: 1000000,
            maxSize: 5000000,
            cacheGroups: {
              // vendor: {
              //   test: /[\\/]node_modules[\\/]/,
              //   priority: -10,
              //   name(module) {
              //     // get the name. E.g. node_modules/packageName/not/this/part.js
              //     // or node_modules/packageName
              //     const packageName = module.context.match(
              //       /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              //     )[1];
              //     // npm package names are URL-safe, but some servers don't like @ symbols
              //     return `npm.${packageName.replace("@", "")}`;
              //   },
              // },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }

      return {
        ...webpackConfig,
        plugins: [
          ...webpackConfig.plugins.filter(({ constructor }) => constructor && constructor.name !== 'ModuleScopePlugin'),
          // new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
          // new NodePolyfillPlugin({ excludeAliases: ['console'] }),
        ],
        resolve: {
          ...webpackConfig.resolve,

          fallback: {
            ...webpackConfig.resolve.fallback,
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            path: require.resolve('path-browserify'),
            fs: false,
            crypto: false,
            https: false,
            http: false,
            // crypto: require.resolve('crypto-browserify'),
            // querystring: false,
            // url: false,
            // path: false,
          },
        },
      };
    },
  },
};
