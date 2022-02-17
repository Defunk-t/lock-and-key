const Path = require('path');
const FS = require('fs');
const JsMinimizer = require('terser-webpack-plugin');
const CssExtractor = require("mini-css-extract-plugin");
const CssMinimizer = require('css-minimizer-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

/**
 * Entry points for webpack.
 * @type Object<string>
 */
const webpacks = {};

// Populate webpacks object from folders within src/webpacks folder
(webpackDir => FS.readdirSync(Path.join(__dirname, "src/webpacks"), {withFileTypes: true})
	.filter(entry => entry.isDirectory())
	.map(directory => directory.name)
	.forEach(webpack => webpacks[webpack] = Path.join(webpackDir, webpack))
)(Path.join(__dirname, "src/webpacks"));

/**
 * Webpack config export.
 * @type Object
 */
module.exports = {
	mode: "production",
	entry: webpacks,
	output: {
		filename: "[name].js",
		path: Path.join(__dirname, "dist")
	},
	plugins: [
		new CssExtractor(),
		new HtmlPlugin({
			title: 'Lock & Key',
			filename: '[name].html'
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					CssExtractor.loader,
					"css-loader"
				],
			},
		],
	},
	optimization: {
		minimizer: [new JsMinimizer(), new CssMinimizer()],
		minimize: true
	}
};
