const webpack = require('webpack');
const Path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        "index": __dirname + "/src/indexForward.js"
    },
    output: {
        filename: '[name].js',
        path: Path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2',
        // libraryExport: "default",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,         // Match both .js and .jsx files
                exclude: /node_modules/,
                loader: "babel-loader",
                //额外的配置项
                options: {
                    presets: [
                        '@babel/react',
                        ['@babel/preset-env', {
                            targets: {
                                browsers: ['last 2 versions']
                            }
                        }] //env 打包的时候根据环境去做适配 兼容各种浏览器最新的2个版本
                    ],
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)$/i,
                loader: 'url-loader',
                options: {
                    // inline base64 DataURL for <=2KB images, direct URLs for the rest
                    limit: 2048,
                    name: '[name]_[md5:hash:base64:6].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: [".jsx", ".js", ".css"],
        alias: {
            '@': Path.resolve('src'),
        }
    },
    externals: [nodeExternals()],
    plugins: [
        new CleanWebpackPlugin(['lib']),
        new UglifyJSPlugin()
    ],
//     optimization: {
//         // splitChunks: {
//         //     cacheGroups: {
//         //         //命名不限于jquery
//         //         jquery: {
//         //             chunks: "initial",
//         //             name: "./public/jquery",
//         //             enforce: true
//         //         }
//         //     }
//         // }
//         // splitChunks: {
//         //     cacheGroups: {
//         //         commons: {
//         //             chunks: 'initial',
//         //             minChunks: 2, maxInitialRequests: 5,
//         //             minSize: 0
//         //         },
//         //         vendor: {
//         //             test: /node_modules/,
//         //             chunks: 'initial',
//         //             name: 'vendor',
//         //             priority: 10,
//         //             enforce: true
//         //         }
//         //     }
//         // }
//         splitChunks:{
//             //对entry进行拆分
//             chunks: 'all',
//             minSize: 30000,
//             cacheGroups:{
// //比如你要单独把vue等官方库文件打包到一起，可以使用这个缓存组，如果要具体到库文件，可以单独给库文件写一个缓存组
//                 vendor:{
//                     test: /node_modules/,
//                     priority: 10,
//                     name: "vendor",
//                     enforce: true
//                 },
// //这里定义分离前被引用过两次的文件，将其一同打包到common.js,最小为30kb
//                 common:{
//                     name: "common",
//                     minChunks: 2,
//                     minSize: 20000
//                 }
//             }
//         }
//     }
};
