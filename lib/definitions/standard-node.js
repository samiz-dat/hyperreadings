var spo = require('../utils').spo

function StandardNode (hr, name, type) {
  this.hr = hr
  this.name = name
  this.type = type
}

// STANDARD FUNCTIONALITY
StandardNode.prototype.get = function (key) {
  return new Promise((resolve, reject) => {
    this.hr.graph.get(spo(this.name, key), { limit: 1 }, (err, node) => {
      if (err) return reject(err)
      if (!node || !node.length) resolve(null)
      var name = node[0].object
      // check if value or named node
      // if value just return value.
      // else
      return this.hr.node(name)
    })
  })
}

StandardNode.prototype.add = function (key, value) {
  return this.set(key, value, true)
}

StandardNode.prototype.set = async function (key, value, allowMultiple) {
  // 1. delete all `< node name ? >` triples
  if (!allowMultiple) await this.hr._del(spo(this.name, key))
  // 2. create new key `< node name value >`
  await this.hr._put(spo(this.name, key, value))
  // 3. return node
  return this
}

StandardNode.prototype.has = function (key, value) {
  return new Promise((resolve, reject) => {
    this.hr.graph.get(spo(this.name, key, value), { limit: 1 }, (err, node) => {
      if (err) return reject(err)
      if (!node) resolve(false)
      if (node.length && node.length === 0) resolve(false)
      resolve(true)
    })
  })
}

module.exports = StandardNode
