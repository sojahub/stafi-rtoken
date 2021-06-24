const webpackConfigCreator = require('./webpack.common-new');
const merge = require('webpack-merge');
const path = require('path');
const paths = require('./paths');

const config = {
  devServer: {
    contentBase: path.join(__dirname, './build'),
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 3111,
    open: true,
    // inline: true,
    // hot:true
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
  },
};

const options = {
  mode: 'development',
};

module.exports = { ...webpackConfigCreator(options), ...config };
