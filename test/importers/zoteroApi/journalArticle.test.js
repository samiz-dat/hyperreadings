/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../../helpers/general'

const data = {
  itemType: 'journalArticle',
  title: 'On Libraries : Introduction',
  creators: [
    {
      creatorType: 'author',
      firstName: 'Misha',
      lastName: 'Myers'
    },
    {
      creatorType: 'author',
      firstName: 'Deirdre',
      lastName: 'Heddon'
    }
  ],
  abstractNote: 'a note describing the work',
  publicationTitle: 'Performance Research',
  volume: '22',
  issue: '1',
  pages: '1-8',
  date: 'January 2, 2017',
  series: '',
  seriesTitle: '',
  seriesText: '',
  journalAbbreviation: '',
  language: '',
  DOI: '10.1080/13528165.2017.1285554',
  ISSN: '1352-8165',
  shortTitle: 'On Libraries',
  url: 'https://doi.org/10.1080/13528165.2017.1285554',
  accessDate: '2018-07-03 08:44:41',
  archive: '',
  archiveLocation: '',
  libraryCatalog: 'Taylor and Francis+NEJM',
  callNumber: '',
  rights: '',
  extra: '',
  tags: []
}

describe.only('importing a journal article from zotero api', () => {
  let hr
  let reference
  before(async () => {
    hr = ramHyperReadings()
    await hr.importZoteroReference(data)
    const collection = await hr.getCollection('default')
    const references = await collect(collection.stream())
    if (references.length) reference = references[0]
  })

  it('needs tests for title')
  it('needs tests for creators')
  it('needs tests for abstractNote')
  it('needs tests for publicationTitle')
  it('needs tests for volume')
  it('needs tests for issue')
  it('needs tests for pages')
  it('needs tests for date')
  it('needs tests for series')
  it('needs tests for seriesTitle')
  it('needs tests for seriesText')
  it('needs tests for journalAbbreviation')
  it('needs tests for language')
  it('needs tests for DOI')
  it('needs tests for ISSN')
  it('needs tests for shortTitle')
  it('needs tests for url')
  it('needs tests for accessDate')
  it('needs tests for archive')
  it('needs tests for archiveLocation')
  it('needs tests for libraryCatalog')
  it('needs tests for callNumber')
  it('needs tests for rights')
  it('needs tests for extra')
  it('needs tests for tags')
})
