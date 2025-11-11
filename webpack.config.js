const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        popup: './src/popup/index.tsx',
        background: './src/background.ts',
        content: './src/content.ts',
        inpage: './src/inpage.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        fallback: {
            crypto: false,
            stream: false,
            buffer: require.resolve('buffer/')
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.DEPLOYMENT': JSON.stringify(process.env.DEPLOYMENT || 'DEVELOPMENT')
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
        new webpack.BannerPlugin({
            banner: `
                // Service worker polyfill for window object
                if (typeof window === 'undefined') {
                    globalThis.window = globalThis;
                    globalThis.window.crypto = globalThis.crypto;
                    globalThis.window.msCrypto = null;
                }
            `,
            raw: true,
            entryOnly: false,
            test: /background\.js$/
        }),
        new HtmlWebpackPlugin({
            template: './src/popup/popup.html',
            filename: 'popup.html',
            chunks: ['popup']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })
    ],
    devtool: 'cheap-module-source-map'
};
