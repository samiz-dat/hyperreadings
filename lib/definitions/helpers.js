import StandardBehavior from './standard-behavior'
import { spo } from '../utils'

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
    spo(this.name, value, v('a')),
    spo(v('a'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return null
  return this._castToNodeOrValue(res[0].a)
}

async function allWithType (value, type) {
  const v = this.hr.graph.v
  const res = await this.hr._search([
    spo(this.name, value, v('a')),
    spo(v('a'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return []
  return res.map(r => this._castToNodeOrValue(r.a))
}

function makeSetAsNodeWithProperties (property, type, properties) {
  return async function (value) {
    let node = await getWithType.call(this, property, type)
    if (!node) {
      const node = await this.hr.createNode(type, properties)
      return this.add(property, node)
    }
    return node.update(properties)
  }
}

export function makeSetAsLabelOnType (property, type) {
  return async function (value) {
    let node = await getWithType.call(this, property, type)
    if (!node) {
      const node = await this.hr.createNode(type, { 'rdfs:label': value })
      return this.add(property, node)
    }
    return node.set('rdfs:label', value)
  }
}

export function makeGetLabelFromNode (property, type) {
  return async function (value) {
    let node = await this.getWithType(property, type)
    if (node) return node.get('rdfs:label')
    return null
  }
}

export function makeRemoveOfType (property, type) {
  return async function () {
    let node = await this.getWithType(property, type)
    if (node) {
      await this.remove(property, node)
      await node.destroy()
    }
  }
}
