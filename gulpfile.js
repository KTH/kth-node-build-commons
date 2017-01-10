'use strict'
const gulp = require('gulp')

const { webpack, moveResources, sass, vendor } = require('./tasks')

const globals = {
  dirname: undefined
}

const assets = ['moveKthStyle', 'moveBootstrap', 'moveFontAwesome']

/**
 *
 * If you call gulp webpack:prod|ref you can specify --preserve-comments to keep all
 * your comments, which is required when using knockout. I didn't manage to do more
 * precise filtering of comments.
 *
 */

gulp.task('webpack:prod', webpack(globals, 'prod'))
gulp.task('webpack:ref', webpack(globals, 'ref'))
gulp.task('webpack:dev', webpack(globals, 'dev'))

gulp.task('moveAssets', assets)

gulp.task('clean', moveResources.cleanKthStyle)
gulp.task('moveKthStyle', ['clean'], moveResources.moveKthStyle)
gulp.task('moveBootstrap', moveResources.moveBootstrap)
gulp.task('moveFontAwesome', moveResources.moveFontAwesome)

gulp.task('transpileSass', sass)

gulp.task('vendor:dev', vendor('dev'))
gulp.task('vendor:prod', vendor('prod'))
gulp.task('vendor:ref', vendor('ref'))


gulp.task('watch', function () {
  return gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack:dev'])
})

module.exports = {
  gulp,
  addAssetTask (str) {
    assets.push(str)
  },
  setStartpath (_path) {
    globals.startPath = _path
  },
  setDirname (_dirname) {
    globals.dirname = _dirname
  }
}
