/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'

describe('AnnotationNode', () => {
  let hr
  beforeEach(done => {
    hr = ramHyperReadings()
    hr.on('ready', done)
  })
  describe('#setMotivation(motive)', () => {
    it('sets motivation')
    context('when there is an exiting motivation', () => {
      it('overrides existing motivation')
    })
  })
  describe('#setTarget(id, opts)', () => {
    context('when opts.start and opts.end are provided', () => {
      it('creates a new target with source equal to id')
      it('creates a new target with a TextPositionSelector')
    })
    context('when there is an exiting target', () => {
      it('overrides removes it before setting new target')
      it('does not do anything if target is already equivalent')
    })
  })
  describe('#setBody(node)', () => {
    context('when first argument as plain text', () => {
      it('adds a new TextualBody node as the body')
    })
    context('when first argument is a node', () => {
      it('adds the node as the body of the annotation')
    })
    context('when there is an exiting motivation', () => {
      it('overrides existing motivation')
    })
  })
})
