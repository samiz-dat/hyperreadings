const Readable = require('stream').Readable
var inherits = require('inherits')

function RenderStream (hr, opts) {
  if (!opts) opts = {}
  Readable.call(this, Object.assign(opts, { objectMode: true }))
  this.ready = false
  // set root before starting
  hr.root().then((node) => {
    this.root = node
    this.ready = true
  }).catch(error => this.emit('error', error))
};

inherits(RenderStream, Readable)

RenderStream.prototype._read = function (size) {
  if (this.ready) {

  }
}

module.exports = RenderStream
