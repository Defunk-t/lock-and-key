const path = require('path');

module.exports = {
	mode: "production",
	entry: path.join(__dirname, "src/app.js"),
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					"style-loader",
					"css-loader"
				],
			},
		],
	}
};
