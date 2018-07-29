// var StandardNode = require('./standard-node')
import ContainerNode from './container-node'
import ListItemNode from './list-item-node'
import InstanceNode from './bf-instance-node'

// a dictionary of node types
// when this gets too large - refactor to be separate file per definition
export default {
  'hr:root': ContainerNode,
  'hr:head': ContainerNode,
  'hr:body': ContainerNode,
  'doco:List': ContainerNode,
  'doco:Section': ContainerNode,
  'doco:Paragraph': ContainerNode,
  'doco:Title': ContainerNode,
  'po:Block': ContainerNode,
  'po:Inline': ContainerNode,
  'co:ListItem': ListItemNode,
  'bf:Instance': InstanceNode
}
