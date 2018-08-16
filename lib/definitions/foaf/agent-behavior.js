import { makeGet, makeSet, makeRemove, makeAll, makeAdd } from '../helpers'

const AgentBehavior = {}

AgentBehavior.getName = makeGet('foaf:name')
AgentBehavior.setName = makeSet('foaf:name')
AgentBehavior.removeName = makeRemove('foaf:name')

AgentBehavior.allInterests = makeAll('foaf:interest')
AgentBehavior.addInterest = makeAdd('foaf:interest')
AgentBehavior.removeInterest = makeRemove('foaf:interest')

AgentBehavior.getAge = makeGet('foaf:age')
AgentBehavior.setAge = makeSet('foaf:age')
AgentBehavior.removeAge = makeRemove('foaf:age')

AgentBehavior.getTitle = makeGet('foaf:title')
AgentBehavior.setTitle = makeSet('foaf:title')
AgentBehavior.removeTitle = makeRemove('foaf:title')

AgentBehavior.allMadeRelations = makeAll('foaf:made')
AgentBehavior.addMadeRelation = makeAdd('foaf:made')
AgentBehavior.removeMadeRelation = makeRemove('foaf:made')

export default AgentBehavior
