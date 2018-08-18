import {
  makeGet,
  makeSet,
  makeRemove
} from '../helpers'

const CollectionPageBehavior = {}

// as:partOf
/* Identifies the Collection to which a CollectionPage objects items belong. */
CollectionPageBehavior.getParentCollection = makeGet('as:partOf')
// as:next
/* In a paged Collection, indicates the next page of items. */
CollectionPageBehavior.next = makeGet('as:next')
CollectionPageBehavior.setNext = makeSet('as:next')

// as:prev
/* In a paged Collection, identifies the previous page of items. */
CollectionPageBehavior.prev = makeGet('as:prev')
CollectionPageBehavior.setPrev = makeSet('as:prev')

// TODO: potentially override adding items to automatically increment the parent collections totalItems

export default CollectionPageBehavior
