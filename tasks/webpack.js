const gulp = require('gulp')
const notify = require('gulp-notify')
const growly = require('growly')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const gulpIf = require('gulp-if')
const gulpUtil = require('gulp-util')
const argv = require('yargs').argv
const uglify = require('gulp-uglify')
const path = require('path')
const getWebpackJSConfig = require('../webpack.config')
const webpack = require('webpack-stream')

const { isProduction, isReference, isDevelopment, getEnvKey, onError } = require('./common')

const configPaths = {
  dev: `public/js/app/config-dev.js`,
  ref: `public/js/app/config-ref.js`,
  prod: `public/js/app/config-prod.js`
}

const destinationPaths = {
  dev: 'bundles/dev/app/view/',
  ref: 'bundles/ref/app/view/',
  prod: 'bundles/prod/app/view/'
}

function getUglifyOptions () {
  if (argv['preserve-comments']) {
    return {
      preserveComments: 'all'
    }
  } else {
    return undefined
  }
}

module.exports = function (env, globals) {
  return function () {
    const configPath = configPaths[getEnvKey(env)]
    const destinationPath = destinationPaths[getEnvKey(env)]

    gulp.src('public/js/app/view/*.js')
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
        devtool: isDevelopment(env) ? 'source-map' : undefined
      })))
      .pipe(gulpIf(isProduction(env), uglify(getUglifyOptions())))
      .pipe(gulp.dest(destinationPath))
  }
}
