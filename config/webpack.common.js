const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
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
              },
              // 如果确认不需要node polyfill，设置resolve.alias设置为false
              alias: {
                crypto: false
              }
        },
        output:{
            filename:"js/bundle.js",
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
                        compact: false, // 这个建议配，能提升性能
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
            },// 处理sass
            {
                test: /\.s[ac]ss$/i,
                use: [
                MiniCssExtractPlugin.loader, 
                "css-loader",
                "postcss-loader", // 因为这里处理的是css文件，所以要放在sass-loader的上面
                "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass
                ]
            }, // 处理less
            {
              test: /\.less$/,
              use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
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
             
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname,'../public/favicon.ico'),
                        to: './' }
                ],
            }),
            new CleanWebpackPlugin(),
           
            new HtmlWebPackPlugin({
                template:'public/index.html',
                filename:'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash:4].css",
                chunkFilename: "[id].[contenthash:4].css"
            }),
    
            new webpack.DefinePlugin({
                API_ENV:JSON.stringify(options.mode)
            }),
            new webpack.ProvidePlugin({
                Buffer: ["buffer", "Buffer"],
                process:'process'
              }), 
            new TsconfigPathsPlugin({ 
                configFile: "tsconfig.json" 
            })
        ]
    }
}

module.exports = webpackCommonConfigCreator;