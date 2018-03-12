var ram = require('random-access-memory')
var hypergraph = require('hyper-graph-db')
var markdown = require('./markdown-to-triples')

function loadFromMarkdown (md, opts, callback) {
  const readings = new HyperReadings(opts)
  const input = markdown.toStream(md)
  const put = readings.graph.putStream()
  input.pipe(put)
  input.on('error', callback)
  put.on('finish', () => {
    setTimeout(() => { callback(null, readings) }, 1)
  })
}

function HyperReadings (opts) {
  if (!(this instanceof HyperReadings)) return new HyperReadings(opts)
  this.graph = hypergraph(() => ram(), opts)
}

HyperReadings.prototype.getFirst = function (container) {
  if (!container) {
    // get document root
    container = 'hr:root'
  }
  return new Promise((resolve, reject) => {
    console.time('getFirst')
    this.graph.query(`
      SELECT * WHERE {
        <${container}> <http://www.essepuntato.it/2008/12/pattern#contains> ?items;
        <http://purl.org/co/firstItem> ?first.
        OPTIONAL { ?first <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type }
        OPTIONAL { ?first <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?value }
        OPTIONAL { ?first <http://purl.org/co/itemContent> ?content }
      } LIMIT 1`, (err, results) => {
      console.timeEnd('getFirst')
      if (err) return reject(err)
      resolve(results.length > 0 ? results[0] : null)
    })
  })
  // return ordered array of contained elements
}

HyperReadings.prototype.getNext = function (container) {
  if (!container) {
    // get document root
    container = 'hr:root'
  }
  console.log('get container', container)
  return new Promise((resolve, reject) => {
    console.time('getNext')
    this.graph.query(`SELECT * WHERE {
        <${container}> <http://purl.org/co/nextItem> ?next.
        OPTIONAL { ?next <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type }
        OPTIONAL { ?next <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?value }
        OPTIONAL { ?next <http://purl.org/co/itemContent> ?content }
    } LIMIT 1`, (err, results) => {
      console.timeEnd('getNext')
      if (err) return reject(err)
      resolve(results.length > 0 ? results[0] : null)
    })
  })
  // return ordered array of contained elements
}

HyperReadings.prototype.getContainer = function () {}

module.exports = {
  HyperReadings,
  loadFromMarkdown
}
