# About this package
This package is intended to be imported in web projects to handle standard builds in each project. It consists of a few files, but no main file.

# buildConfig.js
This file builds a config file with the safe configuration.
Common use case is to import the built file in the client side code with webpack.

`Required: call .setPaths() with an object as parameter in the web project.`

### Example: /path/to/web-project/buildConfig.js
```
	const paths = require('./server/init/routing/paths')
	const buildConfig = require('kth-node-build-commons/buildConfig')
	buildConfig.setPaths(paths)
	buildConfig.createFile()
```


# Gulp
This package contains a set of Gulp-tasks to be used when building node-web based projects. To allow the project maintainer more control over the build process these are exposed as functions that are wired up in the actual project. An example of this is done can be found in this package `gulpfile.js` which also provides backwards compatibility for exisiting projects.

The new way to use these gulp tasks has been implemented in node-web and will be pushed to projects through upstream merges.

### Minifying Knockout code
In PROD and REF we use uglify to minify JavaScript. By specifying the option --preserve-comments we keep ALL comments that
Webpack has bundled. This allows Knockout.js bindings to work properly.

### Example: /path/to/web-project/gulpfile.js

```
const gulp = require('gulp')

const { webpack, moveResources, sass, vendor } = require('kth-node-build-commons').tasks

const globals = {
  dirname: __dirname
}

// Deployment tasks
gulp.task('webpackDeploy', function () {
  webpack(globals, 'reference')()
  webpack(globals, 'production')()
})

gulp.task('vendorDeploy', function () {
  vendor('reference')()
  vendor('production')()
})

// Development tasks
gulp.task('webpack', webpack(globals))
gulp.task('vendor', vendor())

gulp.task('cleanKthStyle', moveResources.cleanKthStyle)
gulp.task('moveResources', ['cleanKthStyle'], function () {
  moveResources.cleanKthStyle()
  moveResources.moveKthStyle()
  moveResources.moveBootstrap()
  moveResources.moveFontAwesome()
})

// Common tasks
gulp.task('transpileSass', sass)

gulp.task('build', ['moveResources', 'vendor', 'webpack', 'transpileSass'])

gulp.task('deploy', ['moveResources', 'vendorDeploy', 'webpackDeploy', 'transpileSass'])

gulp.task('watch', ['build'], function () {
  gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
})
```
