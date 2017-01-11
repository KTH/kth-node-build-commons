const gulp = require('gulp')
const del = require('del')
const mergeStream = require('merge-stream')

module.exports.moveKthStyle = function () {
  return gulp.src('./node_modules/kth-style/dist/img/**')
    .pipe(gulp.dest('dist/img/kth-style'))
}

module.exports.moveBootstrap = function () {
  const bootstrap = gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
  ])
    .pipe(gulp.dest('dist/css/bootstrap'))

  const fonts = gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('dist/css/fonts'))

  return mergeStream(bootstrap, fonts)
}

module.exports.moveFontAwesome = function () {
  const css = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('dist/css/font-awesome'))

  const fonts = gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('dist/css/fonts'))

  return mergeStream(css, fonts)
}

module.exports.cleanKthStyle = function () {
  // Performing this sync because we want to make sure nothing else is started
  // before this is completed
  del.sync(['dist/css/kth-style/*', 'dist/img/kth-style/*'])
}
