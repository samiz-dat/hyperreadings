import { makeGet, makeSet } from '../helpers'

const ContributionBehavior = {}

ContributionBehavior.getAgent = makeGet('bf:agent')
ContributionBehavior.setAgent = makeSet('bf:agent')
ContributionBehavior.getRole = makeGet('bf:role')
ContributionBehavior.setRole = makeSet('bf:role')

export default ContributionBehavior
