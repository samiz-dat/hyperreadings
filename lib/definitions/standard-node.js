import {
  spo,
  ops,
  isRdfLiteral,
  fromRdfValue,
  toRdfValue,
  isNode
} from '../utils'

function StandardNode (hr, name, type, context) {
  this.hr = hr
  this.name = name
  this.type = type
  this.rel = context && context.rel
  this.parent = context && context.parent
  this.child = context && context.child
}

// STANDARD FUNCTIONALITY
StandardNode.prototype._castToNodeOrValue = async function (value) {
  if (isRdfLiteral(value)) {
    return fromRdfValue(value)
  }
  return this.hr.node(value)
}

StandardNode.prototype.get = async function (attr, value) {
  const nodes = await this.hr._get(spo(this.name, attr, value), { limit: 1 })
  // console.log('get', spo(this.name, attr, value), nodes)
  if (!nodes || nodes.length === 0) return null
  return this._castToNodeOrValue(nodes[0].object)
}

StandardNode.prototype.all = async function (attr, value) {
  const triples = await this.hr._get(spo(this.name, attr, value))
  return Promise.all(triples.map(node => this._castToNodeOrValue(node.object)))
}

StandardNode.prototype.add = function (attr, value) {
  return this.set(attr, value, true)
}

StandardNode.prototype.set = async function (attr, value, allowMultiple) {
  if (!attr) throw new Error('node.set() requires attribute')
  if (typeof attr !== 'string') {
    // TODO: set multiple
  }
  // 1. delete all `< node name ? >` triples
  if (!allowMultiple) {
    // replace with stream
    const triples = await this.hr._get(spo(this.name, attr))
    // if object is a node this will potentially leave floating nodes.
    await Promise.all(triples.map(triple => this.hr._del(triple)))
  }
  // 2. create new key `< node name value >`
  await this.hr._put(spo(this.name, attr, toRdfValue(value)))
  // 3. return node
  return this
}

StandardNode.prototype.update = async function (properties) {
  // get all existing properties
  const currentProps = await this.properties()
  const oldPredicates = Object.keys(currentProps)
  const newPredicates = Object.keys(properties)
  const del = oldPredicates.reduce((p, v) => {
    if (v === 'rdf:type') return p
    if (!newPredicates.includes(v) || properties[v] !== currentProps[v]) p.push(v)
    // else if (properties[v] === ) p.noUpdate.push(v)
    return p
  }, [])

  await Promise.all(del.map(v => {
    const value = currentProps[v]
    if (Array.isArray(value)) {
      return Promise.all(value.map(val => this.remove(v, val)))
    }
    return this.remove(v, value)
    // return this.remove(v, currentProps[v])
  }))
  await Promise.all(newPredicates.map(v => {
    const value = properties[v]
    if (value === currentProps[v]) return

    if (Array.isArray(value)) {
      return Promise.all(value.map(val => this.add(v, val)))
    }
    return this.set(v, value)
  }))
}

StandardNode.prototype.has = async function (attr, value) {
  var nodes = await this.hr._get(spo(this.name, attr, value && toRdfValue(value)), { limit: 1 })
  if (!nodes) return false
  if (nodes.length === 0) return false
  return true
}

StandardNode.prototype.remove = async function (attr, value) {
  // get the nodes
  // if this is a parent we already know that these exist so should not check.
  // console.log('remove', this.name, attr, value && value.name)
  // console.log(spo(this.name, attr, value && toRdfValue(value)))
  const triples = await this.hr._get(spo(this.name, attr, value && toRdfValue(value)))
  if (!triples) return this
  await Promise.all(triples.map(triple => this.hr._del(triple)))
  return this
}

/** return array of parents elements */
StandardNode.prototype.parents = async function (relation) {
  const triples = await this.hr._get(ops(this.name, relation))
  // console.log('parents', triples.map(t => t.subject))
  // all parents will be named nodes as they refer to this child node
  return Promise.all(triples.map(node => this.hr.node(
    node.subject,
    { child: this, rel: node.predicate }
  )))
}

function filterChildNodes (triple) {
  if (isRdfLiteral(triple.object)) return false
  return triple.predicate && triple.predicate !== 'rdf:type'
}

StandardNode.prototype.properties = async function () {
  const triples = await this.hr._get(spo(this.name))
  return triples.reduce((p, triple) => {
    const value = isRdfLiteral(triple.object) ? fromRdfValue(triple.object) : { name: triple.object }
    if (p[triple.predicate] === undefined) p[triple.predicate] = value
    else if (Array.isArray(p[triple.predicate])) p[triple.predicate].push(value)
    else p[triple.predicate] = [p[triple.predicate], value]
    return p
  }, {})
}

/** return array of child elements */
StandardNode.prototype.children = async function (includeLiterals) {
  let triples = await this.hr._get(spo(this.name))
  // also filter literals out - as they will note be nodes;
  if (!includeLiterals) {
    const promises = triples
      .filter(filterChildNodes)
      .map(node => this.hr.node(
        node.object,
        { parent: this, rel: node.predicate }
      ))
    return Promise.all(promises)
  }
  return Promise.all(triples.map(async (node) => {
    // console.log('obj', node.object)
    if (isRdfLiteral(node.object)) {
      return {
        attr: node.predicate,
        value: node.object
      }
    }
    return this.hr.node(node.object, { parent: this, rel: node.predicate })
  }))
}

StandardNode.prototype.disconnect = async function () {
  const parents = await this.parents()
  // parents.map(parent => console.log('diconnect', parent.name, parent.rel, this.name))
  for (var i = 0; i < parents.length; i++) {
    const parent = parents[i]
    // console.log('diconnect', parent.name, parent.rel, this.name)
    await parent.remove(parent.rel, this)
  }
  // await Promise.all(parents.map(parent => parent.remove(parent.rel, this)))
  return this
}

StandardNode.prototype.destroy = async function (ignore) {
  if (!ignore) ignore = [this.name]
  else ignore.push(this.name)
  // 1. node.disconnect()
  await this.disconnect()
  // 2. find all `< node ?a ?b >`
  const children = await this.children(true)
  for (var i = 0; i < children.length; i++) {
    const child = children[i]
    if (isNode(child)) {
      // 3. for each check if it has other nodes connecting to it eg `< ? ? ?b >`
      let itsParents = await child.parents()
      itsParents = itsParents.filter(cp => !ignore.includes(cp.name))
      if (!itsParents.length) {
        // console.log('DESTROY child ->', child.name, child.rel)
        await child.destroy(ignore)
      } else {
        // console.log('DELETE relation to child ->', this.name, child.rel, child.name)
        await this.hr._del(spo(this.name, child.rel, child.name))
      }
    }
    await this.hr._del(spo(this.name, child.attr, child.value))
  }
}

export default StandardNode
