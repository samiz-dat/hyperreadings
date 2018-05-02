// var StandardNode = require('./standard-node')
import ContainerNode from './container-node'
import ListItemNode from './list-item-node'

// a dictionary of node types
// when this gets too large - refactor to be separate file per definition
export default {
  'hr:root': ContainerNode,
  'hr:head': ContainerNode,
  'hr:body': ContainerNode,
  'co:ListItem': ListItemNode,
  'doco:Section': ContainerNode,
  'doco:Paragraph': ContainerNode,
  'doco:Title': ContainerNode,
  'po:Block': ContainerNode,
  'po:Inline': ContainerNode
}
