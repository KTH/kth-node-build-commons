'use strict'
const configurator = require('kth-node-configuration')
let paths

module.exports = {
  setPaths(_paths) {
    paths = _paths
  },
  createFile() {
    /*
      This builds the file public/js/app/config.js with
      safe configuration content
    */

    ['prod', 'ref', 'dev'].forEach(env => {
      process.env.NODE_ENV = env

      const config = configurator({
        defaults: require('config/commonSettings'),
        local: require('config/localSettings'),
        ref: require('config/refSettings'),
        prod: require('config/prodSettings'),
        dev: require('config/devSettings')
      })

      const safeConf = config.safe()
      const fs = require('fs')
      const stream = fs.createWriteStream(`public/js/app/config-${env}.js`)

      const fileContent = `module.exports = {
        config: ${JSON.stringify(safeConf, null, 4)},
        paths: ${JSON.stringify(paths, null, 4)}
      }`
      stream.once('open', function (fd) {
        stream.write(fileContent)
        stream.end()
      })
    })
  }
}
