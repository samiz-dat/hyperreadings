import {
  makeGet,
  makeSet,
  makeRemove,
  makeAdd,
  makeAll,
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
// baseMaterial -> BaseMaterial
// bookFormat -> BookFormat
// carrier -> Carrier
// dimensions -> Literal
// editionEnumeration
// editionStatement
// extent -> Extent
// //  Number and type of units and/or subunits making up a resource.
// hasItem -> Item
InstanceBehavior.addItem = async function (item) {
  // need to add check for type rather than just failing if item does not have particular properties
  // if (item.type !== 'bf:Item')
  await this.add('bf:hasItem', item)
  await item.setItemOf(this)
}
InstanceBehavior.removeItem = makeRemove('bf:hasItem')
InstanceBehavior.items = makeAll('bf:hasItem')
// hasReproduction -> Instance
// instanceOf -> Work
// issuedWith -> Instance

export default InstanceBehavior
