const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const argv = require('yargs').argv
const getWebpackJSConfig = require('../webpack.config')
const gulpWebpack = require('webpack-stream')
const webpack2 = require('webpack')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin

const { isDevelopment, onError } = require('./common')

module.exports = function (globals) {
  return function () {
    const destinationPath = 'dist/js'

    return gulp.src('public/js/app/view/*.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulpWebpack(getWebpackJSConfig({
        devtool: isDevelopment() ? 'source-map' : undefined,
        plugins: !isDevelopment() ? [ new UglifyJsPlugin({
          sourceMap: true,
          output: {
            comments: argv['preserve-comments']
          }
        }) ] : undefined
      }), webpack2)) // <- passing webpack 2 to webpack-stream because it is bundled with an older version
      .pipe(gulp.dest(destinationPath))
  }
}
