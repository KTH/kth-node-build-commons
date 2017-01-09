const gulpUtil = require('gulp-util')
const gulp = require('gulp')
const sass = require('gulp-sass')

const { isProduction, isReference } = require('./common')

module.exports = function () {
  gulpUtil.log(gulpUtil.colors.bold.underline.blue('Sass Transpile'))

  // TODO: Use common to detect target env
  if (isProduction() || isReference()) {
    gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
    gulp.src(['./public/css/**/*.scss'])
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(gulp.dest('./public/css'))
  } else {
    gulpUtil.log(gulpUtil.colors.cyan('Did not run Sass transpile'))
  }
}