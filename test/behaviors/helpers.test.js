/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'

import { makeSetAsLabelOnType } from '../../lib/definitions/helpers'
import { createFactory, compose } from '../../lib/definitions/utils'
import StandardBehavior from '../../lib/definitions/standard-behavior'
import { spo } from '../../lib/utils'

describe('Behaviour Construction Helpers', () => {
  let hr

  beforeEach(done => {
    hr = ramHyperReadings()
    hr.on('ready', done)
  })

  describe('.makeSetAsLabelOnType()', () => {
    let factory
    let node
    let otherNode
    const PREDICATE = 'hr:predicate'
    const CLASS = 'hr:TestClass'
    before(() => {
      // create factory to generate nodes with the behavours we want to test
      const testBehavior = {
        setTest: makeSetAsLabelOnType(PREDICATE, CLASS)
      }
      factory = createFactory(compose(StandardBehavior, testBehavior))
    })

    beforeEach(async () => {
      let triple = spo('_:1', 'rdf:type', 'hr:test')
      await hr._put(triple)
      node = factory({ name: triple.subject, type: triple.object, hr })
      triple = spo('_:2', 'rdf:type', 'hr:test')
      await hr._put(triple)
      otherNode = factory({ name: triple.subject, type: triple.object, hr })
    })

    context('when predicate has not already been set', () => {
      context('when setting literal value', () => {
        it('sets literal as a label with type on specified predicate', async () => {
          await node.setTest('value')
          const value = await node.get(PREDICATE)
          expect(value.type).to.equal(CLASS)
          expect(await value.get('rdfs:label')).to.equal('value')
        })
      })
      context('when setting node value', () => {
        it('sets node directly on specified predicate', async () => {
          const newNode = await hr.createNode('as:Note')
          await node.setTest(newNode)
          const value = await node.get(PREDICATE)
          expect(value.name).to.equal(newNode.name)
        })
      })
      context('when setting literal value which already exists on another node', () => {
        it('does not create a new node unnecessarily but uses existing node', async () => {
          await otherNode.setTest(2018)
          await node.setTest(2018)
          const otherValue = await otherNode.get(PREDICATE)
          const value = await node.get(PREDICATE)
          expect(value.name).to.equal(otherValue.name)
        })
      })
    })

    context('when predicate already exists', () => {
      context('when setting literal value', () => {
        it('overwrites literal as a label with type on specified predicate', async () => {
          await node.setTest('oldValue')
          await node.setTest('value')
          const value = await node.get(PREDICATE)
          expect(value.type).to.equal(CLASS)
          expect(await value.get('rdfs:label')).to.equal('value')
        })
      })
      context('when setting node value', () => {
        it('overwrites node directly on specified predicate', async () => {
          await node.setTest('oldValue')
          const newNode = await hr.createNode('as:Note')
          await node.setTest(newNode)
          const value = await node.get(PREDICATE)
          expect(value.name).to.equal(newNode.name)
        })
        it('deletes old node', async () => {
          await node.setTest('oldValue')
          const oldNode = await node.get(PREDICATE)
          const newNode = await hr.createNode('as:Note')
          await node.setTest(newNode)
          expect(await oldNode.get('rdfs:label')).to.eql(null)
        })
      })
      context('when setting a literal value which already exists on another node', () => {
        it('does not create a new node unnecessarily but uses existing node', async () => {
          await node.setTest('oldValue')
          await otherNode.setTest(2018)
          await node.setTest(2018)
          const otherValue = await otherNode.get(PREDICATE)
          const value = await node.get(PREDICATE)
          expect(value.name).to.equal(otherValue.name)
        })
      })
      context('when overwriting a literal value which already exists on another node', () => {
        it('creates a new node and does not edit the existing one', async () => {
          await node.setTest(2018)
          await otherNode.setTest(2018)
          await node.setTest('new value')
          const otherValue = await otherNode.get(PREDICATE)
          const value = await node.get(PREDICATE)
          expect(await otherValue.get('rdfs:label')).to.equal(2018)
          expect(await value.get('rdfs:label')).to.equal('new value')
        })
      })
    })
  })
  describe('.makeGetLiteralOrPredicateFromNodeWithType()', () => {
    let factory
    let node
    let otherNode
    const PREDICATE = 'hr:predicate'
    const CLASS = 'hr:TestClass'
    before(() => {
      // create factory to generate nodes with the behavours we want to test
      const testBehavior = {
        setTest: makeSetAsLabelOnType(PREDICATE, CLASS)
      }
      factory = createFactory(compose(StandardBehavior, testBehavior))
    })

    beforeEach(async () => {
      let triple = spo('_:1', 'rdf:type', 'hr:test')
      await hr._put(triple)
      node = factory({ name: triple.subject, type: triple.object, hr })
      triple = spo('_:2', 'rdf:type', 'hr:test')
      await hr._put(triple)
      otherNode = factory({ name: triple.subject, type: triple.object, hr })
    })
  })
})
