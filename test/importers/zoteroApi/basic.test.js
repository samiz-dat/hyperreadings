/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../../helpers/general'

describe('basic zotero import behaviors', () => {
  let hr
  beforeEach(async () => {
    hr = ramHyperReadings()
  })
  context('when there is a pre-existing person', () => {
    it('does not unnecessarily create a new Person, but links to existing matching person')
  })
  context('when there is a pre-existing series', () => {
    it('does not unnecessarily create a new series, but links to existing matching series', async () => {
      const first = await hr.importZoteroReference({
        itemType: 'book',
        title: 'Critique of cynical reason',
        series: 'Ideology'
      })
      const second = await hr.importZoteroReference({
        itemType: 'book',
        title: 'Postmodernism, or, The Cultural Logic of Late Capitalism',
        series: 'Ideology'
      })
      const third = await hr.importZoteroReference({
        itemType: 'book',
        title: 'Dance',
        series: 'Documents of Contemporary Art'
      })
      const collection = await hr.getCollection('default')
      const references = await collect(collection.stream())
      expect(references).to.have.length(3)
      expect((await first.hasSeries()).name).is.eql((await second.hasSeries()).name)
      expect((await first.hasSeries()).name).is.not.eql((await third.hasSeries()).name)
    })
  })
})
