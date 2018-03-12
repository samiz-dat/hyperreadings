const Readable = require('stream').Readable

function simplifyTripleFromJSONLD (triple) {
  if (triple.subject.value) {
    triple.subject = triple.subject.value
  }
  if (triple.predicate.value) {
    triple.predicate = triple.predicate.value
  }
  if (triple.object.value) {
    triple.object = triple.object.value
  }
  delete triple.graph
  return triple
}

function arrayToStream (array) {
  if (!array || !Array.isArray(array)) throw new Error('arrayToStream expects array as first argument')
  var index = 0
  return new Readable({
    objectMode: true,
    read: function (size) {
      setTimeout(() => {
        if (index === array.length) {
          return this.push(null)
        }
        this.push(array[index++])
        // while (index < array.length && this.push(array[index++])) {}
      }, 10)
    }
  })
}

module.exports = {
  simplifyTripleFromJSONLD,
  arrayToStream
}
