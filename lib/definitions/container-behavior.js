import nanoiterator from 'nanoiterator'
import toStream from 'nanoiterator/to-stream'

// TODO: add smart caching to avoid a lot of unnecessary iteration

const ContainerBehavior = {}

ContainerBehavior.firstItem = function () {
  return this.get('co:firstItem')
}

ContainerBehavior.itemContent = function () {
  return this.get('co:itemContent')
}

ContainerBehavior.contains = function () {
  return this.all('po:contains')
}

ContainerBehavior.next = function () {
  return this.get('co:nextItem')
}

ContainerBehavior.iterator = function (opts) {
  var next = null
  var returnContent = !(opts && opts.listItems)
  var iterator = nanoiterator({
    next: (cb) => {
      var promised = (!next) ? this.firstItem() : next.next()
      promised
        .then(node => {
          next = node
          return returnContent ? next && next.itemContent() : next
        })
        .then(node => cb(null, node))
        .catch(cb)
    }
  })
  return iterator
}

ContainerBehavior.stream = function (opts) {
  return toStream(this.iterator(opts))
}

ContainerBehavior.iterate = async function (fn, opts) {
  // this could be replace with stream as so, but is much slower
  // return new Promise((resolve, reject) => {
  //   const stream = this.stream(opts)
  //   stream.on('data', fn)
  //   stream.on('end', resolve)
  //   stream.on('error', reject)
  // })
  var next = await this.firstItem()
  while (next) {
    // these should probably be called in parallel to speed things up
    if (fn) {
      if (opts && opts.listItems) {
        await fn(next)
      } else {
        var contents = await next.itemContent()
        await fn(contents)
      }
    }
    next = await next.next()
  }
}

ContainerBehavior.lastItem = async function () {
  // first check if a last item is explicitly set
  var last = await this.get('co:lastItem')
  if (last) return last
  // else iterate over next items until there are none left
  await this.iterate((node) => { last = node }, { listItems: true })
  return last
}

/* TODO: implement index insertion */
ContainerBehavior.insertNode = async function (node, index) {
  // validate newNode
  // 1. inserts`< node co:contains newNode >`
  await this.add('po:contains', node)
  // 2. make newItem `< newItem co:hasContent newNode >`
  var newItem = await this.hr.createNode('co:ListItem')
  await newItem.set('co:itemContent', node)
  // 3. if `< node co:firstItem ? >` does not exist, insert`< node co:firstItem newItem >`
  var alreadyHasFirst = await this.has('co:firstItem')
  // console.log('alreadyHasFirst', alreadyHasFirst)
  if (!alreadyHasFirst) {
    await this.set('co:firstItem', newItem)
  } else {
  // else find lastItem of node, or not at index-1, and  insert `<lastItemNode co:nextItem > newItem >`
    var lastItem = await this.lastItem()
    // console.log('lastItem', lastItem && lastItem.name)
    if (lastItem) {
      await lastItem.set('co:nextItem', newItem)
    }
  }
  // 4. return existing node
  return this
}

ContainerBehavior.updateList = async function (nodeIds) {
  // this is one of many possible implementations.
  // it could be smarter - determine programmatically whether
  // procedurally updating itemContent is more effective
  // than adjusting co:firstItem and co:nextItem pointers.
  // This probably would have to factor in if the nodeIds are new
  // or if they are just a reordering of existing content.
  let count = 0
  // 1. iterate over existing list
  // TODO: allow the iterator to stop early
  await this.iterate(async (child) => {
    // 1.2 check if current child is within range of array
    // 1.2.1 remove all nodes that are greater than nodeIds length
    if (count > nodeIds.length) return
    if (count === nodeIds.length) {
      // destroying this list node cascades down all the remaining nodes in the list
      // and in effect deletes all remaining nodes and their content.
      // We add this.name to .destroy's ignore list, so that the connection to
      // this.name -> po:contains does not prevent the removal of itemContent.
      await child.parent.destroy([this.name])
      count += 1
      return
    }
    const newNodeName = nodeIds[count]
    // 1.3 check if content is the same
    // if so do nothing
    if (child.name === newNodeName) {
      count += 1
      return
    }
    // if not then we want to update content pointer
    await child.parent.setContent({ name: newNodeName })
    // and remove the current node from container
    if (!nodeIds.includes(child.name)) {
      await this.remove('po:contains', child)
    }
    await this.add('po:contains', { name: newNodeName })
    count += 1
  })
  // 2. insert remaining nodes
  while (count < nodeIds.length) {
    await this.insertNode({ name: nodeIds[count] })
    count += 1
  }
}

ContainerBehavior.at = async function (index, opts) {
  let count = 0
  const iterator = this.iterator(opts)
  return new Promise((resolve, reject) => {
    iterator.next(onNext)
    function onNext (err, val) {
      if (err) {
        iterator.destroy()
        return reject(err)
      }
      if (val === null || count > index) {
        iterator.destroy()
        return resolve(null)
      }
      if (count === index) {
        iterator.destroy(() => resolve(val))
      }
      count++
      iterator.next(onNext)
    }
  })
}

ContainerBehavior.removeNodeAt = async function (index) {
  // const node = await this.at(index, { listItems: true })
  const node = await this.at(index)
  if (!node) return
  return node.destroy()
}

ContainerBehavior.removeNodesFrom = async function (index) {
  const node = await this.at(index, { listItems: true })
  if (!node) return
  return node.destroy()
}

ContainerBehavior.removeNode = async function (node) {
  // 1. find node or node at index
  // 2. get nodeToDeletes nextItem
  // 3. delete key `< node po:contains nodeToDelete >`
  // 4. file all references `< ? co:nextItem nodeToDelete >`
  // 5. update all to `< ? co:nextItem nextItemOfNoteToDelete >`
  // 6. if `< node co:firstItem nodeToDelete >` exist
  //    update it to `< node co:firstItem nextItemOfNoteToDelete >`
}

export default ContainerBehavior
