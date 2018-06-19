const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers.js');

module.exports = {
    entry: {
        polyfills: './src/client/polyfills.ts',
        vendor: './src/client/vendor.ts',
        app: './src/client/app.ts'
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
            exclude: [/\.(spec|e2e)\.ts$/]
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
            /*exclude: [
                helpers.root('src', 'client')
            ],*/
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            }]
        }/*, {
            test: /\.css$/,
            include: [
                helpers.root('src', 'client')
            ],
            use: [{
                loader: 'raw-loader'
            }]
        }*/]
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    plugins: [
        /*
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),*/
        new HtmlWebpackPlugin({
            template: helpers.root('src', 'client', 'app.html'),
            filename: 'snapp.html',
            favicon: helpers.root('src', 'client', 'favicon.ico')
        })
    ]
};
