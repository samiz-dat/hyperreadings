import { compose, createFactory } from './utils'
import StandardBehavior from './standard-behavior'
import ContainerBehavior from './container-behavior'
import ListItemBehavior from './list-item-behavior'
import AgentBehavior from './foaf/agent-behavior'
import PersonBehavior from './foaf/person-behavior'
import WorkBehavior from './bibframe/work-behavior'
import InstanceBehavior from './bibframe/instance-behavior'
import ItemBehavior from './bibframe/item-behavior'
import SharedBehavior from './bibframe/shared-behavior'
import WorkOrInstanceBehavior from './bibframe/work-or-instance-behavior'
import WorkInstanceOrItemBehavior from './bibframe/work-instance-or-item-behavior'
import ContributionBehavior from './bibframe/contribution-behavior'

const createStandardNode = createFactory(StandardBehavior)
const createContainerNode = createFactory(compose(StandardBehavior, ContainerBehavior))
const createListItemNode = createFactory(compose(StandardBehavior, ListItemBehavior))

const WorkNode = createFactory(compose(
  StandardBehavior,
  SharedBehavior,
  WorkInstanceOrItemBehavior,
  WorkOrInstanceBehavior,
  WorkBehavior
))
const InstanceNode = createFactory(compose(
  StandardBehavior,
  SharedBehavior,
  WorkInstanceOrItemBehavior,
  WorkOrInstanceBehavior,
  InstanceBehavior
))
const ItemNode = createFactory(compose(
  StandardBehavior,
  SharedBehavior,
  WorkInstanceOrItemBehavior,
  ItemBehavior
))

const AgentNode = createFactory(compose(StandardBehavior, SharedBehavior, AgentBehavior))
const PersonNode = createFactory(compose(StandardBehavior, SharedBehavior, AgentBehavior, PersonBehavior))
const ContributionNode = createFactory(compose(StandardBehavior, ContributionBehavior))

const FACTORY_BY_TYPE = {
  'hr:root': createContainerNode,
  'hr:head': createContainerNode,
  'hr:body': createContainerNode,
  'doco:List': createContainerNode,
  'doco:Section': createContainerNode,
  'doco:Paragraph': createContainerNode,
  'doco:Title': createContainerNode,
  'po:Block': createContainerNode,
  'po:Inline': createContainerNode,
  'co:ListItem': createListItemNode,

  'bf:Work': WorkNode,
  // subclasses of Work
  'bf:Text': WorkNode,
  'bf:Cartography': WorkNode,
  'bf:Audio': WorkNode,
  'bf:NotatedMusic': WorkNode,
  'bf:NotatedMovement': WorkNode,
  'bf:Dataset': WorkNode,
  'bf:StillImage': WorkNode,
  'bf:MovingImage': WorkNode,
  'bf:Object': WorkNode,
  'bf:Multimedia': WorkNode,
  'bf:MixedMaterial': WorkNode,

  'bf:Instance': InstanceNode,
  // subclasses of Instances
  'bf:Print': InstanceNode,
  'bf:Manuscript': InstanceNode,
  'bf:Archival': InstanceNode,
  'bf:Tactile': InstanceNode,
  'bf:Electronic': InstanceNode,

  'bf:Item': ItemNode,
  'bf:Contribution': ContributionNode,
  'bf:Agent': AgentNode,
  'foaf:Agent': AgentNode,
  'bf:Person': PersonNode,
  'foaf:Person': PersonNode
}

export default function createNodeInterface (hr, name, type, context) {
  const props = {
    hr,
    name,
    type,
    rel: context && context.rel,
    parent: context && context.parent,
    child: context && context.child
  }
  return (FACTORY_BY_TYPE[type] || createStandardNode)(props)
}
