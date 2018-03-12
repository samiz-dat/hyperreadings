/* eslint-env mocha */

// var expect = require('chai').expect
// var jsonld = require('jsonld')

var hyperreadings = require('../lib/hyperreadings')
// var utils = require('../lib/utils')
var fs = require('fs')

describe.only('hyperreadings', () => {
  let readings
  before(done => {
    const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hyperreadings.loadFromMarkdown(file.toString(), null, (err, hr) => {
      if (err) return done(err)
      readings = hr
      done()
    })
  })

  it('returns the root', () => {
    function iterate (res) {
      console.log('results:', res)
      if (res) {
        return readings
          .getNext(res['?next'] || res['?first'])
          .then(iterate)
      }
      return null
    }
    return readings.getFirst('hg:b7')
      .then(iterate)
  })
})
