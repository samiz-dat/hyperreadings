import StandardBehavior from './standard-behavior'
import { spo, isNode, toRdfValue } from '../utils'

function makeShortcutFactory (fn, ...defaults) {
  return function (...args) { return fn.apply(this, [...defaults, ...args]) }
}

export const makeGet = makeShortcutFactory.bind(null, StandardBehavior.get)
export const makeSet = makeShortcutFactory.bind(null, StandardBehavior.set)
export const makeRemove = makeShortcutFactory.bind(null, StandardBehavior.remove)
export const makeAll = makeShortcutFactory.bind(null, StandardBehavior.all)
export const makeAdd = makeShortcutFactory.bind(null, StandardBehavior.add)

async function getWithType (value, type) {
  const v = this.hr.graph.v
  const res = await this.hr._search([
    spo(this.name, value, v('id')),
    spo(v('id'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return null
  return this.hr.node({ name: res[0].id, type })
}

export async function allWithType (value, type) {
  const v = this.hr.graph.v
  const res = await this.hr._search([
    spo(this.name, value, v('id')),
    spo(v('id'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return []
  return Promise.all(res.map(r => this.hr.node({ name: r.id, type })))
}

// function makeSetAsNodeWithProperties (property, type) {
//   return async function (properties) {
//     let node = await getWithType.call(this, property, type)
//     if (!node) {
//       const node = await this.hr.createNode(type, properties)
//       return this.add(property, node)
//     }
//     return node.merge(properties)
//   }
// }

export function makeRecipricalBinding (hasPredicate, ofPredicate, relation = 'many-to-one') {
  // do we enforce type checking - only setting relations between specific types?
  // or perhaps this is not needed, as program should be written in such a way as to
  // avoid assigning wrong cases
  if (relation === 'many-to-one') {
    return async function (item) {
      await this.add(hasPredicate, item)
      await item.set(ofPredicate, this)
    }
  }
  if (relation === 'one-to-many') {
    return async function (item) {
      await this.set(hasPredicate, item)
      await item.add(ofPredicate, this)
    }
  }
  if (relation === 'many-to-many') {
    return async function (item) {
      await this.add(hasPredicate, item)
      await item.add(ofPredicate, this)
    }
  }
  if (relation === 'one-to-one') {
    return async function (item) {
      await this.set(hasPredicate, item)
      await item.set(ofPredicate, this)
    }
  }
  throw new Error('The makeRecipricalBinding function expects a valid relation type')
}

async function findSimilarNodes (profile) {
  const v = this.hr.graph.v
  const query = Object.keys(profile).map(predicate => {
    if (predicate === 'type') {
      return spo(v('id'), `rdf:${predicate}`, profile[predicate])
    }
    return spo(v('id'), predicate, toRdfValue(profile[predicate]))
  })
  const results = await this.hr._search(query)
  return results.map(data => ({ name: data.id, type: profile.type }))
}

async function getMatchingNodeOrCreateNew (value, predicate, type) {
  const matches = await findSimilarNodes.call(this, { [predicate]: value, type })
  if (matches.length === 0) {
    // no matches so we creating a new node
    return this.hr.createNode(type, { [predicate]: value })
  } else {
    // should we do further analysis, just because it matches this predicate
    // do we really want to assume that a node is a match
    // how do we choose between multiple matches
    return matches[0]
  }
}

function makeSetNodeOrAsLiteralPredicateWithType (predicate, property, type) {
  return async function (value) {
    if (isNode(value)) {
      return this.set(property, value)
    }
    // check if property already holds a node with this type
    let node = await getWithType.call(this, property, type)
    // if not we will add it
    if (!node) {
      // check if node of type with label already exists
      // if so we will reuse it rather than duplicating entry
      node = await getMatchingNodeOrCreateNew.call(this, value, predicate, type)
      return this.add(property, node)
    }
    // if node already exists
    // check if existing predicate->value is shared with others
    const parents = await node.parents(undefined, { limit: 2 })
    if (parents && parents.length > 1) {
      // this node is used elsewhere - so modifing it will also modify its other uses
      // in which case we want to create a new node
      node = await getMatchingNodeOrCreateNew.call(this, value, predicate, type)
      return this.set(property, node)
    }
    // edit the existing node as its not used elsewhere
    // but still should check if node with value already exists
    const matches = await findSimilarNodes.call(this, { [predicate]: value, type })
    if (matches.length === 0) return node.set(predicate, value)
    return this.set(property, matches[0])
  }
}

function makeGetLiteralOrPredicateFromNodeWithType (predicate, property, type) {
  return async function () {
    let node = await this.get(property)
    if (!node || !node.name) return node
    if (node.type !== type) {
      node = await getWithType.call(this, property, type)
    }
    if (node) return node.get(predicate)
    return null
  }
}

export const makeSetAsLabelOnType = makeSetNodeOrAsLiteralPredicateWithType.bind(null, 'rdfs:label')
// export const makeSetAsValueOnType = makeSetAsPredicateOnType.bind(null, 'rdf:value')

export const makeGetLabelFromNode = makeGetLiteralOrPredicateFromNodeWithType.bind(null, 'rdfs:label')
// export const makeGetValueFromNode = makeGetPredicateFromNodeWithType.bind(null, 'rdf:value')

export function makeRemoveOfType (property, type) {
  return async function () {
    let node = await getWithType.call(this, property, type)
    if (node) {
      await this.remove(property, node)
      await node.destroy()
    }
  }
}
