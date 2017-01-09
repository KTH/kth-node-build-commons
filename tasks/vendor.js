const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const webpack = require('webpack-stream')
const UglifyJsPlugin = require('UglifyJsPlugin')

const { isDevelopment, getEnvKey, onError } = require('./common')

const destinationPaths = {
  'dev': 'bundles/dev',
  'ref': 'bundles/ref',
  'prod': 'bundles/prod'
}

module.exports = function (env) {
  return function () {
    return gulp.src('./public/js/vendor.js')
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
  }
}
