const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const gulpIf = require('gulp-if')
const argv = require('yargs').argv
const uglify = require('gulp-uglify')
const path = require('path')
const mergeStream = require('merge-stream')
const getWebpackJSConfig = require('../webpack.config')
const webpack = require('webpack-stream')

const { isProduction, isDevelopment, getEnvKey, onError } = require('./common')

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

function getUglifyOptions () {
  if (argv['preserve-comments']) {
    return {
      preserveComments: 'all'
    }
  } else {
    return undefined
  }
}

module.exports = function (globals) {
  return function (env) {
    const configPath = configPaths[getEnvKey(env)]
    const destinationPath = destinationPaths[getEnvKey(env)]

    const view = gulp.src('public/js/app/view/*.js')
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
    const components = gulp.src('./public/js/components/**')
      .pipe(webpack(getWebpackJSConfig({
        resolve: {
          alias: {
            config: path.join(globals.dirname, configPath)
          }
        },
        devtool: isDevelopment(env) ? 'source-map' : undefined
      })))
      .pipe(gulpIf(isProduction(env), uglify({preserveComments: 'all'})))
      .pipe(gulp.dest('dist/js/components'))

    return mergeStream(view, components)
  }
}
