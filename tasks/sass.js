const gulpUtil = require('gulp-util')
const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const { isDevelopment } = require('./common')

module.exports = function () {
  gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
  return gulp.src(['./public/css/*.scss'])
    .pipe(gulpIf(isDevelopment(), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulpIf(isDevelopment(), sourcemaps.write()))
    .pipe(gulp.dest('./public/css'))
}
