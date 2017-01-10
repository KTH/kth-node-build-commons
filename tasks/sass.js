const gulpUtil = require('gulp-util')
const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const mergeStream = require('merge-stream')

const { isDevelopment } = require('./common')

module.exports = function () {
  gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
  const localCss = gulp.src(['./public/css/!(_)*.scss'])
    .pipe(gulpIf(isDevelopment(), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulpIf(isDevelopment(), sourcemaps.write('.')))
    .pipe(gulp.dest('./public/css'))

  const kthStyleCss = gulp.src(['./public/css/kth-style/!(_)*.scss'])
    .pipe(gulpIf(isDevelopment(), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulpIf(isDevelopment(), sourcemaps.write('.')))
    .pipe(gulp.dest('./public/css/kth-style'))

  return mergeStream(localCss, kthStyleCss)
}
