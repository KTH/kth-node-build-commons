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
        test: /\.html$/
      },
      use: ['html']
    }, {
      resource: {
        test: /\.js?$/,
        exclude: /(node_modules)/
      },
      use: [{
        loader: 'babel',
        options: {
          presets: [ 'es2015', { 'modules': false } ]
        }
      }],
      query: { // TODO: Check this
        presets: ['es2015']
      }
    }, {
      resource: {
        test: /\.css$/
      },
      use: ['style-loader!css-loader']
    }, {
      resource: {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*)?$/
      },
      use: ['url-loader?limit=100000']
    }]
  }
}


module.exports = function (options) {
  // Create a config object by doing a deep merge, options override webpackConfig
  const outp = deepAssign({}, webpackConfig, options)
  return outp
}
