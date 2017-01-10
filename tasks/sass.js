const gulpUtil = require('gulp-util')
const gulp = require('gulp')
const sass = require('gulp-sass')

module.exports = function () {
  gulpUtil.log(gulpUtil.colors.bold.underline.blue('Sass Transpile'))

  gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
  gulp.src(['./public/css/**/*.scss'])
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./public/css'))

}