import {
  makeRecipricalBinding,
  makeGet,
  makeSet,
  makeRemove,
  makeAdd,
  makeAll,
  allWithType
} from '../helpers'

const InstanceBehavior = {}
// has subclass
// Print
// Manuscript
// Archival
// Tactile
// Electronic

// provisionActivityStatement - literal
// responsibilityStatement -> literal
// seriesStatement
// seriesEnumeration
// subseriesEnumeration
// subseriesStatement
// // Statement relating to any persons, families, or corporate bodies responsible for the creation of, or contributing to the content of a resource; usually transcribed.
// provisionActivity
InstanceBehavior.addPublication = async function (data) {
  const publication = await this.hr.createNode('bf:Publication', { 'bf:date': data.date })
  // add place
  if (data.place) {
    let places = await this.hr.findPlaces({ label: data.place })
    let place
    if (places.length === 0) {
      place = await this.hr.createNode('bf:Place', { 'rdfs:label': data.place })
    } else {
      place = places[0]
    }
    await publication.set('bf:place', place)
  }
  if (data.publisher) {
    let agents = await this.hr.findAgents({ label: data.publisher })
    let publisher
    if (agents.length === 0) {
      publisher = await this.hr.createNode('bf:Agent', { 'rdfs:label': data.publisher })
    } else {
      publisher = agents[0]
    }
    await publication.set('bf:agent', publisher)
  }
  return this.add('bf:provisionActivity', publication)
}

InstanceBehavior.publications = async function () {
  const publications = await allWithType.call(this, 'bf:provisionActivity', 'bf:Publication')
  return Promise.all(publications.map(async (pub) => {
    return {
      date: await pub.get('bf:date'),
      place: await pub.get('bf:place'),
      agent: await pub.get('bf:agent')
    }
  }))
}
// baseMaterial -> BaseMaterial
// bookFormat -> BookFormat
// carrier -> Carrier
// dimensions -> Literal
// editionEnumeration
// editionStatement
// extent -> Extent

// //  Number and type of units and/or subunits making up a resource.
// hasItem -> Item
InstanceBehavior.addItem = makeRecipricalBinding('bf:hasItem', 'bf:itemOf', 'many-to-one')
InstanceBehavior.removeItem = makeRemove('bf:hasItem')
InstanceBehavior.items = makeAll('bf:hasItem')
// hasReproduction -> Instance
// instanceOf -> Work
InstanceBehavior.instanceOf = makeRecipricalBinding('bf:instanceOf', 'bf:hasInstance', 'many-to-many')
// issuedWith -> Instance

export default InstanceBehavior
