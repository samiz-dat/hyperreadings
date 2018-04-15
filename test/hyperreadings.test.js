// /* eslint-env mocha */

// var expect = require('chai').expect
// // var jsonld = require('jsonld')

// var hyperreadings = require('../lib/hyperreadings')
// // var utils = require('../lib/utils')
// // var fs = require('fs')

// // describe('hyperreadings', () => {
// //   let readings
// //   before(done => {
// //     const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
// //     hyperreadings.loadFromMarkdown(file.toString(), null, (err, hr) => {
// //       if (err) return done(err)
// //       readings = hr
// //       done()
// //     })
// //   })

// //   it('returns the root', () => {
// //     function processContents (contents) {
// //       return readings.get(contents.id)
// //         // .then(value => console.log(contents.id, JSON.stringify(value, null, 2)))
// //         .then(() => readings.contents(contents.id, processContents))
// //     }
// //     console.time('iterate')
// //     return readings.contents(null, processContents)
// //       .then(() => {
// //         console.timeEnd('iterate')
// //       })
// //   }).timeout(10000)
// // })

// describe.only('hyperreadings', () => {
//   let hr
//   context('with new hyperreading', () => {
//     beforeEach(done => {
//       // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
//       hr = hyperreadings.HyperReadings()
//       hr.on('ready', done)
//     })
//     describe('initial state', () => {
//       it('starts without a root node', async () => {
//         var r = await hr.root()
//         expect(r).to.eql(null)
//       })
//       it('has private _nodeCount === 0', () => {
//         expect(hr._nodeCount).to.eql(0)
//       })
//     })

//     describe.only('hr.root()', () => {
//       it('returns a node object for hr root', async () => {
//         await hr.createNode('hr:root')
//         const r = await hr.root()
//         // expect(r).to.be.instanceOf()
//         expect(r).to.include.keys('name', 'type')
//         // these variables should not be hard coded as each are defined in code
//         expect(r.name).to.eql('hr://n0')
//         expect(r.type).to.eql('hr:root')
//       })
//     })

//     describe('hr.createNode(type)', () => {
//       it('adds a new blank node to the graph', async () => {
//         const n = await hr.createNode('http://example.com/namespace/')
//         // find disconnected nodes and expect node.name to be found.
//       })
//     })

//     it('just works', async () => {
//       var r = await hr.root()
//       await hr.createNode('hr:root')
//       r = await hr.root()
//       // console.log(r)
//       // console.log(rootNode)
//       for (var i = 0; i < 10; i++) {
//         var section = await hr.createNode('doco:section')
//         console.log('inserting')
//         await r.insertNode(section)
//       }
//       console.time('iterating over sections')
//       await r.iterate((node) => console.log(node.name, node.type))
//       console.timeEnd('iterating over sections')
//     }).timeout(10000)
//   })
// })
