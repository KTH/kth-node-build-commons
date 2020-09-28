const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print').default
const gulpWebpack = require('webpack-stream')
const webpack2 = require('webpack')
const { UglifyJsPlugin } = require('webpack').optimize
const mergeStream = require('merge-stream')

const { isDevelopment, onError } = require('./common')

/**
 * This exported function takes the vendor.js file (which is a js file that contains external js libray files) and
 * prints the name for debugging purpose and
 */
module.exports = () => {
  return () => {
    const vendor = gulp
      .src('./public/js/vendor.js')
      .pipe(print())
      .pipe(named())
      .pipe(plumber({ errorHandler: onError }))
      .pipe(
        gulpWebpack(
          {
            devtool: isDevelopment() ? 'source-map' : undefined,
            plugins: !isDevelopment() ? [new UglifyJsPlugin({ sourceMap: true })] : undefined,
          },
          webpack2
        )
      )
      .pipe(gulp.dest('dist/js'))

    const components = gulp.src('./public/js/components/**').pipe(gulp.dest('dist/js/components'))

    return mergeStream(vendor, components)
  }
}
