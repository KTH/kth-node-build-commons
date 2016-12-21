'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const gulpUtil = require('gulp-util')
const del = require('del')
const print = require('gulp-print')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const webpack = require('webpack-stream')
const named = require('vinyl-named')
const uglify = require('gulp-uglify')
const path = require('path')
const UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin
const argv = require('yargs').argv

const getWebpackJSConfig = require('./webpack.config')
const assets = ['moveKthStyle', 'moveBootstrap', 'moveFontAwesome']

const growly = require('growly')
let dirname
let startPath

/**
 * 
 * If you call gulp webpack:prod|ref you can specify --preserve-comments to keep all
 * your comments, which is required when using knockout. I didn't manage to do more
 * precise filtering of comments.
 * 
 */

function getUglifyOptions () {
  if (argv['preserve-comments']) {
    return {
      preserveComments: 'all'
    }
  } else {
    return undefined
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

gulp.task('moveAssets', assets)

gulp.task('moveKthStyle', ['clean'], function () {
  gulp.src('./node_modules/kth-style/sass/**')
    .pipe(gulp.dest('./public/css/kth-style/'))
  gulp.src('./node_modules/kth-style/img/**')
    .pipe(gulp.dest('./public/img/kth-style/'))
})

gulp.task('moveBootstrap', function () {
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./public/css/bootstrap/'))

  gulp.src('./node_modules/bootstrap/dist/css/bootstrap-theme.min.css')
    .pipe(gulp.dest('./public/css/bootstrap/'))

  gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))
})

gulp.task('moveFontAwesome', function () {
  gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./public/css/font-awesome/'))

  gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))
})

gulp.task('clean', function () {
  del(['./public/css/kth-style/*'])
  del(['./public/img/kth-style/*'])
})

gulp.task('transpileSass', function () {
  gulpUtil.log(gulpUtil.colors.bold.underline.blue('Sass Transpile'))

  if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'ref') {
    gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
    gulp.src(['./public/css/**/*.scss'])
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(gulp.dest('./public/css'))
  } else {
    gulpUtil.log(gulpUtil.colors.cyan('Did not run Sass transpile'))
  }
})

function bundleWithWebpack (src, dest, options) {
  return gulp.src(src)
    .pipe(print())
    .pipe(named())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(webpack(options))
    .pipe(gulp.dest(dest))
}

gulp.task('vendor:dev', function () {
  return bundleWithWebpack('./public/js/vendor.js', 'bundles/dev', {
    devtool: 'source-map'
  })
})

gulp.task('vendor:prod', function () {
  return bundleWithWebpack('./public/js/vendor.js', 'bundles/prod', {
    plugins: [ new UglifyJsPlugin() ]
  })
})

gulp.task('vendor:ref', function () {
  return bundleWithWebpack('./public/js/vendor.js', 'bundles/ref', {
    plugins: [ new UglifyJsPlugin() ]
  })
})

gulp.task('webpack:dev', function () {
  gulp.src('public/js/app/view/*.js')
    .pipe(print())
    .pipe(named())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(webpack(getWebpackJSConfig({
        resolve: { 
          alias: { 
            config: path.join(dirname, `public/js/app/config-dev.js`) 
          } 
        },
        devtool: 'source-map'
    })))
    .pipe(gulp.dest('bundles/dev/app/view/'))
})

gulp.task('webpack:ref', function () {
  gulp.src('public/js/app/view/*.js')
    .pipe(print())
    .pipe(named())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(webpack(getWebpackJSConfig({
        resolve: { 
          alias: { 
            config: path.join(dirname, `public/js/app/config-ref.js`) 
          } 
        }
    })))
    .pipe(uglify(getUglifyOptions()))
    .pipe(gulp.dest('bundles/ref/app/view/'))
})

gulp.task('webpack:prod', function () {
  gulp.src('public/js/app/view/*.js')
    .pipe(print())
    .pipe(named())
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(webpack(getWebpackJSConfig({
        resolve: { 
          alias: { 
            config: path.join(dirname, `public/js/app/config-prod.js`) 
          } 
        }
    })))
    .pipe(uglify(getUglifyOptions()))
    .pipe(gulp.dest('bundles/prod/app/view/'))
})

gulp.task('watch', function () {
  return gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack:dev'])
})

module.exports = {
  gulp,
  addAssetTask(str) {
    assets.push(str)
  },
  setStartpath(_path) {
    startPath = _path
  },
  setDirname(_dirname) {
    dirname = _dirname
}}
