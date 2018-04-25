/* eslint-env mocha */

// var expect = require('chai').expect
var fs = require('fs')
var hyperreadings = require('../../lib/hyperreadings')
var markdownImporter = require('../../lib/importers/markdown')

describe('markdownImporter', () => {
  it.only('imports markdown file into a hyper readinglist', async () => {
    const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    // const test = '# Hello *world*!!!'
    // const test = '# yes\n\nno\nmaybe'
    const hr = hyperreadings()
    // await markdownImporter(hr, test); //file.toString())
    await markdownImporter(hr, file.toString())
    const stream = await hr.renderStream()
    return new Promise((resolve, reject) => {
      stream.on('data', data => data && console.log(data.name, '->', data.type))
      stream.on('end', resolve)
      stream.on('error', reject)
    })
    // const base = await hr.root()
    // await base.iterate(print)
    // async function print (node) {
    //   console.log(node.name, node.type)
    //   console.log(await node.get('rdf:value'))
    //   if (node.iterate) await node.iterate(print)
    // }
  }).timeout(6000)
})
