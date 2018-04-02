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
      if (!node || node.length === 0) return resolve(null)
      var name = node[0].object
      // check if value or named node
      // if value just return value.
      // else
      // console.log('get:::', node)
      this.hr.node(name).then(resolve).catch(reject)
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
  // console.log('setting', this.name, value)
  await this.hr._put(spo(this.name, key, value.name ? value.name : value))
  // 3. return node
  return this
}

StandardNode.prototype.has = function (key, value) {
  return new Promise((resolve, reject) => {
    this.hr.graph.get(spo(this.name, key, value), { limit: 1 }, (err, node) => {
      if (err) return reject(err)
      // console.log('has', node)
      if (!node) resolve(false)
      if (node.length === 0) resolve(false)
      resolve(true)
    })
  })
}

module.exports = StandardNode
