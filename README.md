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
'use strict'
const gulp = require('gulp')
const mergeStream = require('merge-stream')

const globals = {
  dirname: __dirname
}

const { webpack, moveResources, sass, vendor, clean } = require('kth-node-build-commons').tasks(globals)

/**
 * Usage:
 *
 *  One-time build of browser dependencies for development
 *
 *    $ gulp build:dev
 *
 *  Continuous re-build during development
 *
 *    $ gulp watch
 *
 *  One-time build for Deployment (Gulp tasks will check NODE_ENV if no option is passed)
 *
 *    $ gulp build [--production | --reference]
 *
 *  Remove the generated files
 *
 *    $ gulp clean
 *
 */

// *** Deployment helper tasks ***
gulp.task('webpackDeploy', function () {
  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    webpack('reference'),
    webpack('production')
  )
})

gulp.task('vendorDeploy', function () {
  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    vendor('reference'),
    vendor('production')
  )
})

// *** Development helper tasks ***
gulp.task('webpack', webpack)
gulp.task('vendor', vendor

gulp.task('cleanKthStyle', moveResources.cleanKthStyle)
gulp.task('moveResources', ['cleanKthStyle'], function () {
  // Returning merged stream so Gulp knows when async operations have finished
  return mergeStream(
    moveResources.moveKthStyle(),
    moveResources.moveBootstrap(),
    moveResources.moveFontAwesome()
  )
})

gulp.task('transpileSass', () => sass())

/**
 *
 *  Public tasks used by developer:
 *
 */

gulp.task('clean', clean)

gulp.task('build:dev', ['moveResources', 'vendor', 'webpack'], () => sass())

gulp.task('build', ['moveResources', 'vendorDeploy', 'webpackDeploy'], () => sass())

gulp.task('watch', ['build:dev'], function () {
  gulp.watch(['./public/js/app/**/*.js', './public/js/components/**/*'], ['webpack'])
  gulp.watch(['./public/js/vendor.js'], ['vendor'])
  gulp.watch(['./public/css/**/*.scss'], ['transpileSass'])
})

```

## Migration from < 1.5.x

1 Update gulpfile.js to new style, you can copy gulpfile.js.in in this project

2 Update kth-style dependency to 1.1.1 or compatible

3 update static routes so they map like this

```JavaScript
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(config.full.proxyPrefixPath.uri + '/static/js/components', express.static('./dist/js/components', { setHeaders: setCustomCacheControl }))
// Map bundles build folder to static URL
server.use(config.full.proxyPrefixPath.uri + '/static/js', express.static(`./dist/js/${getEnv()}`))
// Map static content like images, css and js.
server.use(config.full.proxyPrefixPath.uri + '/static', express.static('./dist'))
```

4 Add additional steps and tasks to project specific gulpfile.js

5 Ingore dist/ folder in .gitignore
