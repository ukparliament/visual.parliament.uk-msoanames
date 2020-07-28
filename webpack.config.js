/*eslint-env node*/
const path = require("path");

module.exports = {
    entry: "./src/msoa.js",
    output: {
        path: path.resolve(__dirname, "./static"),
        filename: "msoa.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: ["env"],
                    plugins: [["transform-runtime", {
                        helpers: false,
                        polyfill: false,
                        regenerator: true}]]
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    mode: "production",
    devtool: "source-map",
    watch: true
};
