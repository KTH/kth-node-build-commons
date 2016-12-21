'use strict'

const webpack = require('webpack')
var deepAssign = require('deep-assign')

/**
 * This file contains some standard options for webpack. They are merged with provided
 * options by using the exported config factory.
 */

const webpackConfig = {
  resolve: {
  },
  externals: {
    jquery: 'jQuery',
    knockout: 'ko'
  },
  plugins: [],
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
      loader: 'url-loader?limit=100000'
    }]
  }

}


module.exports = function (options) {
  // Create a config object by doing a deep merge, options override webpackConfig
  const outp = deepAssign({}, webpackConfig, options)
  return outp
}
