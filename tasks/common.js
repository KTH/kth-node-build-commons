const growly = require('growly')
const notify = require('gulp-notify')

function isDevelopment() {
  return process.env.NODE_ENV !== 'production'
}

const onError = err => {
  growly.notify('Gulp failed!' + err)
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Beep',
  })(err)

  this.emit('end')
}

module.exports = {
  isDevelopment,
  onError,
}
