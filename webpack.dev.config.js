const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = '/';
const buildPath = 'build';

module.exports = {
    entry: path.join(__dirname, 'public/main.js'),
    output: {
        path: path.join(__dirname, buildPath),
        filename: 'bundle.js', //打包文件名
        publicPath: publicPath, //重要！
    },
    devtool: 'inline-source-map',
    devServer: {
        publicPath: publicPath,
        contentBase: path.resolve(__dirname, buildPath),
        inline: true,
        hot: true,
    },
    plugins: [ // 插件
        new htmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html'),
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 如果想要启用 CSS 模块化，可以为 css-loader 添加 modules 参数即可
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=5000' },
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader?limit=5000' },
            { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve('src'),
        }
    },
}