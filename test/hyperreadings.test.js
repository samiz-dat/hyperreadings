/* eslint-env mocha */

// var expect = require('chai').expect
// var jsonld = require('jsonld')

var hyperreadings = require('../lib/hyperreadings')
// var utils = require('../lib/utils')
// var fs = require('fs')

// describe('hyperreadings', () => {
//   let readings
//   before(done => {
//     const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
//     hyperreadings.loadFromMarkdown(file.toString(), null, (err, hr) => {
//       if (err) return done(err)
//       readings = hr
//       done()
//     })
//   })

//   it('returns the root', () => {
//     function processContents (contents) {
//       return readings.get(contents.id)
//         // .then(value => console.log(contents.id, JSON.stringify(value, null, 2)))
//         .then(() => readings.contents(contents.id, processContents))
//     }
//     console.time('iterate')
//     return readings.contents(null, processContents)
//       .then(() => {
//         console.timeEnd('iterate')
//       })
//   }).timeout(10000)
// })

describe.only('hyperreadings', () => {
  let hr
  before(done => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hr = hyperreadings.HyperReadings()
    hr.on('ready', done)
  })

  it('just works', async () => {
    var r = await hr.root()
    await hr.createNode('hr:root')
    r = await hr.root()
    console.log(r)
    var rootNode = await hr.node(r)
    console.log(rootNode)
    var section = await hr.createNode('doco:section')
    await rootNode.insertNode(section)

  })
})
