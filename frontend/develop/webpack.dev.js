const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://host.docker.internal:8181/',
        libraryTarget: 'var',
        library: 'WebCardDevelop'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        disableHostCheck: true,
        host: "0.0.0.0",
        port: "8181",
        //open: true,
        open: false, // since opening http:/0.0.0.0:8181/ will error
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});