/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'

const testData = {
  book: {
    itemType: 'book',
    title: 'Martha Rosler: The Bowery in two inadequate descriptive systems',
    creators: [
      {
        creatorType: 'author',
        firstName: 'Steve',
        lastName: 'Edwards'
      }
    ],
    abstractNote: 'a note describing the work',
    series: 'One work',
    seriesNumber: '',
    volume: '',
    numberOfVolumes: '',
    edition: '',
    place: 'London',
    publisher: 'Afterall',
    date: '2012',
    numPages: '147',
    language: '',
    ISBN: '978-1-84638-083-9 978-1-84638-084-6',
    shortTitle: 'Martha Rosler',
    url: 'a url',
    accessDate: '',
    archive: '',
    archiveLocation: '',
    libraryCatalog: 'Library of Congress ISBN',
    callNumber: 'N6537.R582 A62 2012',
    rights: '',
    extra: '',
    tags: [
      {
        tag: 'Bowery in two inadequate descriptive systems',
        type: 1
      },
      {
        tag: 'Conceptual art',
        type: 1
      },
      {
        tag: 'Criticism and interpretation',
        type: 1
      },
      {
        tag: 'Rosler, Martha',
        type: 1
      },
      {
        tag: 'United States',
        type: 1
      }
    ]
  },
  section: {
    itemType: 'bookSection',
    title: 'POETRY',
    creators: [
      {
        creatorType: 'editor',
        firstName: 'Joanne',
        lastName: 'Shattock'
      }
    ],
    abstractNote: 'a note describing the work',
    bookTitle: 'The Cambridge Bibliography of English Literature',
    series: '',
    seriesNumber: '',
    volume: '4',
    numberOfVolumes: '',
    edition: '3',
    place: 'Cambridge',
    publisher: 'Cambridge University Press',
    date: '2000',
    pages: '207-858',
    language: '',
    ISBN: '978-0-511-51868-3',
    shortTitle: '',
    url: 'http://www.crossref.org/deleted_DOI.html',
    accessDate: '2018-07-03 06:57:08',
    archive: '',
    archiveLocation: '',
    libraryCatalog: 'Crossref',
    callNumber: '',
    rights: '',
    extra: 'DOI: 10.1017/CBO9780511518683.005',
    tags: []
  },
  journal: {
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
}

describe.only('importing from zotero api', () => {
  let hr
  context('when item type is a book', () => {
    before(async () => {
      hr = ramHyperReadings()
      return hr.importZoteroReference(testData.book)
    })
    it('creates a new bf:Instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      expect(instance).to.not.eql(null)
    })
    it('sets title on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const title = await instance.getTitle()
      expect(title).to.eql('Martha Rosler: The Bowery in two inadequate descriptive systems')
    })
    it('sets abbreviated title on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const abbreviatedTitle = await instance.getAbbreviatedTitle()
      expect(abbreviatedTitle).to.eql('Martha Rosler')
    })
    it('adds creators as contributions to the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const contributions = await instance.contributions()
      expect(contributions).to.have.length(1)
      expect(contributions).to.deep.eql([{
        name: 'Steve Edwards',
        firstName: 'Steve',
        lastName: 'Edwards',
        role: 'marc:aut'
      }])
    })
    it('sets associated tags as subjects on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const subjects = await instance.subjects()
      expect(subjects).to.have.length(5)
      expect(subjects).to.include.members([
        'Bowery in two inadequate descriptive systems',
        'Conceptual art',
        'Criticism and interpretation',
        'Rosler, Martha',
        'United States'
      ])
    })
    it('sets abstractNote to summary on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const summary = await instance.getSummary()
      expect(summary).to.eql('a note describing the work')
    })
    it('sets ISBN field as identifiers on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const identifiers = await instance.identifiers()
      expect(identifiers).to.deep.include.members([
        { type: 'bf:Isnb', value: '978-1-84638-083-9' },
        { type: 'bf:Isnb', value: '978-1-84638-084-6' }
      ])
    })
    it('sets place, date and publisher fields as provisionActivity on the instance', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const publications = await instance.publications()
      expect(publications).to.have.length(1)
      expect(publications[0].date).to.eql('2012')
      expect(await publications[0].agent.get('rdfs:label')).to.eql('Afterall')
      expect(await publications[0].place.get('rdfs:label')).to.eql('London')
      // expect(publications).to.deep.include.members([
      //   { type: 'bf:Isnb', value: '978-1-84638-083-9' },
      //   { type: 'bf:Isnb', value: '978-1-84638-084-6' }
      // ])
    })
    it('creates an item', async () => {
      const item = await hr.nodeByType('bf:Item')
      expect(item).to.not.eql(null)
    })
    it('sets relations between the instance and item', async () => {
      const instance = await hr.nodeByType('bf:Instance')
      const item = await hr.nodeByType('bf:Item')
      const itemsInstance = await item.itemOf()
      const instancesItems = await instance.items()
      expect(itemsInstance).to.eql(instance)
      expect(instancesItems[0]).to.eql(item)
    })
    it('sets url as electronicLocator on item', async () => {
      const item = await hr.nodeByType('bf:Item')
      const locator = await item.getElectronicLocator()
      expect(locator).to.eql('a url')
    })
    it('sets callNumber as shelfMark on item', async () => {
      const item = await hr.nodeByType('bf:Item')
      const shelfMark = await item.getShelfMark()
      expect(shelfMark).to.eql('N6537.R582 A62 2012')
    })
  })
  context('when item type is a chapter', () => {
    it('adds a new reference as bibframe elements')
  })
  context('when item type is a journalArticle', () => {
    it('adds a new reference as bibframe elements')
  })
})
