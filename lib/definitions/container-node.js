var inherits = require('inherits')
var StandardNode = require('./standard-node')

function ContainerNode (hr, name, type) {
  StandardNode.call(this, hr, name, type)
}

inherits(ContainerNode, StandardNode)

ContainerNode.prototype.firstItem = function () {
  // console.log('first')
  return this.get('po:firstItem')
}

ContainerNode.prototype.itemContent = function () {
  return this.get('co:itemContent')
}

ContainerNode.prototype.next = function () {
  return this.get('po:nextItem')
}

ContainerNode.prototype.iterate = async function (fn, opts) {
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
  var last = await this.get('po:lastItem')
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
  var newItem = await this.hr.createNode('co:listItem')
  await newItem.set('co:itemContent', node.name)

  // 3. if `< node po:firstItem ? >` does not exist, insert`< node po:firstItem newItem >`
  var alreadyHasFirst = await this.has('po:firstItem')
  // console.log('alreadyHasFirst', alreadyHasFirst)
  if (!alreadyHasFirst) {
    await this.set('po:firstItem', newItem.name)
  } else {
  // else find lastItem of node, or not at index-1, and  insert `<lastItemNode po:nextItem > newItem >`
    var lastItem = await this.lastItem()
    // console.log('lastItem', lastItem && lastItem.name)
    if (lastItem) {
      await lastItem.set('po:nextItem', newItem.name)
    }
  }

  // 4. return existing node
  return this
}

module.exports = ContainerNode
