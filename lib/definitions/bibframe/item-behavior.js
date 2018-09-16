import {
  makeGet,
  makeSet,
  makeRemove,
  makeSetAsLabelOnType,
  makeGetLabelFromNode
//  makeAdd,
//  makeAll
} from '../helpers'
import { isNode } from '../../utils'

const ItemBehavior = {}

// enumerationAndChronology -> EnumerationAndChronology / Enumeration or Chronology
// // Enumeration: Numbering or other enumeration associated with issues or items held.
// // Chronology: Dates associated with issues or items held.
// sublocation -> Sublocation
// heldBy -> Agent
ItemBehavior.setHeldBy = async function (name) {
  if (isNode(name)) return this.set('bf:heldBy', name)
  const agents = await this.hr.findAgents({ label: name })
  let agent
  if (agents.length === 0) {
    agent = await this.hr.createNode('bf:Agent', { 'rdfs:label': name })
  } else {
    agent = agents[0]
  }
  return this.set('bf:heldBy', agent)
}
ItemBehavior.heldBy = makeGet('bf:heldBy')

// immediateAcquisition -> ImmediateAcquisition
// //  Information about the circumstances, e.g., source, date, method, under which the resource was directly acquired.
// itemOf -> Instance
ItemBehavior.itemOf = makeGet('bf:itemOf')
// physicalLocation -> Literal
ItemBehavior.getPhysicalLocation = makeGet('bf:physicalLocation')
ItemBehavior.setPhysicalLocation = makeSet('bf:physicalLocation')
ItemBehavior.removePhysicalLocation = makeRemove('bf:physicalLocation')

// shelfMark -> ShelfMark
// // Piece identifier, such as a call or other type of number.
ItemBehavior.setShelfMark = makeSetAsLabelOnType('bf:shelfMark', 'bf:ShelfMark')
ItemBehavior.getShelfMark = makeGetLabelFromNode('bf:shelfMark', 'bf:ShelfMark')
// electronicLocator ->
// // Electronic location from which the resource is available.
ItemBehavior.getElectronicLocator = makeGet('bf:electronicLocator')
ItemBehavior.setElectronicLocator = makeSet('bf:electronicLocator')
ItemBehavior.removeElectronicLocator = makeRemove('bf:electronicLocator')
export default ItemBehavior
