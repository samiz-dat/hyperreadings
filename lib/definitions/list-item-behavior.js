
import StandardBehavior from './standard-behavior'
import { ops, spo } from '../utils'

const ListItemBehavior = {}

ListItemBehavior.setContent = function (value) {
  return this.set('co:itemContent', value)
}

ListItemBehavior.previous = async function () {
  var triples = await this.hr._get(ops(this.name, 'co:nextItem'), { limit: 1 })
  if (!triples.length) triples = await this.hr._get(ops(this.name, 'co:firstItem'), { limit: 1 })
  // no need to check if value, as if this is not a named node we have bigger problems
  return triples.length ? this.hr.node(triples[0].subject) : undefined
}

ListItemBehavior.next = function () {
  return this.get('co:nextItem')
}

ListItemBehavior.itemContent = async function () {
  const nodes = await this.hr._get(spo(this.name, 'co:itemContent'), { limit: 1 })
  if (!nodes || nodes.length === 0) return null
  return this.hr.node(nodes[0].object, { rel: 'co:itemContent', parent: this })
}

ListItemBehavior.remove = async function (attr, value) {
  if (attr === 'co:itemContent') {
    // stitch up list so that iteration still works
    const prev = await this.previous()
    const next = await this.next()
    if (prev) {
      const relation = prev.type === this.type ? 'co:nextItem' : 'co:firstItem'
      if (next) {
        // set removes previous relationship
        await prev.set(relation, next)
      } else {
        await prev.remove(relation, this)
      }
    }
  }
  return StandardBehavior.remove.call(this, attr, value)
}

export default ListItemBehavior
