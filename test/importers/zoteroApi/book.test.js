/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../../helpers/general'

const data = {
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
  extra: 'this is a bit of extra info',
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
}

describe('importing a book from zotero api', () => {
  let hr
  let reference
  before(async () => {
    hr = ramHyperReadings()
    await hr.importZoteroReference(data)
    const collection = await hr.getCollection('default')
    const references = await collect(collection.stream())
    if (references.length) reference = references[0]
  })

  it('creates a new bf:Instance as a reference', async () => {
    expect(reference.type).to.eql('bf:Instance')
  })

  it('sets title on the instance', async () => {
    const title = await reference.getTitle()
    expect(title).to.eql('Martha Rosler: The Bowery in two inadequate descriptive systems')
  })

  it('sets abbreviated title on the instance', async () => {
    const abbreviatedTitle = await reference.getAbbreviatedTitle()
    expect(abbreviatedTitle).to.eql('Martha Rosler')
  })

  it('adds creators as contributions to the instance', async () => {
    const contributions = await reference.contributions()
    expect(contributions).to.have.length(1)
    expect(contributions).to.deep.eql([{
      name: 'Steve Edwards',
      firstName: 'Steve',
      lastName: 'Edwards',
      role: 'marc:aut'
    }])
  })

  it('sets associated tags as subjects on the instance', async () => {
    const subjects = await reference.subjects()
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
    const summary = await reference.getSummary()
    expect(summary).to.eql('a note describing the work')
  })

  it('sets ISBN field as identifiers on the instance', async () => {
    const identifiers = await reference.identifiers()
    expect(identifiers).to.deep.include.members([
      { type: 'bf:Isnb', value: '978-1-84638-083-9' },
      { type: 'bf:Isnb', value: '978-1-84638-084-6' }
    ])
  })

  it('sets place, date and publisher fields as provisionActivity on the instance', async () => {
    const publications = await reference.publications()
    expect(publications).to.have.length(1)
    expect(publications[0].date).to.eql('2012')
    expect(await publications[0].agent.get('rdfs:label')).to.eql('Afterall')
    expect(await publications[0].place.get('rdfs:label')).to.eql('London')
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
      expect(locator).to.eql('a url')
    })

    it('sets callNumber as shelfMark on item', async () => {
      const shelfMark = await item.getShelfMark()
      expect(shelfMark).to.eql('N6537.R582 A62 2012')
    })
  })

  context('with series level information present', () => {
    it('creates a new series when series fields have values', async () => {
      const series = await reference.hasSeries()
      const seriesTitle = await series.getTitle()
      expect(seriesTitle).to.eql('One work')
    })

    it('creates series with reciprocal relationship', async () => {
      const series = await reference.hasSeries()
      const seriesParts = await series.seriesOf()
      expect(seriesParts[0].name).to.eql(reference.name)
    })
  })

  it('needs to address seriesNumber')
  it('needs to address volume')
  it('needs to address numberOfVolumes')
  it('needs to address edition')
  it('needs to address pages')
  it('needs to address language')
  it('needs to address accessDate')
  it('needs to address archive')
  it('needs to address archiveLocation')

  it('sets libraryCatalog as source', async () => {
    const source = await reference.source()
    expect(source).to.equal(data.libraryCatalog)
  })

  it('needs to address rights')
  it('sets extra as a note', async () => {
    const source = await reference.note()
    expect(source).to.equal(data.extra)
  })
})
