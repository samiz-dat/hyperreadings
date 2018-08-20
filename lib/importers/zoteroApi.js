import { ZOTERO_TO_MARC_ROLES } from '../constants'

function convertRoleToMarcRelator (role) {
  const relator = ZOTERO_TO_MARC_ROLES[role] || 'aut'
  return { name: `marc:${relator}` }
}

async function importCreators (hr, node, creators) {
  for (let i = 0; i < creators.length; i++) {
    const creator = creators[i]
    if (creator) {
      const name = [creator.firstName, creator.lastName].join(' ')
      // first find an existing person with ths
      const people = await hr.findPeople({ name })
      let person
      if (people.length === 0) {
        person = await hr.createNode('bf:Person', {
          'foaf:name': name,
          'foaf:firstName': creator.firstName,
          'foaf:lastName': creator.lastName
        })
      } else {
        // just select the first; however we should probably allow for some disambiguation
        person = people[0]
      }
      await node.addContribution(person, convertRoleToMarcRelator(creator.role))
    }
  }
}

async function importTagsAsSubjects (node, tags) {
  for (let i = 0; i < tags.length; i++) {
    if (tags[i] && tags[i].tag) {
      await node.addSubject(tags[i].tag)
    }
  }
}

async function importIdentifier (node, str, type) {
  const ids = str.split(' ')
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].trim()
    if (id && id.length) {
      if (type === 'isbn') await node.addIsbn(id)
      if (type === 'issn') await node.addIssn(id)
      if (type === 'doi') await node.addDoi(id)
    }
  }
}

async function importIdentifiersFromExtraField (node, extra) {
  const lines = extra.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('DOI:')) {
      await importIdentifier(node, line.substring(4), 'doi')
    }
  }
}

function hasItemLevelFields (data) {
  if (data.url) return true
  if (data.callNumber) return true
  return false
}

function hasProvisionFields (data) {
  if (data.place) return true
  if (data.publisher) return true
  if (data.date) return true
  return false
}

function hasSeriesLevelFields (data) {
  if (data.series) return data.series
  return false
}

function hasParentLevelFields (data) {

}

async function getCollectionToAddTo (hr) {
  const collections = await hr.collections()
  if (collections.length === 0) {
    const collection = await hr.createCollection('default')
    return collection.addNewPage()
  }
  const lastPage = await collections[0].lastPage()
  if (lastPage) {
    const total = await lastPage.totalItems()
    // pagination limit should probably not be hard coded here.
    if (total < 20) return lastPage
    return collections[0].addNewPage()
  }
  // returns unpaginated collection not sure if this is what we really want
  // or whether we add a page to the existing collection
  // but what if the collection already has items?...
  return collections[0]
}

async function zotero (hr, data) {
  if (!data || !data.itemType) throw new Error('ZoteroApi translator expects data with itemType')
  // check if collection exists
  const collection = await getCollectionToAddTo(hr)
  const instance = await hr.createNode('bf:Instance')
  // add instance to collection
  await collection.addItem(instance)
  if (data.creators) await importCreators(hr, instance, data.creators)
  if (data.title) await instance.setTitle(data.title)
  if (data.shortTitle) await instance.setAbbreviatedTitle(data.shortTitle)
  if (data.abstractNote) await instance.setSummary(data.abstractNote)
  if (data.tags) await importTagsAsSubjects(instance, data.tags)
  if (data.ISBN) await importIdentifier(instance, data.ISBN, 'isbn')
  if (data.ISSN) await importIdentifier(instance, data.ISSN, 'issn')
  if (data.DOI) await importIdentifier(instance, data.DOI, 'doi')
  if (data.extra) {
    await importIdentifiersFromExtraField(instance, data.extra)
    await instance.setNote(data.extra)
  }
  if (data.libraryCatalog) await instance.setSource(data.libraryCatalog)
  if (hasProvisionFields(data)) {
    await instance.addPublication({
      place: data.place,
      date: data.date,
      publisher: data.publisher
    })
  }
  if (hasItemLevelFields(data)) {
    const item = await hr.createNode('bf:Item')
    instance.addItem(item)
    if (data.callNumber) await item.setShelfMark(data.callNumber)
    if (data.url) await item.setElectronicLocator(data.url)
    if (data.archive) {
      await item.setHeldBy(data.archive)
    }
  }
  if (hasParentLevelFields(data)) {

  }
  if (hasSeriesLevelFields(data)) {
    // check if the series already exists
    // then create series and link to instance
    const series = await hr.createNode('bf:Instance')
    if (data.series) await series.setTitle(data.series)
    await instance.setSeriesOf(series)
  }
}

export default zotero
