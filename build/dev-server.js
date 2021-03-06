/**
 * Created by 小黑 on 2017/11/14.
 */
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.dev.config');
const options = {
    contentBase: './dist',
    hot: true,
    host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints( config, options );

const compiler = webpack( config );
const server = new webpackDevServer( compiler, options );

server.listen( 8080, 'localhost', () => {
    console.log('dev server listening on port 8080');
})