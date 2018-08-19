/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../../helpers/general'

const data = {
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
  series: 'Not a real series',
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
}

describe('importing a book section from zotero api', () => {
  let hr
  let reference
  before(async () => {
    hr = ramHyperReadings()
    await hr.importZoteroReference(data)
    const collection = await hr.getCollection('default')
    const references = await collect(collection.stream())
    if (references.length) reference = references[0]
  })

  it('creates a new bf:Instance', async () => {
    expect(reference.type).to.eql('bf:Instance')
  })

  it('sets title on the instance', async () => {
    const title = await reference.getTitle()
    expect(title).to.eql('POETRY')
  })

  it('sets abbreviated title on the instance', async () => {
    const abbreviatedTitle = await reference.getAbbreviatedTitle()
    expect(abbreviatedTitle).to.eql(null)
  })

  it('adds creators as contributions to the instance', async () => {
    const contributions = await reference.contributions()
    expect(contributions).to.have.length(1)
    expect(contributions).to.deep.eql([{
      firstName: 'Joanne',
      lastName: 'Shattock',
      name: 'Joanne Shattock',
      role: 'marc:aut'
    }])
  })

  it('sets associated tags as subjects on the instance', async () => {
    const subjects = await reference.subjects()
    expect(subjects).to.have.length(0)
  })

  it('sets abstractNote to summary on the instance', async () => {
    const summary = await reference.getSummary()
    expect(summary).to.eql('a note describing the work')
  })

  it('adds ISBN field and DOI from extra field as an identifier on the instance', async () => {
    const identifiers = await reference.identifiers()
    expect(identifiers).to.deep.include.members([
      { type: 'bf:Isnb', value: '978-0-511-51868-3' },
      { type: 'bf:Doi', value: '10.1017/CBO9780511518683.005' }
    ])
  })

  it('sets place, date and publisher fields as provisionActivity on the instance', async () => {
    const publications = await reference.publications()
    expect(publications).to.have.length(1)
    expect(publications[0].date).to.eql('2000')
    expect(await publications[0].agent.get('rdfs:label')).to.eql('Cambridge University Press')
    expect(await publications[0].place.get('rdfs:label')).to.eql('Cambridge')
  })

  context('with item level information present', () => {
    let item
    before(async () => {
      const items = await reference.items()
      item = items[0]
    })

    it('creates an item', async () => {
      expect(item.type).to.eql('bf:Item')
    })

    it('sets relations between the instance and item', async () => {
      const itemsInstance = await item.itemOf()
      const instancesItems = await reference.items()
      expect(itemsInstance.name).to.eql(reference.name)
      expect(instancesItems[0].name).to.eql(item.name)
    })

    it('sets url as electronicLocator on item', async () => {
      const locator = await item.getElectronicLocator()
      expect(locator).to.eql('http://www.crossref.org/deleted_DOI.html')
    })

    it('sets callNumber as shelfMark on item', async () => {
      const shelfMark = await item.getShelfMark()
      expect(shelfMark).to.eql(null)
    })
  })

  context('with series level information present', () => {
    it('creates a new series when series fields have values', async () => {
      const series = await reference.hasSeries()
      const seriesTitle = await series.getTitle()
      expect(seriesTitle).to.eql('Not a real series')
    })

    it('creates series with reciprocal relationship', async () => {
      const series = await reference.hasSeries()
      const seriesParts = await series.seriesOf()
      expect(seriesParts[0].name).to.eql(reference.name)
    })
  })

  it('needs to address bookTitle')
  it('needs to address seriesNumber')
  it('needs to address volume')
  it('needs to address numberOfVolumes')
  it('needs to address edition')
  it('needs to address pages')
  it('needs to address language')
  it('needs to address accessDate')
  it('needs to address archive')
  it('needs to address archiveLocation')
  it('needs to address libraryCatalog')
  it('needs to address rights')
  it('needs to address extra')
})
