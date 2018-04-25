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

function isRdfLiteral (value) {
  return (typeof value === 'string' && value.charAt(0) === '"')
}

const rdfValueMatch = /(".+")(?:\^\^(.+))?$/
function fromRdfValue (value) {
  const match = value.match(rdfValueMatch)
  if (!match) return value
  // this could be smarter getting value type as well.
  // return { value: match[1], type: match[2] }
  if (match[2] === 'xsd:decimal') {
    return parseFloat(match[1].slice(1, -1))
  }
  return JSON.parse(match[1])
}

function isNode (value) {
  return !!value.name
}

function toRdfValue (value) {
  if (isNode(value)) {
    return value.name
  } else if (typeof value === 'number') {
    return `"${value}"^^xsd:decimal`
  } else {
    return JSON.stringify(value)
  }
}

module.exports = {
  spo,
  ops,
  isRdfLiteral,
  toRdfValue,
  fromRdfValue,
  isNode
}
