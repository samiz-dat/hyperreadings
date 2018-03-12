const marked = require('marked')
const parse5 = require('parse5')
const arrayToTree = require('./array-to-tree')

var defaultContext = {
  // prefixes
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  co: 'http://purl.org/co/',
  po: 'http://www.essepuntato.it/2008/12/pattern#',
  doco: 'http://purl.org/spar/doco/',
  cito: 'http://purl.org/spar/cito/',
  // shortcuts
  a: '@type',
  value: 'rdf:value',
  contains: 'po:contains',
  nextItem: 'co:nextItem',
  firstItem: 'co:firstItem',
  itemContent: 'co:itemContent'
}

var blankNodeCount = 0

function createTypeDescribeStatement (type) {
  return (context, node) => {
    if (!context) context = {}
    context.a = type
    return context
  }
}

var describeParagraph = createTypeDescribeStatement('doco:Paragraph')
var describeTitle = createTypeDescribeStatement('doco:Title')
var describeSection = createTypeDescribeStatement('doco:Section')
var describeInlineElement = createTypeDescribeStatement('po:Inline')

function describeLink (context, node) {
  if (!context) context = {}
  context.a = 'po:Inline'
  const href = node.attrs.find(attr => attr.name === 'href')
  if (!href) return
  const identifer = {}
  identifer.a = 'datacite:AlternateResourceIdentifier'
  identifer['cito:usesIdentifierScheme'] = 'datacite:url'
  identifer.value = href.value
  context['cito:hasIdentifier'] = identifer
  return context
}

function describeText (context, node) {
  if (!context) context = {}
  context.a = 'doco:TextChunk'
  context.value = node.value
  return context
}

function isEmptyNode (node) {
  return !node.childNodes && node.value && /^\s*$/.test(node.value)
}

function newBlankNodeId () {
  return `_:n_${blankNodeCount++}`
}

// TYPES
var htmlNodeMappings = {
  'section': describeSection,
  'p': describeParagraph,
  'h1': describeTitle,
  'h2': describeTitle,
  'h3': describeTitle,
  'h4': describeTitle,
  'h5': describeTitle,
  'h6': describeTitle,
  '#text': describeText,
  'em': describeInlineElement,
  'i': describeInlineElement,
  'strong': describeInlineElement,
  'b': describeInlineElement,
  'a': describeLink
}
var defaultMapping = function (context, node) {
  if (!context) context = {}
  // make this inherited from parent / inline or block
  context.a = 'po:block'
  return context
}

const headerRegex = /^h(\d+)$/
const headingSplitter = (value) => {
  const match = value.nodeName.match(headerRegex)
  return match && match[1]
}

const sectionTransform = (array) => ({
  nodeName: 'section',
  tagName: 'section',
  childNodes: array,
  inferred: true
})

function addInferedSections (nodes) {
  return arrayToTree(nodes, headingSplitter, sectionTransform)
}

function parse (text) {
  blankNodeCount = 0
  const graph = {
    '@context': defaultContext,
    '@graph': []
  }
  const html = marked(text)
  const doc = parse5.parse(html)
  var stack = []
  graph['@graph'].push(walk({}, doc.childNodes[0]))
  while (stack.length) {
    var data = stack.shift()
    graph['@graph'].push(walk(data.context, data.node))
  }

  console.log(JSON.stringify(graph, null, 2))
  return graph
  function processSequence (context, nodes) {
    // prepopulate this node with the expected content
    const filteredNodes = nodes
      .filter(node => !isEmptyNode(node))
    const contains = filteredNodes
      .map(() => ({ '@id': newBlankNodeId() }))
    if (!contains.length) return []
    context.contains = contains
    context.firstItem = context.contains[0]
    // return context for next nodes
    return filteredNodes.map((node, i) => {
      var nextId = (i < context.contains.length - 1) ? context.contains[i + 1] : undefined
      return {
        node,
        context: {
          '@id': context.contains[i]['@id'],
          nextId
        }
      }
    })
  }

  function walk (context, node) {
    if (isEmptyNode(node)) {
      return
    }
    // process individual node
    if (!context['@id']) context['@id'] = newBlankNodeId()
    var map = htmlNodeMappings[node.nodeName] || defaultMapping
    // add all children to the queue to be processed next
    context = map(context, node)
    if (node.childNodes && node.childNodes.length > 0) {
      if (!node.inferred) node.childNodes = addInferedSections(node.childNodes)
      const next = processSequence(context, node.childNodes)
      next.forEach((data) => {
        stack.push(data)
      })
    }
    return context
  }
}

module.exports = {
  parse: parse
}
