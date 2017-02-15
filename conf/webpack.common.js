const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const helpers = require('./helpers.js');

module.exports = {
    entry: {
        polyfills: './src/client/polyfills.ts',
        vendor: './src/client/vendor.ts',
        app: './src/client/app.ts'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'angular2-template-loader',
            }, {
                 loader: 'awesome-typescript-loader',
                 options: {
                     configFileName: helpers.root('client-tsconfig.json')
                 }
            }],
            exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: false
            }
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: 'file-loader',
            options: {
                name: 'resources/imgs/[name].[hash].[ext]'
            }
        }, {
            test: /\.css$/,
            exclude: [
                helpers.root('src', 'client')
            ],
            loader: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }],
                fallback: 'style-loader'
            })
        }, {
            test: /\.css$/,
            include: [
                helpers.root('src', 'client')
            ],
            use: [
                'raw-loader'
            ]
        }]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),
        new HtmlWebpackPlugin({
            template: helpers.root('src', 'client', 'app.html'),
            filename: 'snapp.html',
            favicon: helpers.root('src', 'client', 'favicon.ico')
        })
    ]
};
