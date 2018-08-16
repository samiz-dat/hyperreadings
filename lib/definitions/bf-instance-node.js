import inherits from 'inherits'
import StandardNode from './standard-node'
import { ops, spo } from '../utils'

function InstanceNode (hr, name, type, ctx) {
  StandardNode.call(this, hr, name, type, ctx)
}

inherits(InstanceNode, StandardNode)

InstanceNode.prototype.getWithType = async function (value, type) {
  const v = this.hr.graph.v
  const res = await this.hr._search([
    spo(this.name, value, v('a')),
    spo(v('a'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return null
  return this._castToNodeOrValue(res[0].a)
}

InstanceNode.prototype.allWithType = async function (value, type) {
  const v = this.hr.graph.v
  const res = await this.hr._search([
    spo(this.name, value, v('a')),
    spo(v('a'), 'rdf:type', type)
  ], { limit: 1 })
  if (!res.length) return []
  return res.map(r => this._castToNodeOrValue(r.a))
}

// work or instance -> bf:summary
InstanceNode.prototype.setSummary = async function (value) {
  const node = await this.hr.createNode('bf:Summary', { 'rdfs:label': value })
  return this.set('bf:summary', node)
}
InstanceNode.prototype.getSummary = async function (value) {
  const summary = await this.get('bf:summary')
  if (summary) return summary.get('rdfs:label')
  return null
}

// Work or instance -> bf:copyrightRegistration
InstanceNode.prototype.setRights = async function (value) {
  const node = await this.hr.createNode('bf:CopyrightRegistration', { 'rdfs:label': value })
  return this.set('bf:copyrightRegistration', node)
}
InstanceNode.prototype.getRights = async function (value) {
  const rights = await this.get('bf:copyrightRegistration')
  if (rights) return rights.get('rdfs:label')
  return null
}

// Work, Instance or Item -> bf:subject
InstanceNode.prototype.addSubject = async function (value) {
  return this.add('bf:subject', value)
}
InstanceNode.prototype.removeSubject = async function (value) {
  return this.remove('bf:subject', value)
}
InstanceNode.prototype.subjects = async function (value) {
  return this.all('bf:subject', value)
}

// Work, Instance or Item -> bf:title -> rdfs:label
InstanceNode.prototype.setTitle = async function (value) {
  let title = await this.getWithType('bf:title', 'bf:Title')
  if (!title) {
    const title = await this.hr.createNode('bf:Title', { 'rdfs:label': value })
    return this.add('bf:title', title)
  }
  return title.set('rdfs:label', value)
}

InstanceNode.prototype.getTitle = async function (value) {
  let title = await this.getWithType('bf:title', 'bf:Title')
  if (title) return title.get('rdfs:label')
  return null
}

InstanceNode.prototype.removeTitle = async function () {
  let title = await this.getWithType('bf:title', 'bf:Title')
  if (title) {
    await this.remove('bf:title', title)
    await title.destroy()
  }
  return null
}

// Work, Instance or Item ->
InstanceNode.prototype.setAbbreviatedTitle = async function (value) {
  let title = await this.getWithType('bf:title', 'bf:AbbreviatedTitle')
  if (!title) {
    title = await this.hr.createNode('bf:AbbreviatedTitle', { 'rdfs:label': value })
    return this.add('bf:title', title)
  }
  return title.set('rdfs:label', value)
}

InstanceNode.prototype.getAbbreviatedTitle = async function (value) {
  let title = await this.getWithType('bf:title', 'bf:AbbreviatedTitle')
  if (title) return title.get('rdfs:label')
  return null
}

InstanceNode.prototype.removeAbbreviatedTitle = async function () {
  let title = await this.getWithType('bf:title', 'bf:AbbreviatedTitle')
  if (title) {
    await this.remove('bf:title', title)
    await title.destroy()
  }
  return null
}

// Work, Instance or Item -> contribution
InstanceNode.prototype.addContribution = async function (agent, role) {
  const contribution = await this.hr.createNode('bf:Contribution', { 'bf:agent': agent, 'bf:role': role })
  return this.add('bf:contribution', contribution)
}

InstanceNode.prototype.contributions = async function (agent, role) {
  return this.all('bf:contribution')
}
// Instance -> provisionActivity

export default InstanceNode
