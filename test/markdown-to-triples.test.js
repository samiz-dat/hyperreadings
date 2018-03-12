/* eslint-env mocha */

// var expect = require('chai').expect
// var jsonld = require('jsonld')
var hypergraph = require('hyper-graph-db')
var ram = require('random-access-memory')

var markdown = require('../lib/markdown-to-triples')
// var utils = require('../lib/utils')
var fs = require('fs')

describe.only('toStream', () => {
  it('returns a stream of triples representing the document', (done) => {
    const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    // '# Hello *world*!!!'
    // const test = '# yes\n\nno\nmaybe'
    const input = markdown.toStream(file.toString())
    const graph = hypergraph(() => ram())
    const put = graph.putStream()
    input.on('error', done)
    input.pipe(put)

    put.on('finish', () => {
      // done()
      setTimeout(() => {
        console.time('stream')
        var r = graph.db.createReadStream('')
        r.on('data', (d) => {
          // console.log('read')
          console.log('-', d[0].value.toString())
        })
        r.on('end', () => {
          console.timeEnd('stream')
          done()
        })
      }, 1)
      // graph.get({object: 'yes'}, (err, node) => {
      // // graph.get({predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value'}, (err, node) => {
      //   console.log(err)
      //   console.log(node)
      //   done()
      // })
    })
    // jsonld.toRDF(doc, {format: 'application/n-quads'}, (err, no) => {
    //   console.log('node')
    //   N3.Parser({ format: 'N-Quads' }).parse(no, (err, n) => {
    //     console.log(n)
    //   })
    // })
    // hypergraph.put()
    // markdown.parse(file.toString())
  })
})
