/* eslint-env mocha */

import { expect } from 'chai'
import { ramHyperReadings } from './helpers/general'
describe('hyperreadings', () => {
  let hr

  context('with new hyperreading', () => {
    beforeEach(done => {
      hr = ramHyperReadings()
      hr.on('ready', done)
    })

    describe('hr.key()', () => {
      it('returns the hyperdb key', () => {
        const key = hr.key()
        expect(key).to.be.a('string')
        expect(key).to.have.length(64)
      })
    })

    describe('hr.setTitle(title)', () => {
      it('throws error if title is empty', () => {
        expect(() => hr.setTitle('')).to.throw(/Title must be a string/)
      })
      it('throws error if title is not a string', () => {
        expect(() => hr.setTitle(222)).to.throw(/Title must be a string/)
      })
      it('sets the title of the reading list', async () => {
        await hr.setTitle('hello')
        const title = await hr.title()
        expect(title).to.eql('hello')
      })
    })

    describe('hr.title()', () => {
      it('gets the title of the reading list', async () => {
        await hr.setTitle('radical librarians')
        const title = await hr.title()
        expect(title).to.eql('radical librarians')
      })

      it('returns untitled if title has not been set', async () => {
        const title = await hr.title()
        expect(title).to.eql('untitled')
      })
    })

    describe('initial state', () => {
      it('starts without a root node', async () => {
        var r = await hr.root()
        expect(r).to.eql(null)
      })
      it('has private _nodeCount === 0', () => {
        expect(hr._nodeCount).to.eql(0)
      })
    })

    describe('hr.importFile(filename, opts)', () => {
      it('throws error if filename is not given', async () => {
        expect(() => hr.importFile()).to.throw(/requires filename to be a string/)
      })
      it('throws error if filename is not string', async () => {
        expect(() => hr.importFile(23)).to.throw(/requires filename to be a string/)
      })
      it('throws error if filetype is not recognized', async () => {
        expect(() => hr.importFile('test.pdf')).to.throw(/does not recognize file extension/)
      })
    })

    describe('hr.import(data, opts)', () => {
      it('resolves to undefined when no data is provided', async () => {
        var data = await hr.import()
        expect(data).to.eql(undefined)
      })
      it('throws error if opts.type is not set', async () => {
        expect(() => hr.import('# test')).to.throw(/requires opts.type to be set/)
        expect(() => hr.import('# test', {})).to.throw(/requires opts.type to be set/)
      })
      it('throws error if opts.type is not supported', async () => {
        expect(() => hr.import('# test', { type: 'pdf' })).to.throw(/does not recognize type/)
      })
    })

    describe('hr.root()', () => {
      it('returns a node object for hr root', async () => {
        const node = await hr.createNode('hr:root')
        const r = await hr.root()
        // expect(r).to.be.instanceOf()
        expect(r).to.include.keys('name', 'type')
        // these variables should not be hard coded as each are defined in code
        expect(r.name).to.eql(node.name)
        expect(r.type).to.eql('hr:root')
      })
    })

    describe('hr.nodesByType(type)', () => {
      it('adds a new blank node to the graph', async () => {
        const type = 'http://example.com/namespace/'
        await hr.createNode(type)
        await hr.createNode(type)
        await hr.createNode('not-this-one')
        const nodes = await hr.nodesByType(type)
        expect(nodes).to.have.length(2)
        nodes.forEach(node => expect(node.type).to.eql(type))
      })
    })

    describe('hr.createNode(type, [properties])', () => {
      it('adds a new blank node to the graph of type', async () => {
        const type = 'http://example.com/namespace/'
        const n = await hr.createNode(type)
        const nodes = await hr.nodesByType(type)
        expect(nodes).to.have.length(1)
        expect(nodes[0].name).to.eql(n.name)
      })
      it('returns rejected promise if no type is provided', () => {
        return hr.createNode()
          .then(() => expect.fail())
          .catch(err => {
            expect(err).to.be.an('error')
            expect(err.message).to.be.string('Cannot create a node without type')
          })
      })
      it('allows you to set properties when creating new node', async () => {
        const type = 'http://example.com/namespace/'
        const data = { 'rdf:value': 23, 'c4o:hasContent': 'very import contents' }
        const n = await hr.createNode(type, data)
        const nodes = await hr.nodesByType(type)
        expect(nodes).to.have.length(1)
        expect(await n.get('rdf:value')).to.eql(data['rdf:value'])
        expect(await n.get('c4o:hasContent')).to.eql(data['c4o:hasContent'])
      })

      it('allows you to set the nodes name via property.id', async () => {
        const type = 'http://example.com/namespace/'
        const data = { id: 'named', 'rdf:value': 23, 'c4o:hasContent': 'very import contents' }
        const n = await hr.createNode(type, data)
        const nodes = await hr.nodesByType(type)
        expect(nodes).to.have.length(1)
        expect(n.name).to.eql('named')
        expect(await n.get('id')).to.eql(null)
        expect(await n.get('rdf:value')).to.eql(data['rdf:value'])
        expect(await n.get('c4o:hasContent')).to.eql(data['c4o:hasContent'])
      })
    })
    describe('hr.exists(id, [type])', () => {
      let name
      beforeEach(async () => {
        const n = await hr.createNode('hr:test')
        name = n.name
      })
      context('with type', () => {
        it('returns false if node does not exist', async () => {
          expect(await hr.exists('hr:not')).to.eql(false)
        })
        it('returns true if node exists', async () => {
          expect(await hr.exists(name)).to.eql(true)
        })
      })
      context('without type', () => {
        it('returns false if node does not exist', async () => {
          expect(await hr.exists('hr:not')).to.eql(false)
        })
        it('returns false if node names exists but not with type', async () => {
          expect(await hr.exists(name, 'hr:root')).to.eql(false)
        })
        it('returns true if node exists', async () => {
          expect(await hr.exists(name, 'hr:test')).to.eql(true)
        })
      })
    })
  })
})
