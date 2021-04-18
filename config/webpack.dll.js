const webpack = require('webpack');
const path = require('path')

const vendors = [
  'antd',
  'react',
  'react-dom',
  'react-redux',
  'react-router',
  'react-router-dom',
  'redux',
  '@ant-design/icons',
  'lodash',
  'moment'
];

module.exports = {
    output: {
        path: path.resolve(__dirname,"../dll"),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path:path.resolve(__dirname,"../dll/manifest.json"),
            name: '[name]',
            context: path.join(__dirname, '..'),
        }),
    ],
};