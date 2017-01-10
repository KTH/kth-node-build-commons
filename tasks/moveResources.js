const gulp = require('gulp')
const del = require('del')
const mergeStream = require('merge-stream')

module.exports.moveKthStyle = function () {
  const sass = gulp.src('./node_modules/kth-style/sass/**')
    .pipe(gulp.dest('./public/css/kth-style/'))

  const img = gulp.src('./node_modules/kth-style/img/**')
    .pipe(gulp.dest('./public/img/kth-style/'))

  return mergeStream(sass, img)
}

module.exports.moveBootstrap = function () {
  const bootstrap = gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
  ])
    .pipe(gulp.dest('./public/css/bootstrap/'))

  const fonts = gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))

  return mergeStream(bootstrap, fonts)
}

module.exports.moveFontAwesome = function () {
  const css = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./public/css/font-awesome/'))

  const fonts = gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))

  return mergeStream(css, fonts)
}

module.exports.cleanKthStyle = function () {
  return del(['./public/css/kth-style/*', './public/img/kth-style/*'])
}
