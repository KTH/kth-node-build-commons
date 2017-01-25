const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const argv = require('yargs').argv
const path = require('path')
const getWebpackJSConfig = require('../webpack.config')
const webpack = require('webpack-stream')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin

const { isDevelopment, getEnvKey, onError } = require('./common')

const configPaths = {
  dev: `public/js/app/config-dev.js`,
  ref: `public/js/app/config-ref.js`,
  prod: `public/js/app/config-prod.js`
}

const destinationPaths = {
  dev: 'dist/js/dev/app/view/',
  ref: 'dist/js/ref/app/view/',
  prod: 'dist/js/prod/app/view/'
}

module.exports = function (globals) {
  return function (env) {
    const configPath = configPaths[getEnvKey(env)]
    const destinationPath = destinationPaths[getEnvKey(env)]

    return gulp.src('public/js/app/view/*.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(webpack(getWebpackJSConfig({
        resolve: {
          alias: {
            config: path.join(globals.dirname, configPath)
          }
        },
        // Generate source maps for development
        devtool: isDevelopment(env) ? 'source-map' : undefined,
        // Perform uglify, respecting preserve-comments flag, if not development
        plugins: !isDevelopment(env) ? [ new UglifyJsPlugin({
          sourceMap: true,
          output: {
            comments: argv['preserve-comments']
          }
        }) ] : undefined
      })))
      .pipe(gulp.dest(destinationPath))
  }
}
