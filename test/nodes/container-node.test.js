/* eslint-env mocha */
var expect = require('chai').expect
var hyperreadings = require('../../lib/hyperreadings')
// var utils = require('../lib/utils')
// var fs = require('fs')

describe('ContainerNode', () => {
  let hr
  beforeEach(done => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hr = hyperreadings()
    hr.on('ready', done)
  })

  describe('insert()', async () => {
    it('inserts newly nodes (new nodes)', async () => {
      const c = await hr.createNode('doco:Section')
      for (var i = 0; i < 4; i++) {
        const p = await hr.createNode('doco:Paragraph')
        await p.set('rdf:value', i)
        await c.insertNode(p)
      }

      let count = 0
      await c.iterate(async (node) => {
        // const v = await node.get('rdf:value', 1)
        expect(node.type).to.eql('doco:Paragraph')
        // expect(v).to.eql(count)
        count++
      })
      expect(count).to.eql(4)
    })
  })

  xdescribe('remove()', async () => {
    it('removes existing node', async () => {
      const c = await hr.createNode('doco:Section')
      const inserted = []
      for (var i = 0; i < 4; i++) {
        const p = await hr.createNode('doco:Paragraph')
        inserted.push(p)
        await p.set('rdf:value', i)
        await c.insertNode(p)
      }

      inserted[1].disconnect()

      // did this actually work?
      let count = 0
      await c.iterate(async (node) => {
        // const v = await node.get('rdf:value', 1)
        expect(node.type).to.eql('doco:Paragraph')
        // expect(v).to.eql(count)
        count++
      })
      expect(count).to.eql(3)
    })
  })
})
