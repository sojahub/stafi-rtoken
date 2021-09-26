const WebpackBar = require('webpackbar');
const webpackConfigCreator = require('./webpack.common-new');
const TerserJsPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// bundle analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// gzip
const CompressionPlugin = require('compression-webpack-plugin');

// const merge = require("webpack-merge");
// const optimizeCss = require('optimize-css-assets-webpack-plugin');

const config = {
  // plugins:[
  //     new optimizeCss({
  //         cssProcessor:require("cssnano"),
  //         cssProcessorOptions:{
  //             discardComments:{
  //                 removeAll:true
  //             }
  //         }
  //     })
  // ]
  performance: {
    maxEntrypointSize: 10 * 1024 * 1024,
    maxAssetSize: 10 * 1024 * 1024,
  },
};

const options = {
  mode: 'production',
  devtool: 'eval',
  optimization: {
    minimizer: [
      new TerserJsPlugin({
        minify: TerserJsPlugin.uglifyJsMinify,
        terserOptions: {
          compress: {
            drop_console: false,
          },
          format: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          // name: "vendors",
          // chunks: "initial",
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
};
const webpackConfig = webpackConfigCreator(options);

const plugins = [
  // new CompressionPlugin({
  //   filename: '[path][base].gz',
  //   algorithm: 'gzip',
  //   test: new RegExp('\\.(js|css)$'),
  //   threshold: 10240,
  //   minRatio: 0.8,
  // }),
  new WebpackBar({
    name: 'stafi-rtoken',
    color: 'green',
  }),
  // new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
];
webpackConfig.plugins = [...webpackConfig.plugins, ...plugins];

module.exports = { ...webpackConfig, ...config };
