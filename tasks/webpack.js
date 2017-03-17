const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print')
const argv = require('yargs').argv
const path = require('path')
const mergeStream = require('merge-stream')
const getWebpackJSConfig = require('../webpack.config')
const gulpWebpack = require('webpack-stream')
const webpack2 = require('webpack')
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

    const view = gulp.src('public/js/app/view/*.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulpWebpack(getWebpackJSConfig({
        resolve: {
          alias: {
            config: path.join(globals.dirname, configPath)
          }
        },
        devtool: isDevelopment(env) ? 'source-map' : undefined,
        plugins: !isDevelopment(env) ? [ new UglifyJsPlugin({
          sourceMap: true,
          output: {
            comments: argv['preserve-comments']
          }
        }) ] : undefined
      }), webpack2)) // <- passing webpack 2 to webpack-stream because it is bundled with an older version
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
