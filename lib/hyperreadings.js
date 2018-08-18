import events from 'events'
import fs from 'fs'
import hypergraph from 'hyper-graph-db'
import inherits from 'inherits'
import uuid from 'uuid/v4'

import importers from './importers/index'
import createNodeInterface from './definitions/index'
import { PREFIXES } from './constants'
import { spo, ops, toRdfValue } from './utils'

function resolveCallback (resolve, reject) {
  return function (err, result) {
    if (err) return reject(err)
    resolve(result)
  }
}

function HyperReadings (storage, key, opts) {
  if (!(this instanceof HyperReadings)) return new HyperReadings(storage, key, opts)
  if (typeof key !== 'string' && !opts) {
    opts = key
    key = null
  }
  events.EventEmitter.call(this)
  opts = opts || {}
  if (!opts.prefixes) opts.prefixes = PREFIXES
  if (!opts.name) opts.name = 'hr://'
  this.swarm = opts.swarm
  this.network = null
  this._nodeCount = 0
  this.graph = hypergraph(storage, key, opts)
  this.graph.on('ready', (e) => {
    this.emit('ready', e)
  })
}

inherits(HyperReadings, events.EventEmitter)

/** Get underlying hyperdb key */
HyperReadings.prototype.key = function () {
  return this.graph.db.key.toString('hex')
}

HyperReadings.prototype.joinNetwork = function (opts) {
  if (!this.swarm) {
    console.warn('Cannot join network - no swarm set.')
    return
  }
  if (this.network) {
    console.warn('Already joined network')
    return this.network
  }
  this.network = this.swarm(this.graph.db, opts)
  return this.network
}

HyperReadings.prototype.leaveNetwork = async function () {
  if (!this.network) return
  return new Promise((resolve, reject) => {
    this.network.leave(this.graph.db.discoveryKey)
    this.network.destroy(resolveCallback(resolve, reject))
  }).then(() => { this.network = null })
}

HyperReadings.prototype.importZoteroReference = function (data) {
  return this.import(data, { type: 'zoteroApi' })
}

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
  return importers[opts.type](this, data)
}

HyperReadings.prototype.setTitle = function (title) {
  if (!title || typeof title !== 'string') throw new Error('Title must be a string')
  return new Promise((resolve, reject) => this.graph.db.put('@title', title, (e) => {
    if (e) return reject(e)
    resolve()
  }))
}

HyperReadings.prototype.title = function () {
  return new Promise((resolve, reject) => this.graph.db.get('@title', (e, nodes) => {
    if (e) return reject(e)
    resolve(nodes)
  })).then((nodes) => {
    if (!nodes || nodes.length === 0) {
      return 'untitled'
    }
    return nodes[0].value.toString()
  })
}

/** Get hyperreading root node */
HyperReadings.prototype.root = async function () {
  return this.nodeByType('hr:root')
}

HyperReadings.prototype.head = async function () {
  return this.nodeByType('hr:head')
}

HyperReadings.prototype.body = async function () {
  return this.nodeByType('hr:body')
}

HyperReadings.prototype.iterate = async function (...args) {
  const r = await this.root()
  return r.iterate(...args)
}

HyperReadings.prototype.createCollection = async function (name, description) {
  // TODO: check if collection with name already exists
  return this.createNode('as:Collection', { 'as:name': name, 'as:content': description })
}

HyperReadings.prototype.collections = async function () {
  return this.nodesByType('as:Collection')
}

HyperReadings.prototype.getCollection = async function (name) {
  const v = this.graph.v
  const query = [ spo(v('id'), 'rdf:type', 'as:Collection') ]
  if (name) query.push(spo(v('id'), 'as:name', toRdfValue(name)))
  const collections = await this._search(query, { limit: 1 })
  if (collections.length === 0) return null
  return this.node({ name: collections[0].id, type: 'as:Collection' })
}

HyperReadings.prototype.exists = async function (id, type) {
  const node = await this._get(spo(id, type ? 'rdf:type' : undefined, type), { limit: 1 })
  return !!(node && node.length > 0)
}

HyperReadings.prototype.findPeople = async function (opts) {
  const v = this.graph.v
  const query = [ spo(v('id'), 'rdf:type', 'bf:Person') ]
  if (opts && opts.name) query.push(spo(v('id'), 'foaf:name', toRdfValue(opts.name)))
  if (opts && opts.firstName) query.push(spo(v('id'), 'foaf:firstName', toRdfValue(opts.firstName)))
  if (opts && opts.lastName) query.push(spo(v('id'), 'foaf:lastName', toRdfValue(opts.lastName)))
  const people = await this._search(query)
  return Promise.all(people.map(p => this.node({ name: p.id, type: 'bf:Person' })))
}

HyperReadings.prototype.findAgents = async function (opts) {
  const v = this.graph.v
  const query = [ spo(v('id'), 'rdf:type', 'bf:Agent') ]
  if (opts && opts.label) query.push(spo(v('id'), 'rdfs:label', opts.label))
  const agents = await this._search(query)
  return Promise.all(agents.map(p => this.node({ name: p.id, type: 'bf:Agent' })))
}

HyperReadings.prototype.findPlaces = async function (opts) {
  const v = this.graph.v
  const query = [ spo(v('id'), 'rdf:type', 'bf:Place') ]
  if (opts && opts.label) query.push(spo(v('id'), 'rdfs:label', opts.label))
  const places = await this._search(query)
  return Promise.all(places.map(p => this.node({ name: p.id, type: 'bf:Place' })))
}

/** Get all nodes by type */
HyperReadings.prototype.nodesByType = async function (type, opts) {
  // big question - how do we maintain new node names not clashing with old.
  const triples = await this._get(ops(type, 'rdf:type'), opts)
  return Promise.all(triples.map(triple => this.node(triple)))
}

/** Get all nodes by type */
HyperReadings.prototype.nodeByType = async function (type, opts) {
  // big question - how do we maintain new node names not clashing with old.
  const nodes = await this.nodesByType(type, { limit: 1 })
  return nodes.length > 0 ? nodes[0] : null
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
  return createNodeInterface(this, name, type, context)
}

/** Create a new blank node of type */
HyperReadings.prototype.createNode = async function (type, properties) {
  if (!type) {
    throw new Error('Cannot create a node without type')
  }
  let nodeId = properties && properties.id
  if (!nodeId) {
    // big question - how do we maintain new node names not clashing with old.
    // const name = await this._name()
    nodeId = await this.newBlankNodeName()
  }
  const triple = spo(nodeId, 'rdf:type', type)
  await this._put(triple)
  // BUG triple is mutated by put, change this once fixed
  const node = await this.node(spo(nodeId, 'rdf:type', type))
  if (properties) {
    // TODO: enable arrays to be added too.
    await Promise.all(Object.keys(properties).map((key) => {
      if (key === 'id' || typeof properties[key] === 'undefined') return
      return node.set(key, properties[key])
    }))
  }
  return node
}

HyperReadings.prototype.newBlankNodeName = async function () {
  const name = await this._name()
  // should probably use hashes so as to avoid collisions
  return name + 'n' + uuid()
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

HyperReadings.prototype._search = function (patterns, opts) {
  return new Promise((resolve, reject) => this.graph.search(patterns, opts, resolveCallback(resolve, reject)))
}

export default HyperReadings
