const gulp = require('gulp')

module.exports.moveKthStyle = function () {
  gulp.src('./node_modules/kth-style/sass/**')
    .pipe(gulp.dest('./public/css/kth-style/'))
  gulp.src('./node_modules/kth-style/img/**')
    .pipe(gulp.dest('./public/img/kth-style/'))
}

module.exports.moveBootstrap = function () {
  gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./public/css/bootstrap/'))

  gulp.src('./node_modules/bootstrap/dist/css/bootstrap-theme.min.css')
    .pipe(gulp.dest('./public/css/bootstrap/'))

  gulp.src('./node_modules/bootstrap/dist/fonts/**/*.{ttf,woff*,eof,svg}')
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