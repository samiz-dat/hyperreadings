// var StandardNode = require('./standard-node')
import ContainerNode from './container-node'
import ListItemNode from './list-item-node'

// a dictionary of node types
// when this gets too large - refactor to be separate file per definition
export default {
  'hr:root': {
    Class: ContainerNode
    // this is where we should add specific constraints to the nodes
    // eg: whitelist valid properties
    // or properties which are explicit errors
    // or other configuration variables which define how this node type should be used.
  },
  'co:ListItem': {
    Class: ListItemNode
  },
  'doco:Section': {
    Class: ContainerNode
  },
  'doco:Paragraph': {
    Class: ContainerNode
  },
  'doco:Title': {
    Class: ContainerNode
  },
  'po:Block': {
    Class: ContainerNode
  },
  'po:Inline': {
    Class: ContainerNode
  }
}
