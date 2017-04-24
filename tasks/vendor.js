const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const webpack = require('webpack-stream')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const mergeStream = require('merge-stream')

const { isDevelopment, onError } = require('./common')

module.exports = function (globals) {
  return function (env) {
    const vendor = gulp.src('./public/js/vendor.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(webpack({
        devtool: isDevelopment() ? 'source-map' : undefined,
        plugins: !isDevelopment() ? [ new UglifyJsPlugin({ sourceMap: true }) ] : undefined
      }))
      .pipe(gulp.dest('dist/js'))

    const components = gulp.src('./public/js/components/**')
      .pipe(gulp.dest('dist/js/components'))

    return mergeStream(vendor, components)
  }
}
