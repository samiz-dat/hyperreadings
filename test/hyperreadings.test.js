/* eslint-env mocha */

import { expect } from 'chai'
import hyperreadings from '../lib/hyperreadings'
// var utils = require('../lib/utils')
// var fs = require('fs')

describe('hyperreadings', () => {
  let hr

  context('with new hyperreading', () => {
    beforeEach(done => {
      hr = hyperreadings()
      hr.on('ready', done)
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

    // describe('hr.createNode(type)', () => {
    //   it('adds a new blank node to the graph', async () => {
    //     const n = await hr.createNode('http://example.com/namespace/')
    //     // find disconnected nodes and expect node.name to be found.
    //   })
    // })
  })
})
