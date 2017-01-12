const gulp = require('gulp')
const del = require('del')
const mergeStream = require('merge-stream')

const moveKthStyle = function (globals) {
  return function () {
    return gulp.src('./node_modules/kth-style/dist/img/**')
      .pipe(gulp.dest('dist/img/kth-style'))
  }
}

const moveBootstrap = function (globals) {
  return function () {
    const bootstrap = gulp.src([
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
      './node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
    ])
      .pipe(gulp.dest('dist/css/bootstrap'))

    const fonts = gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
      .pipe(gulp.dest('dist/css/fonts'))

    return mergeStream(bootstrap, fonts)
  }
}

const moveFontAwesome = function (globals) {
  return function () {
    const css = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
      .pipe(gulp.dest('dist/css/font-awesome'))

    const fonts = gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
      .pipe(gulp.dest('dist/css/fonts'))

    return mergeStream(css, fonts)
  }
}

const cleanKthStyle = function (globals) {
  return function () {
    // Performing this sync because we want to make sure nothing else is started
    // before this is completed
    del.sync(['dist/css/kth-style/*', 'dist/img/kth-style/*'])
  }
}

module.exports = function (globals) {
  return {
    moveKthStyle: moveKthStyle(globals),
    moveBootstrap: moveBootstrap(globals),
    moveFontAwesome: moveFontAwesome(globals),
    cleanKthStyle: cleanKthStyle(globals)
  }
}
