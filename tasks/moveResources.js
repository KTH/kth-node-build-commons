const gulp = require('gulp')
const del = require('del')
const mergeStream = require('merge-stream')

const moveKthStyle = () => {
  return () => {
    return gulp.src('./node_modules/kth-style/img/**').pipe(gulp.dest('dist/img/kth-style'))
  }
}

const moveBootstrap = () => {
  return () => {
    const bootstrap = gulp
      .src(['./node_modules/bootstrap/dist/css/bootstrap.min.css'])
      .pipe(gulp.dest('dist/css/bootstrap'))

    const fonts = gulp.src('./node_modules/bootstrap/fonts/**/*.{ttf,woff*,eof,svg}').pipe(gulp.dest('dist/css/fonts'))

    return mergeStream(bootstrap, fonts)
  }
}

const moveFontAwesome = () => {
  return () => {
    const css = gulp
      .src('./node_modules/font-awesome/css/font-awesome.min.css')
      .pipe(gulp.dest('dist/css/font-awesome'))

    const fonts = gulp
      .src('./node_modules/font-awesome/fonts/**/*.{ttf,woff*,eof,svg}')
      .pipe(gulp.dest('dist/css/fonts'))

    return mergeStream(css, fonts)
  }
}

const moveLocalFonts = () => {
  return () => {
    const fonts = gulp.src('./public/fonts/**').pipe(gulp.dest('dist/fonts'))
    return fonts
  }
}

const cleanKthStyle = () => {
  return () => {
    // Performing this sync because we want to make sure nothing else is started
    // before this is completed
    del.sync(['dist/css/kth-style/*', 'dist/img/kth-style/*'])
  }
}

module.exports = globals => {
  return {
    moveKthStyle: moveKthStyle(globals),
    moveBootstrap: moveBootstrap(globals),
    moveFontAwesome: moveFontAwesome(globals),
    moveLocalFonts: moveLocalFonts(globals),
    cleanKthStyle: cleanKthStyle(globals),
  }
}
