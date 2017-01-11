const gulpUtil = require('gulp-util')
const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const path = require('path')
const mergeStream = require('merge-stream')

const { isDevelopment } = require('./common')

module.exports = function (globals) {
  gulpUtil.log(gulpUtil.colors.green('Running Sass transpile'))
  gulpUtil.log(gulpUtil.colors.blue('includePaths: ' + path.join(globals.dirname || '', 'node_modules')))

  const localCss = gulp.src(['./public/css/!(_)*.scss'])
    .pipe(gulpIf(isDevelopment(), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: path.join(globals.dirname || '', 'node_modules')
    }).on('error', sass.logError))
    .pipe(gulpIf(isDevelopment(), sourcemaps.write('.')))
    .pipe(gulp.dest('dist/css'))

  const kthStylePath = path.join(globals.dirname || '', 'node_modules/kth-style/sass/*.scss')
  const kthStyleCss = gulp.src([kthStylePath])
    .pipe(gulpIf(isDevelopment(), sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: path.join(globals.dirname || '', 'node_modules')
    }).on('error', sass.logError))
    .pipe(gulpIf(isDevelopment(), sourcemaps.write('.')))
    .pipe(gulp.dest('./dist/css/kth-style'))

  return mergeStream(localCss, kthStyleCss)
}
