/* eslint-env mocha */

// var expect = require('chai').expect
// var fs = require('fs')
import hyperreadings from '../../lib/hyperreadings'
import markdownImporter from '../../lib/importers/markdown'

describe('markdownImporter', () => {
  it('imports markdown file into a hyper readinglist', async () => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    // '# Hello *world*!!!'
    const test = '# yes\n\nno\nmaybe'
    const hr = hyperreadings()
    await markdownImporter(hr, test) // file.toString())
    // const base = await hr.root()
    // await base.iterate(print)
    // async function print (node) {
    //   console.log(node.name, node.type)
    //   console.log(await node.get('rdf:value'))
    //   if (node.iterate) await node.iterate(print)
    // }
  }).timeout(6000)
})
