const packageJson = require('./package.json');
const version = packageJson.version;
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleTracker = require('webpack-bundle-tracker');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            contentBase: './dist',
            hot: true,
            disableHostCheck: true,
            //open: true,
            open: false,
            //openPage: './dist/index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 8183,
            host: argv.mode === 'production' ? 'localhost' : '0.0.0.0',
            disableHostCheck: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        },
        entry: {app: './src/index.js'},
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: argv.mode === 'production' ?
                'https://webcard-bucket.s3.amazonaws.com/static/frontend/market/dist'
                : 'http://host.docker.internal:8183',
            filename: argv.mode === 'production' ? `[name].[chunkhash].js` : `[name].bundle.js`,  //`[name].min.js`
            libraryTarget: 'var',
            library: 'WebCardMarket'
        },
        optimization: {
            minimizer: [new TerserPlugin({
                //extractComments: true,
                //cache: true,
                //parallel: true,
                //sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                }

            })],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                    ]
                                ]
                            }
                        }
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    use: [
                        {loader: 'url-loader'},
                    ]
                },
                {
                    test: /\.(csv|tsv)$/,
                    use: [
                        {loader: 'csv-loader'},
                    ]
                },
                {
                    test: /\.xml$/,
                    use: [
                        {loader: 'xml-loader'},
                    ]
                },
            ],
        },
        resolve: {
            alias: {}
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Webcard Market Place',
                template: './src/index.html',
                filename: 'index.html'
            }),
            new webpack.BannerPlugin(`[name] v${version} Copyleft(c) 2020`),
            /* FIXME: this emits Error: EEXIST: file already exists, mkdir at BundleTrackerPlugin._writeOutput()
               - reverted webpack-bundle-tracker to 0.4.3 version. */
            new BundleTracker({
                path: __dirname,
                filename: './webpack-stats.json'
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            }),
        ],
    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
        conf.plugins.push(new webpack.HotModuleReplacementPlugin());
    } else { // production
        conf.devtool = 'source-map';
        conf.plugins.push(new UglifyJSPlugin({
            sourceMap: true
        }));
        conf.plugins.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }));
        conf.plugins.push(new webpack.HashedModuleIdsPlugin());
    }

    return conf;

};