var events = require('events')
var ram = require('random-access-memory')
var hypergraph = require('hyper-graph-db')
var inherits = require('inherits')

// var markdown = require('./markdown-to-triples')
var definitions = require('./definitions')
var StandardNode = require('./definitions/standard-node')
var constants = require('./constants')
var utils = require('./utils')

function resolveCallback (resolve, reject) {
  return function (err, result) {
    if (err) return reject(err)
    resolve(result)
  }
}

// function loadFromMarkdown (md, opts, callback) {
//   const readings = new HyperReadings(opts)
//   const input = markdown.toStream(md)
//   const put = readings.graph.putStream()
//   input.pipe(put)
//   input.on('error', callback)
//   put.on('finish', () => {
//     setTimeout(() => { callback(null, readings) }, 1)
//   })
// }

function HyperReadings (opts) {
  if (!(this instanceof HyperReadings)) return new HyperReadings(opts)
  events.EventEmitter.call(this)
  opts = opts || {}
  if (!opts.prefixes) opts.prefixes = constants.PREFIXES
  if (!opts.name) opts.name = 'hr://'
  this.graph = hypergraph(() => ram(), opts)
  this.graph.on('ready', (e) => {
    this.emit('ready', e)
  })
}

inherits(HyperReadings, events.EventEmitter)

HyperReadings.prototype.root = function (subject) {
  return new Promise((resolve, reject) => {
    this.graph.get({ predicate: 'rdf:type', object: 'hr:root' }, resolveCallback(resolve, reject))
  })
    .then(results => results.length ? results[0].subject : null)
}

/** returns node type */
HyperReadings.prototype.nodeType = function (subject) {
  return new Promise((resolve, reject) => {
    this.graph.get(utils.spo(subject, 'rdf:type'), resolveCallback(resolve, reject))
  })
    .then(triples => triples.length && triples[0].object)
}

HyperReadings.prototype.node = async function (namedNode) {
  if (typeof namedNode === 'string') {
    var type = await this.nodeType(namedNode)
  }
  const definition = definitions[type]
  console.log(definition)
  if (definition) return new definition.Class(this, namedNode, type, definition)
  return new StandardNode(this, namedNode, type)
}

var nodeCount = 0

HyperReadings.prototype.createNode = function (type) {
  return new Promise((resolve, reject) => {
    // big question - how do we maintain new node names not clashing with old.
    var newNodeName = '_:n' + nodeCount++
    this.graph.put(utils.spo(newNodeName, 'rdf:type', type), (err) => {
      if (err) return reject(err)
      // potentially add properties to newly created node
      resolve(this.node({ newNodeName, type }))
    })
  })
}

// HyperReadings.prototype.contents = function (node, fn) {
//   const self = this
//   return this.getFirst(node)
//     .then(iterate)

//   function iterate (res) {
//     if (!res) return null
//     const data = {
//       id: res['?next'] || res['?first'],
//       type: res['?type'],
//       value: res['?value']
//     }
//     return Promise.resolve(fn && fn(data))
//       .then(() => self.getNext(data.id))
//       .then(iterate)
//   }
// }

HyperReadings.prototype.get = function (node) {
  // constructs object out of triples
  const stream = this.graph.getStream({ subject: node })
  let object = null
  return new Promise((resolve, reject) => {
    stream.on('data', (triple) => {
      if (!object) object = {}
      if (object[triple.predicate] === undefined) {
        object[triple.predicate] = [ triple.object ]
      } else {
        object[triple.predicate].push(triple.object)
      }
    })
    stream.on('end', () => {
      resolve(object)
    })
    stream.on('error', reject)
  })
}

// HyperReadings.prototype.getFirst = function (node) {
//   if (!node) {
//     // get document root
//     node = 'hr:root'
//   }
//   return new Promise((resolve, reject) => {
//     // console.time('getFirst')
//     this.graph.query(`
//       SELECT * WHERE {
//         <${node}> <http://www.essepuntato.it/2008/12/pattern#contains> ?items;
//         <http://purl.org/co/firstItem> ?first.
//         OPTIONAL { ?first <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type }
//         OPTIONAL { ?first <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?value }
//       } LIMIT 1`, (err, results) => {
//       // console.timeEnd('getFirst')
//       if (err) return reject(err)
//       resolve(results.length > 0 ? results[0] : null)
//     })
//   })
//   // return ordered array of contained elements
// }

// HyperReadings.prototype.getNext = function (node) {
//   if (!node) {
//     // get document root
//     node = 'hr:root'
//   }
//   // console.log('get node', node)
//   return new Promise((resolve, reject) => {
//     // console.time('getNext')
//     this.graph.query(`SELECT * WHERE {
//         <${node}> <http://purl.org/co/nextItem> ?next.
//         OPTIONAL { ?next <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type }
//         OPTIONAL { ?next <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?value }
//     } LIMIT 1`, (err, results) => {
//       // console.timeEnd('getNext')
//       if (err) return reject(err)
//       resolve(results.length > 0 ? results[0] : null)
//     })
//   })
//   // return ordered array of contained elements
// }

HyperReadings.prototype.getContainer = function () {}

module.exports = {
  HyperReadings
  // loadFromMarkdown
}
