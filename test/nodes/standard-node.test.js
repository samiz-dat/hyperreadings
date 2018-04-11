/* eslint-env mocha */
var expect = require('chai').expect
var hyperreadings = require('../../lib/hyperreadings')

describe.only('StandardNode', () => {
  let hr
  beforeEach(done => {
    hr = hyperreadings.HyperReadings()
    hr.on('ready', done)
  })

  describe('#add(attr, value)', () => {
    let node
    beforeEach(async () => {
      node = await hr.createNode('doco:Sentence')
    })

    it('adds a node as an attribute', async () => {
      const another = await hr.createNode('doco:Sentence')
      await node.add('c4o:isRelevantTo', another)
      const returned = await node.get('c4o:isRelevantTo')
      expect(returned.name).to.eql(another.name)
    })

    it('adds a string as an attribute', async () => {
      await node.add('c4o:hasContent', 'this is me')
      const returned = await node.get('c4o:hasContent')
      expect(returned).to.eql('this is me')
    })

    it('adds a number as an attribute', async () => {
      await node.add('rdf:value', 1)
      const returned = await node.get('rdf:value')
      expect(returned).to.eql(1)
    })

    it('allows multiple values to be set', async () => {
      await node.add('po:contains', 'first value')
      await node.add('po:contains', 'second value')
      const returned = await node.all('po:contains')
      expect(returned).to.eql(['second value', 'first value'])
    })
  })

  describe('#set(attr, value)', () => {
    let node
    beforeEach(async () => {
      node = await hr.createNode('doco:Sentence')
    })

    it('sets a node as an attribute', async () => {
      const another = await hr.createNode('doco:Sentence')
      await node.set('c4o:isRelevantTo', another)
      const returned = await node.get('c4o:isRelevantTo')
      expect(returned.name).to.eql(another.name)
    })

    it('sets a value as an attribute', async () => {
      await node.set('c4o:hasContent', 'this is me')
      const returned = await node.get('c4o:hasContent')
      expect(returned).to.eql('this is me')
    })

    it('deletes overrides previously set values', async () => {
      await node.set('c4o:hasContent', 'first value')
      await node.set('c4o:hasContent', 'second value')
      const returned = await node.all('c4o:hasContent')
      expect(returned).to.eql(['second value'])
    })

    it('deletes overrides previously set values (again)', async () => {
      await node.set('c4o:hasContent', 'first value')
      await node.set('c4o:hasContent', 2)
      const returned = await node.all('c4o:hasContent')
      expect(returned).to.eql([2])
    })
  })

  describe('#disconnect()', () => {
    it('removes all connections between this node and its parents', async () => {
      // setup
      const annotationA = await hr.createNode('oa:Annotation')
      const annotationB = await hr.createNode('oa:Annotation')
      const citation = await hr.createNode('cito:Citation')
      await annotationA.set('oa:hasTarget', citation)
      await annotationA.set('oa:hasBody', 'annotation 1')
      await annotationB.set('oa:hasTarget', citation)
      await annotationB.set('oa:hasBody', 'annotation 2')
      // disconnect
      await citation.disconnect()
      // check
      let target = await annotationA.get('oa:hasTarget')
      expect(target).to.eql(null)
      target = await annotationB.get('oa:hasTarget')
      expect(target).to.eql(null)
    })

    context('when parent is a ListItem', () => {
      it('repairs hole left in List chain', async () => {
        // setup
        const c = await hr.createNode('doco:Section')
        const inserted = []
        for (var i = 0; i < 4; i++) {
          const p = await hr.createNode('doco:Paragraph')
          inserted.push(p)
          await p.set('rdf:value', i)
          await c.insertNode(p)
        }
        // disconnect
        await inserted[1].disconnect()
        // check
        const expected = [0, 2, 3]
        await c.iterate(async (node) => {
          expect(node.type).to.eql('doco:Paragraph')
          const value = await node.get('rdf:value')
          expect(value).to.eql(expected.shift())
        })
        expect(expected).to.have.length(0)
      })
    })
  })
})
