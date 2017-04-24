const gulpUtil = require('gulp-util')
const growly = require('growly')
const notify = require('gulp-notify')
const { safeGet } = require('safe-utils')

function isDevelopment () {
  return process.env.NODE_ENV !== 'production'
}

const onError = function (err) {
  console.log('err', err)
  growly.notify('Gulp failed!' + err)
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Beep'
  })(err)

  this.emit('end')
}

module.exports = {
  isDevelopment: isDevelopment,
  onError: onError,
}
