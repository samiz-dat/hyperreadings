/* eslint-env mocha */

// var expect = require('chai').expect
var markdown = require('../lib/markdown-to-triples')
// var fs = require('fs')

describe.only('parse', () => {
  it('returns an array of triples', () => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    // '# Hello *world*!!!'
    const test = '# section\n\nno\nmaybe'
    const x = markdown.parse(test)
    // markdown.parse(file.toString())
  })
})
