/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'

describe('StandardNode', () => {
  let hr
  beforeEach(done => {
    hr = ramHyperReadings()
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

  describe('#has(attr, value)', () => {
    let node
    beforeEach(async () => {
      node = await hr.createNode('doco:Sentence')
    })

    it('returns false if node does not have matching attribute (partial)', async () => {
      expect(await node.has('c4o:isRelevantTo')).to.eql(false)
    })

    it('returns false if node does not have matching attribute (exact)', async () => {
      expect(await node.has('c4o:isRelevantTo', 'missing')).to.eql(false)
    })

    it('returns true if node does has matching attribute (partial)', async () => {
      await node.set('po:contains', 'first value')
      expect(await node.has('po:contains')).to.eql(true)
    })

    it('returns true if node has matching attribute (exact)', async () => {
      await node.set('po:contains', 'first value')
      expect(await node.has('po:contains', 'first value')).to.eql(true)
    })

    it('returns false if node does not have matching attribute (partial again)', async () => {
      await node.set('po:contains', 'first value')
      expect(await node.has('c4o:hasContent')).to.eql(false)
    })

    it('return true if matches one of many attributes', async () => {
      await node.add('po:contains', 'first value')
      await node.add('po:contains', 'another')
      expect(await node.has('po:contains', 'first value')).to.eql(true)
    })

    it('does not match deleted values', async () => {
      await node.set('po:contains', 'first value')
      await node.set('po:contains', 'another')
      expect(await node.has('po:contains', 'first value')).to.eql(false)
    })
  })

  describe('#remove(attr, value)', () => {
    let node
    beforeEach(async () => {
      node = await hr.createNode('doco:Sentence')
      await node.add('po:contains', 1)
      await node.add('po:contains', 2)
      await node.add('po:contains', 3)
      await node.add('rdf:value', 'a sentence')
    })
    it('removes all connections to nodes matching attr (partial)', async () => {
      expect(await node.has('po:contains')).to.eql(true)
      await node.remove('po:contains')
      expect(await node.has('po:contains')).to.eql(false)
    })
    it('removes all connections to nodes matching attr and value (exact)', async () => {
      expect(await node.has('po:contains', 1)).to.eql(true)
      await node.remove('po:contains', 1)
      expect(await node.has('po:contains', 3)).to.eql(true)
      expect(await node.has('po:contains', 2)).to.eql(true)
      expect(await node.has('po:contains', 1)).to.eql(false)
    })
  })

  describe('#properties()', () => {
    context('with new standard node', () => {
      it('returns object with each (predicate, object) as (key, value) pairs', async () => {
        let node = await hr.createNode('doco:Sentence')
        const properties = await node.properties()
        expect(properties).to.deep.eql({ 'rdf:type': { name: 'doco:Sentence' } })
      })
      it('returns object with each (predicate, object) as (key, value) pairs', async () => {
        let node = await hr.createNode('doco:Paragraph')
        const properties = await node.properties()
        expect(properties).to.deep.eql({ 'rdf:type': { name: 'doco:Paragraph' } })
      })
    })
    context('when node has values set', () => {
      it('returns object with each (predicate, object) as (key, value) pairs', async () => {
        const work = await hr.createNode('frbr:Work')
        await work.add('frbr:creator', 'benjamin')
        await work.add('frbr:creator', 'sean')
        await work.add('frbr:creator', 'others')
        await work.set('dcterms:title', 'hyper-readings: Readme.md')
        const version = await hr.createNode('frbr:Expression')
        await work.set('frbr:realization', version)
        const properties = await work.properties()
        expect(properties).to.deep.eql({
          'rdf:type': { name: 'frbr:Work' },
          'dcterms:title': 'hyper-readings: Readme.md',
          'frbr:creator': ['sean', 'benjamin', 'others'],
          'frbr:realization': { name: version.name }
        })
      })
    })
  })

  describe('#update(properties)', () => {
    context('with a new standard node', () => {
      const cases = [
        {
          name: 'empty',
          input: {},
          output: {}
        },
        {
          name: 'simple',
          input: { 'dcterms:title': 'hyper-readings: Readme.md' },
          output: { 'dcterms:title': 'hyper-readings: Readme.md' }
        },
        {
          name: 'array',
          input: { 'frbr:creator': ['sean', 'benjamin', 'others'] },
          output: { 'frbr:creator': ['sean', 'benjamin', 'others'] }
        },
        {
          name: 'node',
          input: { 'frbr:realization': { name: 'hr://node' } },
          output: { 'frbr:realization': { name: 'hr://node' } }
        },
        {
          name: 'literal',
          input: { 'rdf:value': 12 },
          output: { 'rdf:value': 12 }
        }
      ]
      cases.forEach((tc) => {
        it(`adds object’s key/value pairs to node as predicate -> object (${tc.name})`, async () => {
          const work = await hr.createNode('frbr:Work')
          const output = Object.assign({ 'rdf:type': { name: 'frbr:Work' } }, tc.output)
          await work.update(tc.input)
          const newProps = await work.properties()
          expect(newProps).to.deep.eql(output)
        })
      })
    })
    context('with an existing node', () => {
      let work = null
      const cases = [
        {
          name: 'empty',
          input: {},
          output: {}
        },
        {
          name: 'simple',
          input: { 'dcterms:title': 'Another titel' },
          output: { 'dcterms:title': 'Another titel' }
        },
        {
          name: 'array',
          input: { 'frbr:creator': ['different', 'authors'] },
          output: { 'frbr:creator': ['different', 'authors'] }
        },
        {
          name: 'node',
          input: { 'frbr:realization': { name: 'hr://blank' } },
          output: { 'frbr:realization': { name: 'hr://blank' } }
        },
        {
          name: 'literal',
          input: { 'rdf:value': 44 },
          output: { 'rdf:value': 44 }
        }
      ]
      beforeEach(async () => {
        work = await hr.createNode('frbr:Work')
        await work.add('frbr:creator', 'benjamin')
        await work.add('frbr:creator', 'sean')
        await work.add('frbr:creator', 'others')
        await work.set('dcterms:title', 'hyper-readings: Readme.md')
        await work.set('rdf:value', 12)
        const version = await hr.createNode('frbr:Expression')
        await work.set('frbr:realization', version)
      })
      cases.forEach((tc) => {
        it(`adds object’s key/value pairs to node as predicate -> object (${tc.name})`, async () => {
          const output = Object.assign({ 'rdf:type': { name: 'frbr:Work' } }, tc.output)
          await work.update(tc.input)
          const newProps = await work.properties()
          expect(newProps).to.deep.eql(output)
        })
      })
      it('does not delete properties unnecessarily')
    })
  })

  describe('#children([includeLiterals])', () => {
    context('with default arguments (includeLiterals = false)', () => {
      let node
      beforeEach(async () => {
        node = await hr.createNode('oa:Annotation')
        const citationA = await hr.createNode('cito:Citation')
        await citationA.add('rdf:value', 'A')
        const citationB = await hr.createNode('cito:Citation')
        await citationB.add('rdf:value', 'B')
        await node.add('oa:hasTarget', citationA)
        await node.add('po:contains', citationB)
      })
      it('returns descendant nodes', async () => {
        const children = await node.children()
        expect(children).to.have.length(2)
        expect(await children[0].get('rdf:value')).to.eql('A')
        expect(await children[1].get('rdf:value')).to.eql('B')
      })
      it('returns does not return literal values', async () => {
        await node.add('ao:hasBody', 'somedata')
        await node.add('rdf:value', 1)
        const children = await node.children()
        expect(children).to.have.length(2)
        expect(await children[0].get('rdf:value')).to.eql('A')
        expect(await children[1].get('rdf:value')).to.eql('B')
      })
    })
    context('with include literals = true', () => {
      it('returns literals')
    })
  })

  describe('#parents([relation])', () => {
    let citation = null
    let annotationA = null
    let annotationB = null
    let annotationC = null
    beforeEach(async () => {
      // setup
      citation = await hr.createNode('cito:Citation')
      annotationA = await hr.createNode('oa:Annotation')
      annotationB = await hr.createNode('oa:Annotation')
      annotationC = await hr.createNode('oa:Annotation')
      await annotationC.set('oa:hasRef', citation)
      await annotationA.set('oa:hasTarget', citation)
      await annotationA.set('oa:hasBody', 'annotation 1')
      await annotationB.set('oa:hasTarget', citation)
      await annotationB.set('oa:hasBody', 'annotation 2')
    })
    context('without relation set', () => {
      it('returns all the parents of this node', async () => {
        const parents = await citation.parents()
        expect(parents).to.have.length(3)
        const names = parents.map(p => p.name)
        expect(names).to.have.all.members([annotationC.name, annotationB.name, annotationA.name])
      })
    })
    context('with relation set', () => {
      it('returns only parents with specific relation', async () => {
        const parents = await citation.parents('oa:hasTarget')
        expect(parents).to.have.length(2)
        expect(parents[1].name).to.eql(annotationB.name)
        expect(parents[0].name).to.eql(annotationA.name)
      })
      it('returns only parents with specific relation', async () => {
        const parents = await citation.parents('oa:hasRef')
        expect(parents).to.have.length(1)
        expect(parents[0].name).to.eql(annotationC.name)
      })
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

  describe('#destroy()', () => {
    context('with circular structure', () => {
      let A, B, C, D
      beforeEach(async () => {
        A = await hr.createNode('A')
        B = await hr.createNode('B')
        C = await hr.createNode('C')
        D = await hr.createNode('D')
        await A.set('test:pointsTo', B)
        await B.set('test:pointsTo', C)
        await C.set('test:pointsTo', D)
        await D.set('test:pointsTo', A)
      })
      it('removes all entities in a circular loop', async () => {
        var items = await hr._get({ predicate: 'test:pointsTo' })
        expect(items).to.have.length(4)
        await A.destroy()
        items = await hr._get({ predicate: 'test:pointsTo' })
        expect(items).to.have.length(0)
      })
    })
    context('with molecule-like structure', () => {
      let A, B, C, D, outside1, outside2
      beforeEach(async () => {
        A = await hr.createNode('A')
        B = await hr.createNode('B')
        C = await hr.createNode('C')
        D = await hr.createNode('D')
        outside1 = await hr.createNode('O1')
        outside2 = await hr.createNode('O2')
        await outside1.set('test:pointsTo', A)
        await outside2.set('test:pointsTo', D)
        await A.set('test:pointsTo', B)
        await B.set('test:pointsTo', C)
        await C.set('test:pointsTo', D)
        await D.set('test:pointsTo', A)
        /**
         *   O1 ► A ► B
         *        ▲   ▼
         *   O2 ► D ◄ C
        */
      })
      it('removes all entities in a circular loop', async () => {
        // confirm
        var items = await hr._get({ predicate: 'test:pointsTo' })
        expect(items).to.have.length(6)
        // perform operation
        await A.destroy()
        /** expecting
         *
         *   O1
         *   O2 ► D
        */
        items = await hr._get({ predicate: 'test:pointsTo' })
        expect(items).to.have.length(1)
        // check that 01 still exists
        expect(await hr.nodesByType('O1')).to.have.length(1)
        // check that 02 still exists
        expect(await hr.nodesByType('O2')).to.have.length(1)
        // check that D still exists
        const d = await hr.nodesByType('D')
        expect(d).to.have.length(1)
        const dParents = await d[0].parents()
        expect(dParents).to.have.length(1)
        expect(dParents[0].type).to.eql('O2')
        expect(dParents[0].rel).to.eql('test:pointsTo')
      })
    })
    context('with container-like structure', () => {
      let intro, title, p1, p2, p3, p4
      beforeEach(async () => {
        intro = await hr.createNode('doco:Section')
        title = await hr.createNode('doco:Title')
        await title.set('rdf:value', 'title')
        await intro.set('po:containsAsHeader', title)
        await intro.insertNode(title)
        p1 = await hr.createNode('doco:Paragraph')
        await p1.set('rdf:value', 'p1')
        await intro.insertNode(p1)
        p2 = await hr.createNode('doco:Paragraph')
        await intro.insertNode(p2)
        await p2.set('rdf:value', 'p2')
        p3 = await hr.createNode('doco:Paragraph')
        await intro.insertNode(p3)
        await p3.set('rdf:value', 'p3')
        p4 = await hr.createNode('doco:Paragraph')
        await intro.insertNode(p4)
        await p4.set('rdf:value', 'p4')
      })
      it('removes node from parents and destroys its children recursively (simple)', async () => {
        await p3.destroy()
        expect(await p3.parents()).to.have.length(0)
        expect(await p3.children(true)).to.have.length(0)
        expect(await p3.get('rdf:type')).to.have.equal(null)
        const expected = ['title', 'p1', 'p2', 'p4']
        await intro.iterate(async (node) => {
          const value = await node.get('rdf:value')
          expect(value).to.eql(expected.shift())
        })
        expect(expected).to.have.length(0)
      })
      it('removes node from parents and destroys its children recursively (simple again)', async () => {
        await title.destroy()
        expect(await title.parents()).to.have.length(0)
        expect(await title.children(true)).to.have.length(0)
        expect(await title.get('rdf:type')).to.have.equal(null)
        const expected = ['p1', 'p2', 'p3', 'p4']
        await intro.iterate(async (node) => {
          const value = await node.get('rdf:value')
          expect(value).to.eql(expected.shift())
        })
        expect(expected).to.have.length(0)
      })
      it('removes node from parents and destroys its children recursively (complex)', async () => {
        await intro.destroy()
        // expect(await intro.parents()).to.have.length(0)
        // console.log(await intro.children(true))
        expect(await intro.children(true)).to.have.length(0)
        // console.log(await intro.children(true))
        expect(await intro.get('rdf:type')).to.have.equal(null)
      })
    })
  })
})
