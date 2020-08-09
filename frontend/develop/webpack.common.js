const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    node: {
        fs: 'empty'
    },
    entry: {
        app: './src/index.js',
        script: './src/editor.js',
        msgbox: './src/messagebox.js',
        audio: './src/audio.js',
        icon: './src/icon.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Webcard Editor',
            template: './src/test.html',
            excludeChunks: ['script', 'msgbox', 'audio', 'icon'],
            filename: 'index.html' // which is default
        }),
        new HtmlWebpackPlugin({
            title: 'Script Editor',
            template: './src/test.html',
            chunks: ['script'],
            filename: 'script.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Message Box',
            template: './src/test.html',
            chunks: ['msgbox'],
            filename: 'msgbox.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Audio Editor',
            template: './src/test.html',
            chunks: ['audio'],
            filename: 'audio.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Icon Editor',
            template: './src/test.html',
            chunks: ['icon'],
            filename: 'icon.html'
        }),
        new BundleTracker({
            filename: './webpack-stats.json'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: [ 'popper.js', 'default' ],
        })
    ],
    optimization: {
        runtimeChunk: false,
        //! todo: configure for multiple entry (app, script) chunks to work...
        //runtimeChunk: 'single',
        //runtimeChunk: 'multiple',
        /*
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
        */
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [ 'file-loader' ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [ 'file-loader' ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [ 'csv-loader' ]
            },
            {
                test: /\.xml$/,
                use: [ 'xml-loader' ]
            }
        ]
    }
}