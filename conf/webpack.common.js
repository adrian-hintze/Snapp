const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers.js');

module.exports = {
    entry: {
        polyfills: helpers.root('src', 'client', 'polyfills.ts'),
        vendor: helpers.root('src', 'client', 'vendor.ts'),
        main: helpers.root('src', 'client', 'app.ts')
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: helpers.root('client-tsconfig.json')
                }
            }, {
                loader: 'angular2-template-loader'
            }],
            exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-loader'
            }]
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'resources/imgs/[name].[hash].[ext]'
                }
            }]
        }, {
            test: /\.css$/,
            include: [helpers.root('src', 'client')],
                use: [{
                    loader: 'to-string-loader'
                }, {
                    loader: 'css-loader'
                }]
        }, {
            test: /\.css$/,
            exclude: [helpers.root('src', 'client')],
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }]
        }]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: helpers.root('src', 'client', 'app.html'),
            filename: 'snapp.html',
            favicon: helpers.root('src', 'client', 'favicon.ico')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        })
    ],

    output: {
        path: helpers.root('build', 'WebContent'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    optimization: {
        noEmitOnErrors: true
    }
};
