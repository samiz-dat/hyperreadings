/* eslint-env mocha */

// var expect = require('chai').expect
var jsonld = require('jsonld')
var hypergraph = require('hyper-graph-db')
var ram = require('random-access-memory')

var markdown = require('../lib/markdown-to-triples')
var utils = require('../lib/utils')
// var fs = require('fs')

describe.only('parse', () => {
  it('returns an array of triples', (done) => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    // '# Hello *world*!!!'
    const test = '# yes\n\nno\nmaybe'
    const doc = markdown.parse(test)
    // jsonld.canonize(doc, {
    //   algorithm: 'URDNA2015'
    // }, (err, canonized) => {
    //   // canonized is a string that is a canonical representation of the document
    //   // that can be used for hashing, comparison, etc.
    //   console.log(canonized)
    // })
    const graph = hypergraph(() => ram())
    jsonld.toRDF(doc)
      .then((triples) => {
        console.log(triples.map(utils.simplifyTripleFromJSONLD))
        const input = utils.arrayToStream(triples.map(utils.simplifyTripleFromJSONLD))
        const put = graph.putStream()
        input.pipe(put)
        put.on('finish', () => {
          console.log('inputted into')
          var r = graph.db.createReadStream('')
          r.on('data', (d) => console.log(d[0].value.toString()))
          r.on('end', done)
          // graph.get({'subject':'hg:b7'}, (err, node) => {
          // graph.get({predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value'}, (err, node) => {
          //   console.log(err)
          //   console.log(node)
          //   done()
          // })
        })
      })
      .catch(done)
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
