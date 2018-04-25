var inherits = require('inherits')
var nanoiterator = require('nanoiterator')
var toStream = require('nanoiterator/to-stream')
var StandardNode = require('./standard-node')

function ContainerNode (hr, name, type, ctx) {
  StandardNode.call(this, hr, name, type, ctx)
}

inherits(ContainerNode, StandardNode)

ContainerNode.prototype.firstItem = function () {
  // console.log('first')
  return this.get('co:firstItem')
}

ContainerNode.prototype.itemContent = function () {
  return this.get('co:itemContent')
}

ContainerNode.prototype.next = function () {
  return this.get('co:nextItem')
}

ContainerNode.prototype.stream = function (opts) {
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
  return toStream(iterator)
}

ContainerNode.prototype.iterate = async function (fn, opts) {
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

ContainerNode.prototype.lastItem = async function () {
  // first check if a last item is explicitly set
  var last = await this.get('co:lastItem')
  if (last) return last
  // else iterate over next items until there are none left
  await this.iterate((node) => { last = node }, { listItems: true })
  return last
}

ContainerNode.prototype.insertNode = async function (node, index) {
  // validate newNode
  // 1. inserts`< node co:contains newNode >`
  await this.add('po:contains', node.name)

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

ContainerNode.prototype.removeNode = async function (node) {
  // 1. find node or node at index

  // 2. get nodeToDeletes nextItem
  // 3. delete key `< node po:contains nodeToDelete >`
  // 4. file all references `< ? co:nextItem nodeToDelete >`
  // 5. update all to `< ? co:nextItem nextItemOfNoteToDelete >`
  // 6. if `< node co:firstItem nodeToDelete >` exist
  //    update it to `< node co:firstItem nextItemOfNoteToDelete >`
}

module.exports = ContainerNode
