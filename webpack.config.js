const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./src/map.js",
	output: {
		path: path.resolve(__dirname, "./static"),
		filename: "map.bundle.js"
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
