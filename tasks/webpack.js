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

function isProduction (env) {
  return env === 'production' || gulpUtil.env.production || process.env.NODE_ENV === 'production'
}

function isReference (env) {
  return env === 'reference' || gulpUtil.env.reference || process.env.NODE_ENV === 'ref'
}

function isDevelopment (env) {
  return env === 'development' || !isProduction(env) && !isReference(env)
}

function getEnvKey (env) {
  if (isProduction(env)) {
    return 'prod'
  } else if (isReference(env)) {
    return 'ref'
  } else {
    return 'dev'
  }
}

const onError = function (err) {
  console.log('err', err)
  growly.notify('Gulp failed!' + err)
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Beep'
  })(err)

  this.emit('end')
}

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
// TODO Better name for dirname. Is root for webpack ???
module.exports = function (env, dirname) {
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
            config: path.join(dirname, configPath)
          }
        },
        devtool: isDevelopment(env) ? 'source-map' : undefined
      })))
      .pipe(gulpIf(isProduction(env), uglify(getUglifyOptions())))
      .pipe(gulp.dest(destinationPath))
  }
}
