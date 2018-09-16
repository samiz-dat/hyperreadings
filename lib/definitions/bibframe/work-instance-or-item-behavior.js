import {
  makeGet,
  makeSet,
  makeRemove,
  makeAll,
  makeAdd,
  makeGetLabelFromNode,
  makeSetAsLabelOnType,
  makeRemoveOfType
} from '../helpers'

const WorkInstanceOrItemBehavior = {}

// title -> Title
WorkInstanceOrItemBehavior.setTitle = makeSetAsLabelOnType('bf:title', 'bf:Title')
WorkInstanceOrItemBehavior.getTitle = makeGetLabelFromNode('bf:title', 'bf:Title')
WorkInstanceOrItemBehavior.removeTitle = makeRemoveOfType('bf:title', 'bf:Title')

WorkInstanceOrItemBehavior.setAbbreviatedTitle = makeSetAsLabelOnType('bf:title', 'bf:AbbreviatedTitle')
WorkInstanceOrItemBehavior.getAbbreviatedTitle = makeGetLabelFromNode('bf:title', 'bf:AbbreviatedTitle')
WorkInstanceOrItemBehavior.removeAbbreviatedTitle = makeRemoveOfType('bf:title', 'bf:AbbreviatedTitle')

// subject
WorkInstanceOrItemBehavior.addSubject = makeAdd('bf:subject')
WorkInstanceOrItemBehavior.removeSubject = makeRemove('bf:subject')
WorkInstanceOrItemBehavior.subjects = makeAll('bf:subject')

// classification ->   Classification
// contribution -> Contribution
WorkInstanceOrItemBehavior.addContributionNode = makeAdd('bf:contribution')
WorkInstanceOrItemBehavior.addContribution = async function (agent, role) {
  const contribution = await this.hr.createNode('bf:Contribution', { 'bf:agent': agent, 'bf:role': role })
  return this.add('bf:contribution', contribution)
}
WorkInstanceOrItemBehavior.contributions = async function (agent, role) {
  const contributions = await this.all('bf:contribution')
  return Promise.all(contributions.map(async (c) => {
    const agent = await c.getAgent()
    const role = await c.getRole()
    return {
      name: await agent.getName(),
      firstName: await agent.getFirstName(),
      lastName: await agent.getLastName(),
      role: role.name
    }
  }))
}

// custodialHistory -> Literal
WorkInstanceOrItemBehavior.setCustodialHistory = makeSet('bf:custodialHistory')
WorkInstanceOrItemBehavior.removeCustodialHistory = makeRemove('bf:custodialHistory')
WorkInstanceOrItemBehavior.custodialHistory = makeGet('bf:custodialHistory')

// genreForm -> GenreForm
// usageAndAccessPolicy -> UsageAndAccessPolicy

// RELATIONSHIPS
// accompaniedBy -> Work, Instance or Item
// accompanies -> Work, Instance or Item
// hasEquivalent -> Work, Instance or Item
// hasPart -> Work, Instance or Item
// partOf -> Work, Instance or Item
// referencedBy -> Work, Instance or Item
// references -> Work, Instance or Item

export default WorkInstanceOrItemBehavior
