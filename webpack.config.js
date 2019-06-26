'use strict'

const deepAssign = require('deep-assign')
const Visualizer = require('webpack-visualizer-plugin')

/**
 * This file contains some standard options for webpack. They are merged with provided
 * options by using the exported config factory.
 */

const webpackConfig = {
  externals: {
    jquery: 'jQuery',
    knockout: 'ko',
  },
  plugins: [
    new Visualizer({
      filename: './webpackClientSize.html',
    }),
  ],
  module: {
    rules: [
      {
        resource: {
          test: /\.js?$/,
          exclude: /(node_modules)/, // Is this a bad idea? It prevents us from using ES2015 in node modules
        },
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
}

module.exports = options => {
  // Create a config object by doing a deep merge, options override webpackConfig
  const outp = deepAssign({}, webpackConfig, options)
  return outp
}
