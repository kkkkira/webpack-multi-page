const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const webpack = require('webpack');

module.exports = merge( baseConfig, {
    output: {
        filename: '[name].js',
        publicPath: '/',
        path: path.resolve( __dirname, '../dist' ),
        chunkFilename:'[id].bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.(less|css)$/,
                use: ['style-loader', 'css-loader','less-loader']
            }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        //模块热替换，属于开发环境
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
});