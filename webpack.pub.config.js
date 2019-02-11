const path = require('path')
const webpack = require('webpack');
// 导入每次删除文件夹的插件
const cleanWebpackPlugin = require('clean-webpack-plugin')
// 导入压缩js的插件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry:  path.join(__dirname, 'src/index.js'),
    //devtool: 'cheap-module-source-map',
    devtool: 'false',
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',  //发布组件专用
        //library: 'ReactCmp',
    },
    externals: [nodeExternals()],
    plugins: [ // 插件
        new cleanWebpackPlugin(['./lib']),
        new UglifyJSPlugin(), //压缩js
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    module: {
        rules: [
            // {
            //     test: /\.css$/, use: ExtractTextPlugin.extract({
            //         fallback: "style-loader",
            //         use: "css-loader",
            //         publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
            //     })
            // },
            // {
            //     test: /\.scss$/, use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'sass-loader'],
            //         publicPath: '../' // 指定抽取的时候，自动为我们的路径加上 ../ 前缀
            //     })
            // },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000&name=images/[hash:8]-[name].[ext]' },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000&name=images/[hash:8]-[name].[ext]' },
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: [".jsx", ".js", ".css"],
        alias: {
            '@': path.resolve('src'),
        }
    }
}