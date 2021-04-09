const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

const resolve = dir => path.resolve(__dirname, dir); 
function webpackCommonConfigCreator(options){
    return {
        mode:options.mode,
        devtool:'cheap-module-source-map',
        entry:'./app/index.tsx',
        resolve:{
            extensions: ['.ts', '.tsx', '.js', '.json'],
            fallback: {
                crypto: require.resolve('crypto-browserify'), 
                buffer: require.resolve('buffer/'), 
                stream: require.resolve('stream-browserify'),
                http: false,
                https:false
            }, 
            alias: {
                stream: "stream-browserify",
                crypto: false,   
                '@components': resolve('../app/components'), 
                '@images': resolve('../app/assets/images'), 
                "@features": resolve('../app/features'),
                "@servers": resolve('../app/servers'),
                "@util":resolve('../app/util'),
                "@keyring":resolve('../app/keyring'),
                "@config":resolve('../app/config'),
                "@shared":resolve('../app/shared'),
            }
        },
        output:{
            filename:"js/[chunkhash].bundle.js",
            path:path.resolve(__dirname,"../build"),
            publicPath:"/"
        }, 
        module:{
            rules:[{
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
                use: ['style-loader','css-loader']   
            },
            // sass
            {
                test: /\.s[ac]ss$/i,
                use: [
                MiniCssExtractPlugin.loader, 
                "css-loader",
                "postcss-loader",  
                "sass-loader" 
                ]
            }, // less
            {
              test: /\.less$/,
              use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },// file-laoder 
            {
                test: /\.(jpg|png|jpeg|gif|svg)$/,
                use: ['file-loader']
            },{
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'ts-loader',
                  },
                ],
              },
              {enforce: 'pre', test: /\.js$/, loader: 'source-map-loader'},],
              
    
        },
        plugins:[
             
            
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname,'../public/favicon.ico'),
                        to: './' }
                ],
            }),
            new HtmlWebPackPlugin({
                template:'public/index.html',
                filename:'index.html'
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
                stream: 'stream'
              }), 
            new TsconfigPathsPlugin({ 
                configFile: "tsconfig.json" 
            })
        ]
    }
}

module.exports = webpackCommonConfigCreator;
// process.env.NODE_ENV