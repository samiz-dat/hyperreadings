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

function hasItemLevelFields (data) {
  if (data.url) return true
  if (data.callNumber) return true
  return false
}

async function zotero (hr, data) {
  if (!data || !data.itemType) throw new Error('ZoteroApi translator expects data with itemType')
  const instance = await hr.createNode('bf:Instance')
  if (data.creators) await importCreators(hr, instance, data.creators)
  if (data.title) await instance.setTitle(data.title)
  if (data.shortTitle) await instance.setAbbreviatedTitle(data.shortTitle)
  if (data.abstractNote) await instance.setSummary(data.abstractNote)
  if (data.tags) await importTagsAsSubjects(instance, data.tags)
  if (hasItemLevelFields(data)) {
    const item = await hr.createNode('bf:Item')
    if (data.callNumber) await item.setShelfMark(data.callNumber)
    if (data.url) await item.setElectronicLocator(data.electronicLocator)
  }
}

export default zotero
