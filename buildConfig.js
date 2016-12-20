'use strict'
const configurator = require('kth-node-configuration')
const path = require('path')
const Promise = require('bluebird')
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

      const tmpConfig = {
        defaults: require(path.join(configBasePath, '/commonSettings')),
        local: require(path.join(configBasePath, '/localSettings'))
      }

      const fs = Promise.promisifyAll(require('fs'))

      // Optionally a dev-, ref- and prodSettings if the file exists
      const promises = [
        { 'name': 'ref', path: path.join(configBasePath, '/refSettings')},
        { 'name': 'prod', path: path.join(configBasePath, '/prodSettings')},
        { 'name': 'dev', path: path.join(configBasePath, '/devSettings')}].map(function (item) {
        return fs.statAsync(item.path)
          .then(function (stat) {
            return Promise.resolve(item)
          })
          .catch(function () {
            return Promise.resolve(undefined)
          })
      })
      Promise.all(promises)
        .then(function (results) {
          results.forEach(function (result) {
            if (result !== undefined) {
              tmpConfig[result.name] = require(result.path)
            }
          })
          return Promise.resolve(tmpConfig)
        })
        .then(function (tmpConfig) {
          // Now we have added these settings and can generate the config-xxx.js file
          const config = configurator(tmpConfig)
          const safeConf = config.safe()
          const stream = fs.createWriteStream(`public/js/app/config-${env}.js`)

          const conf = JSON.stringify({ config: safeConf, paths: paths }, null, 2)
          const fileContent = `module.exports = ${conf}
    `
          stream.once('open', function (fd) {
            stream.write(fileContent)
            stream.end()
          })
        })
    })
  }
}
