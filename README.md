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
The gulp file in this project is intended to be used in a project, to include the common shared tasks. A local gulpfile, referencing this gulpfile, should be included in each project

`Required: set dir name and start path in the web project`

### Example: /path/to/web-project/gulpfile.js
```
	const gulp = require('gulp')
	const commonsGulp = require('kth-node-build-commons/gulpfile')

	commonsGulp.setDirname(__dirname)
	commonsGulp.setStartpath('/places')

	gulp.tasks = commonsGulp.gulp.tasks
```

### Minifying Knockout code
In PROD and REF we use uglify to minify JavaScript. By specifying the option --preserve-comments we keep ALL comments that
Webpack has bundled. This allows Knockout.js bindings to work properly.

### Adding project specific tasks

It's possible to create project specific tasks as usual with gulp, just make sure this is done _after_ gulp.tasks is overwritten.

### Example: /path/to/web-project/gulpfile.js

```
const gulp = require('gulp')
const commonsGulp = require('kth-node-build-commons/gulpfile')

commonsGulp.setDirname(__dirname)
commonsGulp.setStartpath('/places')

gulp.tasks = commonsGulp.gulp.tasks

/* Place project specific tasks below */

gulp.task('hello', function () {
  console.log('hi!')
})

```
