import {
  makeGet,
  makeSet,
  makeRemove,
  makeAdd,
  makeAll,
} from '../helpers'

const SharedBehavior = {}

// adminMetadata -> AdminMetadata
// agent -> Agent

// code -> Literal
SharedBehavior.getCode = makeGet('bf:code')
SharedBehavior.setCode = makeSet('bf:code')
SharedBehavior.removeCode = makeRemove('bf:code')

// count -> Literal
SharedBehavior.getCount = makeGet('bf:count')
SharedBehavior.setCount = makeSet('bf:count')
SharedBehavior.removeCount = makeRemove('bf:count')

// date -> Literal
SharedBehavior.getDate = makeGet('bf:date')
SharedBehavior.setDate = makeSet('bf:date')
SharedBehavior.removeDate = makeRemove('bf:date')

// identifiedBy -> Identifier
SharedBehavior.identifiers = async function () {
  const ids = await this.all('bf:identifiedBy')
  return Promise.all(ids.map(async id => ({
    type: id.type,
    value: await id.get('rdf:value')
  })))
}
SharedBehavior.addIdentifier = makeAdd('bf:identifiedBy')
SharedBehavior.removeIdentifier = makeRemove('bf:identifiedBy')

SharedBehavior.addDoi = async function (value) {
  const node = await this.hr.createNode('bf:Doi', { 'rdf:value': value })
  return this.add('bf:identifiedBy', node)
}
SharedBehavior.addIsbn = async function (value) {
  const node = await this.hr.createNode('bf:Isnb', { 'rdf:value': value })
  return this.add('bf:identifiedBy', node)
}
SharedBehavior.addIssn = async function (value) {
  const node = await this.hr.createNode('bf:Issn', { 'rdf:value': value })
  return this.add('bf:identifiedBy', node)
}
SharedBehavior.addIssnL = async function (value) {
  const node = await this.hr.createNode('bf:IssnL', { 'rdf:value': value })
  return this.add('bf:identifiedBy', node)
}
// language -> Language

// note -> Note
SharedBehavior.getNote = makeGet('bf:note')
SharedBehavior.setNote = makeSet('bf:note')
SharedBehavior.removeNote = makeRemove('bf:note')

// part -> Literal
// // Part of a resource to which information applies.
SharedBehavior.getPart = makeGet('bf:part')
SharedBehavior.setPart = makeSet('bf:part')
SharedBehavior.removePart = makeRemove('bf:part')

// place -> Place
//   // Geographic location or place entity associated with a resource or element of description, such as the place associated with the publication, printing, distribution, issue, release or production of a resource, place of an event.

// qualifier -> Literal
// // Qualifier of information, such as an addition to a title to make it unique or qualifying information associated with an identifier.
SharedBehavior.getQualifier = makeGet('bf:qualifier')
SharedBehavior.setQualifier = makeSet('bf:qualifier')
SharedBehavior.removeQualifier = makeRemove('bf:qualifier')

// source -> Source
// //  Resource from which value or label came or was derived, such as the formal source/scheme from which a classification number is taken or derived, list from which an agent name is taken or derived, source within which an identifier is unique.
// status -> Status
// // Designation of the validity or position of something, such as indication that the classification number is canceled or invalid, circulation availability of an item, indication of whether the identifier is canceled or invalid.
// unit -> Unit
// // Units in which a value is expressed, such as the physical or logical constituent of a resource (e.g., a volume, audiocassette, film reel, a map, a digital file).

export default SharedBehavior
