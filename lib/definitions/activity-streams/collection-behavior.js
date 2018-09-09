import { Transform } from 'stream'
import {
  makeGet,
  makeAll,
  makeSet
  // makeAdd,
  // makeRemove
} from '../helpers'
import { spo } from '../../utils'
import PageStream from './page-stream'

const CollectionBehavior = {}

CollectionBehavior.itemStream = function () {
  const stream = this.hr.graph.getStream(spo(this.name, 'as:items'))
  const cast = this._castToNodeOrValue.bind(this)
  const tripleToNode = new Transform({
    objectMode: true,
    transform (data, encoding, cb) {
      if (this.destroyed) {
        return cb(null, null)
      }
      cast(data.object)
        .then(v => cb(null, v)) // could this be an issue if itemstream is destroyed while casting is happening?
        .catch(cb)
    },
    destroy () {
      stream.destroy()
    }
  })
  return stream.pipe(tripleToNode)
}

CollectionBehavior.stream = function (opts) {
  return new PageStream(this, opts)
}

CollectionBehavior.addNewPage = async function () {
  const last = await this.lastPage()
  const page = await this.hr.createNode('as:CollectionPage', { 'as:partOf': this })
  if (last) {
    await page.setPrev(last)
    await last.setNext(page)
  } else {
    await this.setFirstPage(page)
  }
  await this.setLastPage(page)
  return page
}
// TODO: add ability to remove pages

// as:totalItems
/* A non-negative integer specifying the total number of objects contained by the logical view of the collection. This number might not reflect the actual number of items serialized within the Collection object instance. */
CollectionBehavior.totalItems = async function () {
  const total = await this.get('as:totalItems')
  if (!total) return 0
  return total
}
CollectionBehavior.incrementItemCount = async function (inc = 1) {
  const count = await this.totalItems()
  return this.set('as:totalItems', Number(count) + inc)
}

// as:current
/*
In a paged Collection, indicates the page that contains the most recently updated member items.
Range: CollectionPage | Link
*/
CollectionBehavior.currentPage = makeGet('as:current')
CollectionBehavior.setCurrentPage = makeSet('as:current')

// as:first
/*
In a paged Collection, indicates the furthest preceeding page of items in the collection.
Range: CollectionPage | Link
*/
CollectionBehavior.firstPage = makeGet('as:first')
CollectionBehavior.setFirstPage = makeSet('as:first')

// as:last
/*
In a paged Collection, indicates the furthest proceeding page of the collection.
Range: CollectionPage | Link
*/
CollectionBehavior.lastPage = makeGet('as:last')
CollectionBehavior.setLastPage = makeSet('as:last')

// as:items
/*
  Identifies the items contained in a collection. The items might be ordered or unordered.
*/
CollectionBehavior.addItem = async function (item) {
  if (this.type === 'as:CollectionPage') {
    // increment item of parent
    const parent = await this.getParentCollection()
    await parent.incrementItemCount()
    await parent.setCurrentPage(this)
  }
  await this.incrementItemCount()
  this.add('as:items', item)
}
CollectionBehavior.items = makeAll('as:items')
// TODO: add ability to remove items

export default CollectionBehavior
