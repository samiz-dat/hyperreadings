var utils = require('../utils')
var spo = utils.spo
var ops = utils.ops

function StandardNode (hr, name, type, context) {
  this.hr = hr
  this.name = name
  this.type = type
  this.rel = context && context.rel
}

// STANDARD FUNCTIONALITY
StandardNode.prototype._castToNodeOrValue = async function (value) {
  if (utils.isRdfLiteral(value)) {
    return utils.fromRdfValue(value)
  }
  return this.hr.node(value)
}

StandardNode.prototype.get = async function (attr, value) {
  const nodes = await this.hr._get(spo(this.name, attr, value), { limit: 1 })
  if (!nodes || nodes.length === 0) return null
  return this._castToNodeOrValue(nodes[0].object)
}

StandardNode.prototype.all = async function (attr, value) {
  const triples = await this.hr._get(spo(this.name, attr, value))
  return Promise.all(triples.map(node => this._castToNodeOrValue(node.object)))
}

StandardNode.prototype.add = function (attr, value) {
  return this.set(attr, value, true)
}

StandardNode.prototype.set = async function (attr, value, allowMultiple) {
  // 1. delete all `< node name ? >` triples
  if (!allowMultiple) {
    // replace with stream
    const triples = await this.hr._get(spo(this.name, attr))
    // if object is a node this will potentially leave floating nodes.
    await Promise.all(triples.map(triple => this.hr._del(triple)))
  }
  // 2. create new key `< node name value >`
  await this.hr._put(spo(this.name, attr, utils.toRdfValue(value)))
  // 3. return node
  return this
}

StandardNode.prototype.has = async function (attr, value) {
  var nodes = await this.hr._get(spo(this.name, attr, value && utils.toRdfValue(value)), { limit: 1 })
  if (!nodes) return false
  if (nodes.length === 0) return false
  return true
}

StandardNode.prototype.remove = async function (attr, value) {
  // get the nodes
  // if this is a parent we already know that these exist so should not check.
  const triples = await this.hr._get(spo(this.name, attr, value))
  if (!triples) return this
  await Promise.all(triples.map(triple => this.hr._del(triple)))
  return this
}

/** return array of parents elements */
StandardNode.prototype.parents = async function () {
  const triples = await this.hr._get(ops(this.name))
  // all parents will be named nodes as they refer to this child node
  return Promise.all(triples.map(node => this.hr.node(
    node.subject,
    { child: this, rel: node.predicate }
  )))
}

function filterChildNodes (triple) {
  if (utils.isRdfLiteral(triple.object)) return false
  return triple.predicate && triple.predicate !== 'rdf:type'
}

/** return array of child elements */
StandardNode.prototype.children = async function () {
  const triples = await this.hr._get(spo(this.name))
  // also filter literals out - as they will note be nodes;
  const promises = triples
    .filter(filterChildNodes)
    .map(node => this.hr.node(
      node.object,
      { parent: this, rel: node.predicate }
    ))
  return Promise.all(promises)
}

StandardNode.prototype.disconnect = async function () {
  const parents = await this.parents()
  await Promise.all(parents.map(parent => parent.remove(parent.rel, this.name)))
  return this
}

module.exports = StandardNode
