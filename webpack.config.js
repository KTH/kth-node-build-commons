'use strict'
var deepAssign = require('deep-assign')

/**
 * This file contains some standard options for webpack. They are merged with provided
 * options by using the exported config factory.
 */

const webpackConfig = {
  externals: {
    jquery: 'jQuery',
    knockout: 'ko'
  },
  plugins: [],
  module: {
    rules: [{
      resource: {
        test: /\.js?$/,
        exclude: /(node_modules)/ // Is this a bad idea? It prevents us from using ES2015 in node modules
      },
      use: [{
        loader: 'babel-loader',
        options: { presets: ['es2015'] }
      }]
    },
    {
      test: /\.html$/,
      loader: 'html-loader'
    }]
  }
}

module.exports = function (options) {
  // Create a config object by doing a deep merge, options override webpackConfig
  const outp = deepAssign({}, webpackConfig, options)
  return outp
}
