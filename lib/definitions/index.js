import { compose, createFactory } from './utils'
import activityStreamFactories from './activity-streams'
import bibframeFactories from './bibframe'
import StandardBehavior from './standard-behavior'
import ContainerBehavior from './container-behavior'
import ListItemBehavior from './list-item-behavior'

const createStandardNode = createFactory(StandardBehavior)
const createContainerNode = createFactory(compose(StandardBehavior, ContainerBehavior))
const createListItemNode = createFactory(compose(StandardBehavior, ListItemBehavior))

const FACTORY_BY_TYPE = Object.assign(
  {
    // basic types for hyper-reader document
    // TODO: move away from storing documents in the db
    // in future we should use store files, and db should be
    // just bibliographic, annotations, and relationship data
    'hr:root': createContainerNode,
    'hr:head': createContainerNode,
    'hr:body': createContainerNode,
    'doco:List': createContainerNode,
    'doco:Section': createContainerNode,
    'doco:Paragraph': createContainerNode,
    'doco:Title': createContainerNode,
    'po:Block': createContainerNode,
    'po:Inline': createContainerNode,
    'co:ListItem': createListItemNode
  },
  bibframeFactories,
  activityStreamFactories
)

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
