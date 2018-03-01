const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); //优化
const baseConfig = require('./webpack.base.config');



module.exports = merge( baseConfig, {
    output: {
        filename: 'assets/js/[name]/[name].[hash].js',
        publicPath: '/',
        path: path.resolve( __dirname, '../dist' ),
        chunkFilename:'[id].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use:  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader"]
                })
            },
            {
                test: /\.less$/,
                use:  ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","less-loader"]
                })
            }
        ]
    },
    plugins: [
        // new UglifyJSPlugin({
        //     sourceMap: true
        // }),
        new ExtractTextPlugin({
            filename: 'assets/css/[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['common','vendor'],
            minChunks: 2
        })
    ]
});