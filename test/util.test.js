/* eslint-env mocha */

var expect = require('chai').expect
var utils = require('../lib/utils')
var Readable = require('stream').Readable

describe('arrayToStream', () => {
  it('throws an error if not passed an array as an argument', () => {
    const dudArguments = [undefined, null, 1, { length: 2 }, 'hello']
    dudArguments.forEach((arg) => expect(utils.arrayToStream.bind(null, arg)).to.throw(/arrayToStream expects array as first argument/))
  })
  it('takes an array and returns a stream', (done) => {
    const input = [1, 2, 3]
    const expected = [1, 2, 3]
    var stream = utils.arrayToStream(input)
    expect(stream).to.be.instanceOf(Readable)
    stream.on('data', (value) => {
      expect(value).to.eql(expected.shift())
    })
    stream.on('end', () => {
      expect(expected.length).to.eql(0)
      done()
    })
    stream.on('error', done)
  })
})
