var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: {
        main:path.resolve(__dirname, 'src/js/main.js'),
        vendors: ["vue","vue-router"]
    },
    resolve: {
        root: path.join(__dirname, 'node_modules'),
        alias: {
            components: '../components', //
            lib: '../../js/lib',
            base: '../../js/base',
            js:'../../../js/base'
        },
        extensions: ['', '.js', '.vue', '.scss', '.css']
    },
    resolveLoader:{
        root: path.join(__dirname, 'node_modules')
    },
    output: {
        path: path.join(__dirname, "public/"),
        //publicPath: 'public/',
        filename: 'js/[name].js?[hash:6]',
        chunkFilename: 'js/[id].js?[hash:6]' //.[hash:6]
    },
    module: {
        noParse: [/jquery-3.1.1.min.js/],
        loaders: [
            {test: /\.vue$/, loader: 'vue'},
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 5000, // 
                    name: 'images/[name].[ext]?[hash:10]'
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 5000, // 
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    externals:{
        'jquery' : 'jQuery'
    },
    plugins: [
        //提取公用JS  对应  entry里面的vebdors
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            filename: 'js/common.min.js'
        })
    ],
    babel: { 
        "presets": ["es2015",'stage-2'],
        "plugins": ["transform-runtime"]
    }
}
