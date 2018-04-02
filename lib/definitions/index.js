// var StandardNode = require('./standard-node')
var ContainerNode = require('./container-node')

// a dictionary of node types
// when this gets too large - refactor to be separate file per definition
module.exports = {
  'hr:root': {
    Class: ContainerNode
    // this is where we should add specific constraints to the nodes
    // eg: whitelist valid properties
    // or properties which are explicit errors
    // or other configuration variables which define how this node type should be used.
  },
  'co:listItem': {
    Class: ContainerNode
    // this is where we should add specific constraints to the nodes
    // eg: whitelist valid properties
    // or properties which are explicit errors
    // or other configuration variables which define how this node type should be used.
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
