const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const resolve = dir => path.resolve(__dirname, dir); 

// console.log("manifest.json=>",require('../dll/manifest.json'))
 

// console.log("Building...")

function webpackCommonConfigCreator(options){
    return {
        mode:options.mode,
        optimization:options.optimization,
        devtool:options.devtool,//'cheap-module-source-map',
        entry:{
          main:'./app/index.tsx'
        },
        resolve:{
            extensions: ['.ts', '.tsx', '.js', '.json'],
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
               path:false,
                crypto: 'crypto-browserify',   
                '@components': resolve('../app/components'), 
                '@images': resolve('../app/assets/images'), 
                "@features": resolve('../app/features'),
                "@servers": resolve('../app/servers'),
                "@util":resolve('../app/util'),
                "@keyring":resolve('../app/keyring'),
                "@config":resolve('../app/config'),
                "@shared":resolve('../app/shared'),
            },
            plugins:[
                new TsconfigPathsPlugin({ 
                    configFile: "tsconfig.json" 
                })
            ]
        },
        output:{
            filename:"js/[name].[chunkhash].bundle.js",
            path:path.resolve(__dirname,"../build"),
            assetModuleFilename: 'assets/[hash][ext][query]',
            publicPath:"/"
        }, 
        module:{
            rules:[
              {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        babelrc:true,
                        sourceType: 'unambiguous',
                        compact: false,  
                        presets:['@babel/preset-react','@babel/preset-env'],
                        cacheDirectory:true,
                        plugins: [
                            [
                                require.resolve('babel-plugin-import-globals'),
                                {
                                    'process': require.resolve('process'),
                                    'Buffer': {moduleName: require.resolve('buffer'), exportName: 'Buffer'},
                                },
                            ],
                        ],
                    }
                }
            },
            {
                test: /\.css$/,    
                use: [MiniCssExtractPlugin.loader,'css-loader']   
            },
             
            {
                test: /\.(s[ac])ss$/i,
                use: [
                MiniCssExtractPlugin.loader, 
                'css-loader',
                'postcss-loader',
                "sass-loader"  
                ]
            },  
            {
              test: /\.less$/,
              use: [
                MiniCssExtractPlugin.loader, 
                'css-loader',
              "less-loader",'postcss-loader'
            ]
            }, 
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                type: 'asset',
                parser: {
                  dataUrlCondition: {
                    maxSize: 4 * 1024 // 4kb
                  }
                }
              },
              {
                test: /\.(svg|eot|woff|woff2|ttf)/,
                type: 'asset',
                generator: {
                  filename: 'fonts/[hash][ext][query]'
                },
                parser: {
                  dataUrlCondition: {
                    maxSize: 4 * 1024 // 4kb
                  }
                }
              },{
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'ts-loader',
                  },
                ],
              },
              {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
              }
            ],
              
    
        },
        plugins:[
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/
              }),
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname,'../public/favicon.ico'),to: './' },
                    { from: path.join(__dirname,'../dll'), to: "./dll" },
                ],
            }),
            new HtmlWebPackPlugin({
                template:'public/index.html',
                filename:'index.html',
                dll: `/dll/lib.js`
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name].[contenthash:4].css",
                chunkFilename: "[id].[contenthash:4].css"
            }),
    
            new webpack.DefinePlugin({
                API_ENV:JSON.stringify(options.mode)
            }),
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process:'process',
                stream: 'stream',
                // crypto:'crypto',
                path:'path'
              }), 
              new webpack.DllReferencePlugin({
                context: path.join(__dirname, '..'),
                manifest: require('../dll/manifest.json'),
              }),
        ]
    }
}

module.exports = webpackCommonConfigCreator;
// process.env.NODE_ENV