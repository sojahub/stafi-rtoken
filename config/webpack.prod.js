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

    // splitChunks: {
    //   cacheGroups: {
    //     common: {
    //       chunks: 'initial',
    //       name: 'commons',
    //       minSize: 30,
    //       minChunks: 2,
    //     },

    //     vender: {
    //       priority: 1,
    //       test: /node_modules/,
    //       chunks: 'initial',
    //       name: 'vendors',
    //       minSize: 0,
    //       minChunks: 1,
    //     },
    //   },
    // },
    splitChunks: {
      chunks: 'all',
    },
  },
};
const webpackConfig = webpackConfigCreator(options);

const plugins = [
  new CompressionPlugin({
    filename: '[path][base].gz',
    algorithm: 'gzip',
    test: new RegExp('\\.(js|css)$'),
    threshold: 10240,
    minRatio: 0.8,
  }),
  new WebpackBar({
    name: 'stafi-rtoken',
    color: 'green',
  }),
  new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
];
webpackConfig.plugins = [...webpackConfig.plugins, ...plugins];

module.exports = { ...webpackConfig, ...config };
