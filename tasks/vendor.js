const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const webpack = require('webpack-stream')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const mergeStream = require('merge-stream')

const { isDevelopment, getEnvKey, onError } = require('./common')

const destinationPaths = {
  'dev': 'dist/js/dev',
  'ref': 'dist/js/ref',
  'prod': 'dist/js/prod'
}

module.exports = function (env) {
  return function () {
    const vendor = gulp.src('./public/js/vendor.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(webpack({
        devtool: isDevelopment(env) ? 'source-map' : undefined,
        plugins: !isDevelopment(env) ? [ new UglifyJsPlugin() ] : undefined
      }))
      .pipe(gulp.dest(destinationPaths[getEnvKey(env)]))

    const components = gulp.src('./public/js/components/**')
      .pipe(gulp.dest('dist/js/components'))

    return mergeStream(vendor, components)
  }
}
