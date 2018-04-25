const Transform = require('stream').Transform
var inherits = require('inherits')

function NestedStream (opts) {
  if (!opts) opts = {}
  this.maxDepth = opts.depth || Infinity
  this.depth = 0
  Transform.call(this, Object.assign(opts, { objectMode: true }))
};

inherits(NestedStream, Transform)

NestedStream.prototype._transform = function (chunk, encoding, callback) {
  const self = this
  onData(chunk)

  function onData (data) {
    self.push(data)
    // console.log(data.stream, 0 < self.maxDepth)
    if (data.stream && self.depth < self.maxDepth) {
      // console.log('added')
      self.depth += 1
      const childStream = data.stream()
      childStream.on('data', onData)
      childStream.on('end', () => {
        self.depth -= 1
        if (self.depth === 0) callback()
      })
      childStream.on('error', (error) => callback(error))
    } else if (self.depth === 0) {
      // console.log('callback')
      callback()
    }
  }
}

module.exports = NestedStream
