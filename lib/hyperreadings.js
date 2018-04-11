var events = require('events')
var ram = require('random-access-memory')
var hypergraph = require('hyper-graph-db')
var inherits = require('inherits')

var definitions = require('./definitions')
var StandardNode = require('./definitions/standard-node')
var constants = require('./constants')
var utils = require('./utils')
var spo = utils.spo
var ops = utils.ops

function resolveCallback (resolve, reject) {
  return function (err, result) {
    if (err) return reject(err)
    resolve(result)
  }
}

function HyperReadings (opts) {
  if (!(this instanceof HyperReadings)) return new HyperReadings(opts)
  events.EventEmitter.call(this)
  opts = opts || {}
  if (!opts.prefixes) opts.prefixes = constants.PREFIXES
  if (!opts.name) opts.name = 'hr://'
  this._nodeCount = 0
  this.graph = hypergraph(() => ram(), opts)
  this.graph.on('ready', (e) => {
    this.emit('ready', e)
  })
}

inherits(HyperReadings, events.EventEmitter)

HyperReadings.prototype.root = async function () {
  const triples = await this._get(ops('hr:root', 'rdf:type'), { limit: 1 })
  if (!triples.length) return null
  return this.node(triples[0])
}

/** Cast to specific node type */
HyperReadings.prototype.node = async function (data, context) {
  let name
  let type
  if (typeof data === 'string') { // from named node
    name = data
  } else if (data.subject) { // from triple
    name = data.subject
    if (data.predicate === 'rdf:type' && data.object) type = data.object
  } else if (data.name) { // from other node like object
    name = data.name
    type = data.type
  }
  if (!type) {
    type = await this._getType(name)
  }
  const definition = definitions[type]
  if (definition) return new definition.Class(this, name, type, context)
  return new StandardNode(this, name, type, context)
}

HyperReadings.prototype.createNode = async function (type) {
  // big question - how do we maintain new node names not clashing with old.
  const name = await this._name()
  var newNodeName = name + 'n' + this._nodeCount++
  var triple = spo(newNodeName, 'rdf:type', type)
  await this._put(triple)
  // BUG triple is mutated by put, change this once fixed
  return this.node(spo(newNodeName, 'rdf:type', type))
}

/** returns node type */
HyperReadings.prototype._getType = async function (subject) {
  var triples = await this._get(spo(subject, 'rdf:type'), { limit: 1 })
  return triples.length ? triples[0].object : undefined
}

HyperReadings.prototype._name = function (triple, opts) {
  return new Promise((resolve, reject) => this.graph.name(resolveCallback(resolve, reject)))
}

HyperReadings.prototype._get = function (triple, opts) {
  return new Promise((resolve, reject) => this.graph.get(triple, opts, resolveCallback(resolve, reject)))
}

HyperReadings.prototype._put = function (triple) {
  return new Promise((resolve, reject) => this.graph.put(triple, resolveCallback(resolve, reject)))
}

HyperReadings.prototype._del = function (triple) {
  return new Promise((resolve, reject) => this.graph.del(triple, resolveCallback(resolve, reject)))
}

module.exports = {
  HyperReadings
  // loadFromMarkdown
}
