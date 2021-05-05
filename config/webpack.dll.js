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
  'moment',
  '@polkadot/api',
  '@polkadot/extension-dapp',
  '@polkadot/keyring',
  'web3',
  'web3-utils',
  '@cosmjs/stargate',
  '@cosmjs/proto-signing'
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
    resolve:{ 
        fallback: {
            crypto: require.resolve('crypto-browserify'), 
            buffer: require.resolve('buffer/'), 
            stream: require.resolve('stream-browserify'),
            http: false,
            https:false,
            path:false
        },
         
        alias: {
           stream: "stream-browserify",
            crypto: false,    
            hath:false
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process:'process',
            stream: 'stream',
            path:'path'
          }), 
        new webpack.DllPlugin({
            path:path.resolve(__dirname,"../dll/manifest.json"),
            name: '[name]',
            context: path.join(__dirname, '..'),
        }),
    ],
};