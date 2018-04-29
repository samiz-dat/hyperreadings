import parse5 from 'parse5'
import arrayToTree from '../array-to-tree'

function createTypeDescribeStatement (type) {
  return async (hr, node) => {
    return hr.createNode(type)
  }
}

function getAttr (node, name) {
  if (!node || !node.attrs) return undefined
  const attr = node.attrs.find(attr => attr.name === name)
  return attr && attr.value
}

var describeParagraph = createTypeDescribeStatement('doco:Paragraph')
var describeTitle = createTypeDescribeStatement('doco:Title')
var describeSection = createTypeDescribeStatement('doco:Section')
var describeInlineElement = createTypeDescribeStatement('po:Inline')
var describeHTML = createTypeDescribeStatement('hr:root')

async function describeLink (hr, node) {
  const href = getAttr(node, 'href')
  if (!href) return
  const identifer = await hr.createNode('datacite:AlternateResourceIdentifier')
  await identifer.set('cito:usesIdentifierScheme', 'datacite:url')
  await identifer.set('rdf:value', href.value)
  const linkNode = await hr.createNode('po:Inline')
  await linkNode.set('cito:hasIdentifier', identifer)
  return linkNode
}

async function describeText (hr, node) {
  const text = await hr.createNode('doco:TextChunk')
  await text.set('rdf:value', node.value)
  return text
}

async function describeSpan (hr, node) {
  switch (getAttr(node, 'data-type')) {
    case 'comment': {
      const text = getAttr(node, 'data-comment')
      const comment = await hr.createNode('fabio:Comment')
      await comment.set('c4o:hasContent', text)
      return comment
    }
    default: {
      return hr.createNode('po:Inline')
    }
  }
}

function isEmptyNode (node) {
  return !node.childNodes && node.value && /^\s*$/.test(node.value)
}

// TYPES
var htmlNodeMappings = {
  'html': describeHTML,
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
  'a': describeLink,
  'span': describeSpan
}
var defaultMapping = function (hr, node) {
  // make this inherited from parent / inline or block
  return hr.createNode('po:Block')
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

function addInferredSections (nodes) {
  return arrayToTree(nodes, headingSplitter, sectionTransform)
}

export default async function htmlImporter (hr, html) {
  var doc = parse5.parse(html)
  var stack = []
  await walk(doc.childNodes[0])
  while (stack.length) {
    var data = stack.shift()
    await walk(data.node, data.context)
  }
  return hr
  // end
  function nextNodes (parent, nodes) {
    // prepopulate this node with the expected content
    const filteredNodes = nodes
      .filter(node => !isEmptyNode(node))
    if (!filteredNodes.length) return []
    // return context for next nodes
    return filteredNodes.map((node, i) => {
      return {
        node,
        context: { parent }
      }
    })
  }
  async function walk (node, context) {
    if (isEmptyNode(node)) {
      return
    }
    // process individual node
    var mapper = htmlNodeMappings[node.nodeName] || defaultMapping
    // add all children to the queue to be processed next
    var hrNode = await mapper(hr, node)
    if (context && context.parent && context.parent.insertNode) await context.parent.insertNode(hrNode)

    if (node.childNodes && node.childNodes.length > 0) {
      if (!node.inferred) node.childNodes = addInferredSections(node.childNodes)
      const next = nextNodes(hrNode, node.childNodes)
      // push next to stack
      // console.log(next)
      Array.prototype.push.apply(stack, next)
    }
  }
}
