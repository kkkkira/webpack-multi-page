const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var pageArr = [
    'welcome',
    'article'
];

var configEntry = {};
var configPlugin = [];

//设置入口路径
pageArr.forEach(( page ) => {
    configEntry[ page ] = path.resolve( __dirname, '../src/pages', page );
});


//生成对应的jade模板文件
pageArr.forEach(( page, index ) => {
    //设置对应的thunk name
    // let entryName = 'pages/' + page +  '/' + page;

    const htmlPlugin = new HtmlWebpackPlugin({
        title: page,
        filename:`${page}/index.html`,
        template: path.resolve( __dirname, '../src/pages', page, 'index.jade' ),
        minify: false,
        chunks: [ 'vendor', page,  'common' ]
    });

    configPlugin.push( htmlPlugin );
});

module.exports = {
    entry: Object.assign({},{
        vendor:[ "jquery" ]
    }, configEntry ),
    resolve: {
        alias: {
            assets: path.join( __dirname, '../src/assets/'),
            imgUrl: path.join( __dirname, '../src/assets/images')
        }
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use:[{
                    loader: 'expose-loader',
                    options: 'jQuery'
                },{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.jade$/,
                use: 'jade-loader'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:[{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'assets/img/[hash].[ext]'
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    
    plugins: [
        new CleanWebpackPlugin(['dist'],{
            root: path.join(__dirname, '..')
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ].concat( configPlugin )
}