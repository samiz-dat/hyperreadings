import { makeGet, makeSet } from '../helpers'

const ContributionBehavior = {}

// set/get agent is inherited from SharedBehavior
ContributionBehavior.getRole = makeGet('bf:role')
ContributionBehavior.setRole = makeSet('bf:role')

export default ContributionBehavior
