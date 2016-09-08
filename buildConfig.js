'use strict'
const configurator = require('kth-node-configuration')
const path = require('path')
let paths

module.exports = {
  setPaths(_paths) {
    paths = _paths
  },
  createFile(configBasePath) {
    /*
      This builds the file public/js/app/config.js with
      safe configuration content
    */

    configBasePath = configBasePath || './config'

    ;['prod', 'ref', 'dev'].forEach(env => {
      process.env.NODE_ENV = env

      const config = configurator({
        defaults: require(path.join(configBasePath, '/commonSettings')),
        local: require(path.join(configBasePath, '/localSettings')),
        ref: require(path.join(configBasePath, '/refSettings')),
        prod: require(path.join(configBasePath, '/prodSettings')),
        dev: require(path.join(configBasePath, '/devSettings'))
      })

      const safeConf = config.safe()
      const fs = require('fs')
      const stream = fs.createWriteStream(`public/js/app/config-${env}.js`)

      const conf = JSON.stringify({ config: safeConf, paths: paths }, null, 2)
      const fileContent = `module.exports = ${conf}
`
      stream.once('open', function (fd) {
        stream.write(fileContent)
        stream.end()
      })
    })
  }
}
