import { compose, createFactory } from '../utils'
import StandardBehavior from '../standard-behavior'
import AgentBehavior from '../foaf/agent-behavior'
import PersonBehavior from '../foaf/person-behavior'
import WorkBehavior from './work-behavior'
import InstanceBehavior from './instance-behavior'
import ItemBehavior from './item-behavior'
import SharedBehavior from './shared-behavior'
import WorkOrInstanceBehavior from './work-or-instance-behavior'
import WorkInstanceOrItemBehavior from './work-instance-or-item-behavior'
import ContributionBehavior from './contribution-behavior'

const commonBehaviors = compose(
  StandardBehavior,
  SharedBehavior
)

const commonBehaviorsWorkInstanceItem = compose(
  commonBehaviors,
  WorkInstanceOrItemBehavior
)

const WorkNode = createFactory(compose(
  commonBehaviorsWorkInstanceItem,
  WorkOrInstanceBehavior,
  WorkBehavior
))
const InstanceNode = createFactory(compose(
  commonBehaviorsWorkInstanceItem,
  WorkOrInstanceBehavior,
  InstanceBehavior
))
const ItemNode = createFactory(compose(
  commonBehaviorsWorkInstanceItem,
  ItemBehavior
))

const AgentNode = createFactory(compose(commonBehaviors, AgentBehavior))
const PersonNode = createFactory(compose(commonBehaviors, AgentBehavior, PersonBehavior))
const ContributionNode = createFactory(compose(commonBehaviors, ContributionBehavior))

export default {
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
