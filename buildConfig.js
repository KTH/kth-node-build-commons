'use strict'
const configuration = require('kth-node-configuration')
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

      const config = configuration.create({
        path: '/config',
        isRelativePath: true,
        common: {
          commonFiles: ['commonSettings.js']
        },
        dev: {
          envFiles: ['devSettings.js']
        },
        ref: {
          envFiles: ['refSettings.js'],
        },
        prod: {
          envFiles: ['prodSettings.js'],
        }
      })
      const safeConf = config.getSafeConf()
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
