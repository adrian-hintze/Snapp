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
        extensions: ['', '.js', '.ts']
    },

    module: {
        loaders: [{
            test: /\.ts$/,
            loaders: [
                `awesome-typescript-loader?configFileName=${helpers.root('client-tsconfig.json')}`,
                'angular2-template-loader'
            ]
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
            loader: 'file?name=resources/imgs/[name].[hash].[ext]'
        }, {
            test: /\.css$/,
            exclude: [
                helpers.root('src', 'client', 'components'),
                helpers.root('src', 'client', 'modules')
            ],
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
        }, {
            test: /\.css$/,
            include: [
                helpers.root('src', 'client', 'components'),
                helpers.root('src', 'client', 'modules')
            ],
            loader: 'raw'
        }]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: helpers.root('src', 'client', 'app.html'),
            filename: 'snapp.html',
            favicon: helpers.root('src', 'client', 'favicon.ico')
        })
    ]
};
