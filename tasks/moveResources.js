const gulp = require('gulp')
const del = require('del')

module.exports.moveKthStyle = function () {
  return gulp.src(['./node_modules/kth-style/sass/**',
            './node_modules/kth-style/img/**'])
    .pipe(gulp.dest('./public/css/kth-style/'))
}

module.exports.moveBootstrap = function () {
  return gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/bootstrap/dist/css/bootstrap-theme.min.css'])
    .pipe(gulp.dest('./public/css/bootstrap/'))
    .src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))
}

module.exports.moveFontAwesome = function () {
  gulp.src('./node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('./public/css/font-awesome/'))

  gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
    .pipe(gulp.dest('./public/css/fonts/'))
}

module.exports.cleanKthStyle = function () {
  del(['./public/css/kth-style/*'])
  del(['./public/img/kth-style/*'])
}