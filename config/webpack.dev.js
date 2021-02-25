const webpackConfigCreator = require("./webpack.common");
const merge = require("webpack-merge");
const path =require("path");

const config={  
    devServer:{
        contentBase:path.join(__dirname,"./build"),
        historyApiFallback: true,
        host:'127.0.0.1',
        port:3111,
        open:true, 
       // inline: true,
       // hot:true
    }
}

const options={ 
    mode:"development"
}

module.exports ={...webpackConfigCreator(options),...config};
