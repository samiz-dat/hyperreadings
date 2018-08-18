import { compose, createFactory } from '../utils'
import StandardBehavior from '../standard-behavior'
import ObjectBehavior from './object-behavior'
import CollectionBehavior from './collection-behavior'
import CollectionPageBehavior from './collection-page-behavior'

const ComposedObjectBehavior = compose(StandardBehavior, ObjectBehavior)
const ComposedCollectionBehavior = compose(ComposedObjectBehavior, CollectionBehavior)

const createObjectNode = createFactory(ComposedObjectBehavior)
const createCollectionNode = createFactory(ComposedCollectionBehavior)
const createCollectionPageNode = createFactory(compose(ComposedCollectionBehavior, CollectionPageBehavior))

export default {
  'as:Object': createObjectNode,
  'as:Collection': createCollectionNode,
  'as:CollectionPage': createCollectionPageNode,
  'as:OrderedCollection': createCollectionNode,
  'as:OrderedCollectionPage': createCollectionPageNode
}
