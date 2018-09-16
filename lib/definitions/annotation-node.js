import inherits from 'inherits'
import StandardNode from './standard-node'
import { spo } from '../utils'

const MOTIVATIONS = {
  assessing: 'oa:assessing',
  bookmarking: 'oa:bookmarking',
  classifying: 'oa:classifying',
  commenting: 'oa:commenting',
  describing: 'oa:describing',
  editing: 'oa:editing',
  highlighting: 'oa:highlighting',
  identifying: 'oa:identifying',
  linking: 'oa:linking',
  moderating: 'oa:moderating',
  questioning: 'oa:questioning',
  replying: 'oa:replying',
  tagging: 'oa:tagging'
}

function AnnotationNode (hr, name, type, ctx) {
  StandardNode.call(this, hr, name, type, ctx)
}

inherits(AnnotationNode, StandardNode)

AnnotationNode.getTargets = async function () {
  return this.all('oa:hasTarget')
}

AnnotationNode.getBodies = async function () {
  return this.all('oa:hasBody')
}

AnnotationNode.setMotivation = async function (motivation) {
  const motive = MOTIVATIONS[motivation]
  if (motive) return this.set('oa:hasMotivation', motive)
}

AnnotationNode.setTarget = async function (id, opts) {
  // TODO: check if target is already assigned
  const target = await this.hr.newBlankNodeName()
  await this.hr._put(spo(target, 'oa:hasSource', id))
  // todo: add support for other selectors
  const selector = await this.hr.createNode('oa:TextPositionSelector')
  await selector.set('oa:start', opts.start)
  await selector.set('oa:end', opts.end)
  await this.hr._put(spo(target, 'oa:hasSelector', selector))
  await this.set('oa:hasTarget', { name: target })
}

AnnotationNode.setBody = async function (node) {
  const bodies = await this.getBodies()
  if (bodies) {
    // should destroy if not connected to another annotation
    // for now just remove link
    // TODO: dont remove if it is node
    await Promise.all(bodies.map(body => {
      this.remove('oa:hasBody', body)
    }))
  }
  if (typeof node === 'string') {
    // add as an embeded text node text node
    const body = await this.hr.createNode('oa:TextualBody', {
      'rdf:value': node,
      'dc:format': 'text/plain'
    })
    this.set('oa:hasBody', body)
    return
  }
  // else simply point to the node
  this.set('oa:hasBody', node)
}

export default AnnotationNode
