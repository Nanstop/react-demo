const path = require('path');
//css文件提取器需要的插件
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
//
// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// });

//postcss-loader 需要的配置项
// const precss = require('precss');
// const autoprefixer = require('autoprefixer');

let config = {
	entry: './main.js',
	output: {
		path: path.resolve(__dirname, '/bundle/'),
		filename: 'index.js',
		publicPath: '/assets/'
	},
	devServer: {
		inline: true,
		port: 7777
	},
	module: {
		loaders: [{
			test: /.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			},
		},
		{
			test: /\.scss$/,
			loaders: ["style-loader", "css-loader", "sass-loader"]
		},
		{ test: /\.css$/, loader: "style-loader!css-loader?modules"}]
	},
	// plugins: [
	// 	new ExtractTextPlugin('styles.css'),
	// ]
}
module.exports = config;
