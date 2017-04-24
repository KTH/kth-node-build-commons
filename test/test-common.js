/* eslint-env mocha */
const common = require('../tasks/common')
const expect = require('chai').expect

describe('Environment variables', function () {

  it('should recognize a development environment variable', function () {
    if (process.env['NODE_ENV'] === 'production') {
      expect(common.isDevelopment()).to.equal(false)
    } else {
      expect(common.isDevelopment()).to.equal(true)
    }
  })

})
