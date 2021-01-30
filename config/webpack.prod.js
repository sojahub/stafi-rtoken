const webpackConfigCreator = require("./webpack.common");
// const merge = require("webpack-merge");
// const optimizeCss = require('optimize-css-assets-webpack-plugin');

const config={
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
}

const options={
    mode:"production"
} 
module.exports = webpackConfigCreator(options);
