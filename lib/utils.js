const Readable = require('stream').Readable
// const jsonld = require('jsonld')

function simplifyTripleFromJSONLD (triple) {
  // TODO: fix this so that named nodes are distinguished from values
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
      if (index === array.length) {
        return this.push(null)
      }
      this.push(array[index++])
    }
  })
}

// function jsonLDToRDFStream (doc) {
//   let array = null
//   let index = 0
//   return new Readable({
//     objectMode: true,
//     read: function (size) {
//       if (array === null) {
//         jsonld.toRDF(doc)
//           .then((triples) => {
//             array = triples
//             if (index === array.length) {
//               return this.push(null)
//             }
//             this.push(simplifyTripleFromJSONLD(array[index++]))
//           }).catch((error) => {
//             this.emit('error', error)
//           })
//         return
//       }
//       if (index === array.length) {
//         return this.push(null)
//       }
//       this.push(simplifyTripleFromJSONLD(array[index++]))
//     }
//   })
// }

function spo (s, p, o) {
  return {
    subject: s,
    predicate: p,
    object: o
  }
}

function ops (o, p, s) {
  return spo(s, p, o)
}

function isRdfValue (value) {
  return (typeof value === 'string' && value.charAt(0) === '"')
}

const rdfValueMatch = /(".+")(?:\^\^(.+))?$/
function parseRdfValue (value) {
  const match = value.match(rdfValueMatch)
  if (!match) return value
  // this could be smarter getting value type as well.
  // return { value: match[1], type: match[2] }
  if (match[2] === 'xsd:decimal') {
    return parseFloat(match[1].slice(1, -1))
  }
  return JSON.parse(match[1])
}

module.exports = {
  // jsonLDToRDFStream,
  simplifyTripleFromJSONLD,
  arrayToStream,
  spo,
  ops,
  isRdfValue,
  parseRdfValue
}
