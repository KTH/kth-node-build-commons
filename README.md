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

### gulpfile.js

Use `gulpfile.js.in` in this project as a template for your project specific template file. In basic cases you won't need to add anything to that file.

## Transpiling es2015 etc. with babel

If you create a build step to transpile JS, don't use `.babelrc`, add settings to `package.json` to allow transpiling to work on linked packages (npm link):

```
  "// babel": "Babel presets in package.json so they are applied to symlinked packages https://github.com/babel/babel-loader/issues/149",
  "babel": {
    "presets": [
      "es2015"
    ]
  }
```

## Migration from < 1.5.x

1. Update gulpfile.js to new style, you can copy gulpfile.js.in in this project

2. Update kth-style dependency to 1.1.1 or compatible

3. update static routes (probably in staticFiles.js) so they map like this

```JavaScript
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(config.full.proxyPrefixPath.uri + '/static/js/components', express.static('./dist/js/components', { setHeaders: setCustomCacheControl }))
// Map bundles build folder to static URL
server.use(config.full.proxyPrefixPath.uri + '/static/js', express.static(`./dist/js/${getEnv()}`))
// Map static content like images, css and js.
server.use(config.full.proxyPrefixPath.uri + '/static', express.static('./dist'))
```

4. Change imports in SASS-files that reference kth-style from:

```
	@import "kth-style/variables/colors";
```

  to (adding */sass* to match path in kth-style-package)

```
	@import "kth-style/sass/variables/colors";
```

5. Add additional steps and tasks to project specific gulpfile.js

6. Ignore the target directory `dist` to `.gitignore`

7. You can remove the dependency on `node-sass-middleware` from package.json and remove `server/init/middleware/sass.js` and the corresponding require in `server/init/middleware/index.js`

8. You should move `nodemon` from optionalDependencies to devDependencies

9. Make sure you have the following npm script commands for consistency:

```
"webpackProd": "npm run build",
"vendorProd": "echo \"Deprecated, use 'npm run build' \"",
"buildConfig": "cross-env NODE_ENV=development NODE_PATH=. node ./buildConfig.js",
"postinstall": "npm run buildConfig",
"build": "gulp build --preserve-comments",
"start": "gulp build:dev --preserve-comments && cross-env NODE_ENV=development concurrently --kill-others \"nodemon app.js\" \"gulp watch\""
```

  NOTE: The gulp option `--preserve-comments` is needed for projects using Knockout, but should otherwise be omitted

10. Add `merge-stream` to `package.json`

11. Remove `.babelrc` and add settings to `package.json` to allow transpiling to work on linked packages (npm link):

```
  "// babel": "Babel presets in package.json so they are applied to symlinked packages https://github.com/babel/babel-loader/issues/149",
  "babel": {
    "presets": [
      "es2015"
    ]
  }
```