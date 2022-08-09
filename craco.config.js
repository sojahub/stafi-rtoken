const path = require('path');
const fs = require('fs');

const resolve = (dir) => path.resolve(__dirname, dir);
const cracoBabelLoader = require('craco-babel-loader');
// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd());
const resolvePackage = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  eslint: {
    enable: false,
  },
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [
          resolvePackage('node_modules/@stafihub/apps-config'),
          resolvePackage('node_modules/@stafihub/apps-util'),
          resolvePackage('node_modules/@stafihub/apps-wallet'),
          resolvePackage('node_modules/@stafihub/types'),
          resolvePackage('node_modules/@stafihub/react-components'),
        ],
      },
    },
  ],
  webpack: {
    alias: {
      stream: 'stream-browserify',
      //   path: false,
      //   fs: false,
      crypto: 'crypto-browserify',
      '@components': resolve('src/components'),
      '@images': resolve('src/assets/images'),
      '@features': resolve('src/features'),
      '@servers': resolve('src/servers'),
      '@util': resolve('src/util'),
      '@keyring': resolve('src/keyring'),
      '@config': resolve('src/config'),
      '@shared': resolve('src/shared'),
    },
  },
};
