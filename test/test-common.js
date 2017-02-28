/* eslint-env mocha */
const common = require('../tasks/common')
const expect = require('chai').expect

describe('Environment variables', function () {
  it('should recognize a production environment variable', function () {
    process.env['NODE_ENV'] = 'prod'
    expect(common.isProduction()).to.equal(true)
    process.env['NODE_ENV'] = 'dev'
  })

  it('should correctly interpret a production string', function () {
    expect(common.isProduction('prod')).to.equal(true)
  })

  it('should not give false positives for production', function () {
    expect(common.isProduction()).to.equal(undefined)
  })

  it('should recognize a reference environment variable', function () {
    process.env['NODE_ENV'] = 'ref'
    expect(common.isReference()).to.equal(true)
    process.env['NODE_ENV'] = 'dev'
  })

  it('should correctly interpret a reference string', function () {
    expect(common.isReference('ref')).to.equal(true)
  })

  it('should not give false positives for reference', function () {
    expect(common.isReference()).to.equal(undefined)
  })

  it('should recognize a development environment variable', function () {
    expect(common.isDevelopment()).to.equal(true)
    process.env['NODE_ENV'] = 'ref'
  })

  it('should correctly interpret a development string', function () {
    expect(common.isDevelopment('dev')).to.equal(true)
  })

  it('should not give false positives for development', function () {
    expect(common.isDevelopment()).to.equal(false) // weird behaviour, yes, comes from the definition as neither reference, nor production
  })
})
