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

HyperReadings.prototype.getRoot = function () {
  // return array of contained elements
}

HyperReadings.prototype.getContainer = function () {}

module.exports = {
  HyperReadings,
  loadFromMarkdown
}
