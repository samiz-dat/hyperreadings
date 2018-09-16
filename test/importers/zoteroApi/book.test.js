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
  seriesNumber: '4',
  volume: '1',
  numberOfVolumes: '2',
  edition: 'first edition',
  place: 'London',
  publisher: 'Afterall',
  date: '2012',
  numPages: '147',
  language: 'english',
  ISBN: '978-1-84638-083-9 978-1-84638-084-6',
  shortTitle: 'Martha Rosler',
  url: 'a url',
  accessDate: '', // we will ignore this for now
  archive: 'A fake archive',
  archiveLocation: 'Box 2',
  libraryCatalog: 'Library of Congress ISBN',
  callNumber: 'N6537.R582 A62 2012',
  rights: 'a rights statement',
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
      role: 'marcrel:aut'
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

    // this value is overridden by the archive location if present
    // need to conditionally test, and decide on default behavior
    it.skip('sets callNumber as shelfMark on item', async () => {
      const shelfMark = await item.getShelfMark()
      expect(shelfMark).to.eql('N6537.R582 A62 2012')
    })
    it('creates an agent with name of archive field and assigns it to heldBy field', async () => {
      const agent = await item.heldBy()
      expect(await agent.get('rdfs:label')).to.eql(data.archive)
    })
    it('sets archiveLocation as shelfMark on item', async () => {
      const shelfMark = await item.getShelfMark()
      expect(shelfMark).to.eql('Box 2')
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

  it('sets seriesNumber to seriesEnumeration on instance', async () => {
    const seriesEnumeration = await reference.seriesEnumeration()
    expect(seriesEnumeration).to.eql(data.seriesNumber)
  })

  it('sets edition to editionStatement on instance', async () => {
    const editionStatement = await reference.editionStatement()
    expect(editionStatement).to.eql(data.edition)
  })

  // Enumeration and chronology are not very clear in BIBFRAME yet - not sure how we should implement it
  it.skip('sets pages to extent on instance', async () => {
    const extents = await reference.getExtents()
    expect(extents).length.to.eql(2)
    expect(extents).to.contain(data.pages)
  })
  // Enumeration and chronology are not very clear in BIBFRAME yet - not sure how we should implement it
  it.skip('sets volume to extent on instance', async () => {
    const extents = await reference.getExtents()
    expect(extents).length.to.eql(2)
    expect(extents).to.contain(data.volume)
  })

  it('needs to address numberOfVolumes')
  it('needs to address accessDate')

  it('sets language on the instance', async () => {
    const language = await reference.language()
    expect(language).to.equal(data.language)
  })

  it('sets libraryCatalog as source', async () => {
    const source = await reference.source()
    expect(source).to.equal(data.libraryCatalog)
  })

  it('set rights as copyrightRegistration', async () => {
    const rights = await reference.rights()
    expect(rights).to.equal(data.rights)
  })

  it('sets extra as a note', async () => {
    const source = await reference.note()
    expect(source).to.equal(data.extra)
  })
})
