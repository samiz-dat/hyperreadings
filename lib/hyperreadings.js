var events = require('events')
var fs = require('fs')
var ram = require('random-access-memory')
var hypergraph = require('hyper-graph-db')
var inherits = require('inherits')

var importers = require('./importers')
var definitions = require('./definitions')
var StandardNode = require('./definitions/standard-node')
var constants = require('./constants')
var utils = require('./utils')
var NestedStream = require('./nested-stream')

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

HyperReadings.prototype.importFile = function (filename, opts) {
  if (!filename || typeof filename !== 'string') throw new Error('HyperReadings.importFile requires filename to be a string')
  // infer import type from filename
  let type = opts && opts.type
  if (!type) {
    const match = filename.match(/\.(w+)$/)
    if ((!match || importers[match[1]])) throw new Error(`HyperReadings.import does not recognize file extension`)
    type = match[1]
  } else if (!importers[type]) {
    throw new Error(`HyperReadings.import does not recognize type ${type}`)
  }
  return new Promise((resolve, reject) => fs.readFile(filename, resolveCallback))
    .then(data => this.import(data, type))
}

HyperReadings.prototype.import = function (data, opts) {
  if (!data) return Promise.resolve()
  if (!opts || !opts.type) throw new Error('HyperReadings.import requires opts.type to be set')
  if (!importers[opts.type]) throw new Error(`HyperReadings.import does not recognize type ${opts.type}`)
  return importers[opts.type](data)
}

/** Get hyperreading root node */
HyperReadings.prototype.root = async function () {
  const triples = await this._get(ops('hr:root', 'rdf:type'), { limit: 1 })
  if (!triples.length) return null
  return this.node(triples[0])
}

/** Get all nodes by type */
HyperReadings.prototype.nodesByType = async function (type, opts) {
  // big question - how do we maintain new node names not clashing with old.
  const triples = await this._get(ops(type, 'rdf:type'))
  return Promise.all(triples.map(triple => this.node(triple)))
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

/** Create a new blank node of type */
HyperReadings.prototype.createNode = async function (type) {
  // big question - how do we maintain new node names not clashing with old.
  const name = await this._name()
  const newNodeName = name + 'n' + this._nodeCount++
  const triple = spo(newNodeName, 'rdf:type', type)
  await this._put(triple)
  // BUG triple is mutated by put, change this once fixed
  return this.node(spo(newNodeName, 'rdf:type', type))
}

/** return stream of rendered nodes */
HyperReadings.prototype.renderStream = async function () {
  const base = await this.root()
  const stream = base.stream()
  const nested = new NestedStream()
  stream.pipe(nested)
  return nested
}

/** Returns node type */
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

module.exports = HyperReadings
