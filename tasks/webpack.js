const gulp = require('gulp')
const plumber = require('gulp-plumber')
const named = require('vinyl-named')
const print = require('gulp-print').default
const { argv } = require('yargs')
const getWebpackJSConfig = require('../webpack.config')
const gulpWebpack = require('webpack-stream')
const webpack2 = require('webpack')
const { UglifyJsPlugin } = require('webpack').optimize

const { isDevelopment, onError } = require('./common')

module.exports = () => {
  return () => {
    const destinationPath = 'dist/js/app/view'
    return gulp
      .src('public/js/app/view/*.js')
      .pipe(print())
      .pipe(named())
      .pipe(
        plumber({
          errorHandler: onError,
        })
      )
      .pipe(
        gulpWebpack(
          getWebpackJSConfig({
            devtool: isDevelopment() ? 'source-map' : undefined,
            plugins: !isDevelopment()
              ? [
                  new webpack2.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                  }),
                  new UglifyJsPlugin({
                    sourceMap: true,
                    output: {
                      comments: argv['preserve-comments'],
                    },
                  }),
                ]
              : undefined,
          }),
          webpack2
        )
      ) // <- passing webpack 2 to webpack-stream because it is bundled with an older version
      .pipe(gulp.dest(destinationPath))
  }
}
