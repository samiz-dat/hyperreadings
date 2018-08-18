import {
  makeGet,
  makeSet,
  makeRemove,
  makeSetAsLabelOnType,
  makeGetLabelFromNode
//  makeAdd,
//  makeAll
} from '../helpers'

const ItemBehavior = {}

// enumerationAndChronology -> EnumerationAndChronology / Enumeration or Chronology
// // Enumeration: Numbering or other enumeration associated with issues or items held.
// // Chronology: Dates associated with issues or items held.
// sublocation -> Sublocation
// heldBy -> Agent
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
