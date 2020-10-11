const { merge: webpackMerge } = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const commonConf = require('./webpack.common.js');
const helpers = require('./helpers.js');

module.exports = webpackMerge(commonConf, {
    mode: 'production',

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    }
});
