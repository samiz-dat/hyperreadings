var inherits = require('inherits')
var StandardNode = require('./standard-node')
var ops = require('../utils').ops

function ListItemNode (hr, name, type, ctx) {
  StandardNode.call(this, hr, name, type, ctx)
}

inherits(ListItemNode, StandardNode)

ListItemNode.prototype.previous = async function () {
  var triples = await this.hr._get(ops(this.name, 'co:nextItem'), { limit: 1 })
  if (!triples.length) triples = await this.hr._get(ops(this.name, 'co:firstItem'), { limit: 1 })
  // no need to check if value, as if this is not a named node we have bigger problems
  return triples.length ? this.hr.node(triples[0].subject) : undefined
}

ListItemNode.prototype.next = function () {
  return this.get('co:nextItem')
}

ListItemNode.prototype.itemContent = function () {
  return this.get('co:itemContent')
}

ListItemNode.prototype.remove = async function (attr, value) {
  if (attr === 'co:itemContent') {
    // stitch up list so that iteration still works
    const next = await this.next()
    const prev = await this.previous()
    const relation = prev.type === this.type ? 'co:nextItem' : 'co:firstItem'
    // set removes previous relationship
    await prev.set(relation, next)
  }
  return StandardNode.prototype.remove.call(this, attr, value)
}

module.exports = ListItemNode