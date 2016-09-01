'use strict'

const path = require('path')
const webpack = require('webpack')

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

module.exports = {
  dev(dirname) {
    webpackConfig.resolve.alias = {
      config: path.join(dirname, `public/js/app/config-dev.js`)
    }

    webpackConfig.devtool = 'source-map'

    return webpackConfig
  },
  prod(dirname) {
    webpackConfig.resolve.alias = {
      config: path.join(dirname, `public/js/app/config-prod.js`)
    }

    return webpackConfig
  },
  ref(dirname) {
    webpackConfig.resolve.alias = {
      config: path.join(dirname, `public/js/app/config-ref.js`)
    }

    return webpackConfig
  }
}
