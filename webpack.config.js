const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const exampleCount = 20;


module.exports = () => {
    const output = {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/main.js',
        chunkFilename: "[name]/main.js"
    };

    const plugins = [];

    const entry = {};

    function makeEntry(example) {
        const root = path.resolve(__dirname, example);
        if (!fs.existsSync(root)) {
            return;
        }
        const pa = fs.readdirSync(root);
        const entryPath = path.resolve(root, "app.ts");
        const isEntry = fs.existsSync(entryPath);
        console.log(entryPath);
        if (isEntry) {
            entry[`${example}`] = entryPath;
        }
    }

    for (let i = 1; i < exampleCount; i++) {
        makeEntry(`examples/stage${`${i}`.slice(-2)}`);
    }

    for (let key in entry) {
        plugins.push(
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                filename: `${key}/index.html`,
                inject: false,
            })
        );
    };
    plugins.push(
        new CopyWebpackPlugin({
            patterns: [{ from: './public/assets', to: './examples/assets' }],
            options: {
                concurrency: 100,
            },
        }));

    if (process.env.NODE_ENV === 'development') {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.SourceMapDevToolPlugin({}),
        );
    }

    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        entry,
        output,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: { declaration: false }
                        }
                    },
                    exclude: /node_modules/
                }
            ],
        },

        devServer: {
            contentBase: path.join(__dirname, 'dist/examples/'),
            compress: true,
            port: 3000,
            hot: false,
            open: true
        },

        plugins,
    };
}