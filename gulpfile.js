'use strict'
const gulp = require('gulp')

const bundleBrowserJSTask = require('./tasks/webpack')
const moveResourcesTasks = require('./tasks/moveResources')
const sassTask = require('./tasks/sass')
const vendorTask = require('./tasks/vendor')

const globals = {
  dirname: undefined,
  startPath: undefined
}

const assets = ['moveKthStyle', 'moveBootstrap', 'moveFontAwesome']

/**
 *
 * If you call gulp webpack:prod|ref you can specify --preserve-comments to keep all
 * your comments, which is required when using knockout. I didn't manage to do more
 * precise filtering of comments.
 *
 */

gulp.task('webpack:prod', bundleBrowserJSTask('production', globals))
gulp.task('webpack:ref', bundleBrowserJSTask('reference', globals))
gulp.task('webpack:dev', bundleBrowserJSTask('development', globals))

gulp.task('moveAssets', assets)

gulp.task('clean', moveResourcesTasks.cleanKthStyle)
gulp.task('moveKthStyle', ['clean'], moveResourcesTasks.moveKthStyle)
gulp.task('moveBootstrap', moveResourcesTasks.moveBootstrap)
gulp.task('moveFontAwesome', moveResourcesTasks.moveFontAwesome)

gulp.task('transpileSass', sassTask)

gulp.task('vendor:dev', vendorTask('development'))
gulp.task('vendor:prod', vendorTask('production'))
gulp.task('vendor:ref', vendorTask('reference'))


gulp.task('watch', function () {
  return gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack:dev'])
})

module.exports = {
  gulp,
  addAssetTask(str) {
    assets.push(str)
  },
  setStartpath(_path) {
    globals.startPath = _path
  },
  setDirname(_dirname) {
    globals.dirname = _dirname
}}
