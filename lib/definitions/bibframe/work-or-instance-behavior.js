import {
  makeGet,
  makeSet,
  makeRemove,
  // makeAll,
  // makeAdd,
  makeSetAsLabelOnType,
  makeGetLabelFromNode
} from '../helpers'

const WorkOrInstanceBehavior = {}

// // Relationships
// absorbed -> Work or Instance
// absorbedBy -> Work or Instance
// continuedBy ->  Work or Instance
// continues ->  Work or Instance
// continuedInPartBy ->  Work or Instance
// continuesInPart ->  Work or Instance
// dataSource -> Work or Instance
// derivativeOf -> Work or Instance
// derivedFrom -> Work or Instance
// findingAid -> Work or Instance
// findingAidOf -> Work or Instance
// firstIssue -> Work or Instance
// lastIssue -> Work or Instance
// hasDerivative -> Work or Instance
// hasSeries -> Work or Instance
// hasSubseries -> Work or Instance
// index -> Work or Instance
// indexOf -> Work or Instance
// mergedToForm -> Work or Instance
// mergerOf -> Work or Instance
// originalVersion ->  Work or Instance
// originalVersionOf ->  Work or Instance
// otherEdition ->  Work or Instance
// precededBy -> Work or Instance
// succeededBy -> Work or Instance
// replacedBy -> Work or Instance
// replacementOf -> Work or Instance
// separatedFrom -> Work or Instance
// SplitInto -> Work or Instance
// subseriesOf -> Work or Instance
// seriesOf -> Work or Instance
// supplement -> Work or Instance
// supplementTo -> Work or Instance
// translation -> Work or Instance
// translationOf -> Work or Instance

// acquisitionSource -> AcquisitionSource
// //  Information about an organization, person, etc., from which a resource may be obtained.
// acquisitionTerms -> Literal
// // Conditions under which the publisher, distributor, etc., will normally supply a resource, e.g., price of a resource.

// awards -> Literal
// // Information on awards associated with the described resource
WorkOrInstanceBehavior.setAwards = makeSet('bf:awards')
WorkOrInstanceBehavior.removeAwards = makeRemove('bf:awards')
WorkOrInstanceBehavior.awards = makeGet('bf:awards')

// copyrightDate -> Literal
WorkOrInstanceBehavior.setCopyrightDate = makeSet('bf:copyrightDate')
WorkOrInstanceBehavior.removeCopyrightDate = makeRemove('bf:copyrightDate')
WorkOrInstanceBehavior.copyrightDate = makeGet('bf:copyrightDate')

// coverArt -> CoverArt

// credits -> Literal
WorkOrInstanceBehavior.setCredits = makeSet('bf:credits')
WorkOrInstanceBehavior.removeCredits = makeRemove('bf:credits')
WorkOrInstanceBehavior.credits = makeGet('bf:credits')

// duration -> Literal
WorkOrInstanceBehavior.setDuration = makeSet('bf:duration')
WorkOrInstanceBehavior.removeDuration = makeRemove('bf:duration')
WorkOrInstanceBehavior.duration = makeGet('bf:duration')

// frequency -> Frequency

// intendedAudience -> IntendedAudience

// issuance -> Issuance

// media -> Media

// musicFormat -> MusicFormat

// natureOfContent -> Literal
// //  Characterization that epitomizes the primary content of a resource, e.g., field recording of birdsong; combined time series analysis and graph plotting system.
WorkOrInstanceBehavior.setNatureOfContent = makeSet('bf:natureOfContent')
WorkOrInstanceBehavior.removePreferredCitation = makeRemove('bf:natureOfContent')
WorkOrInstanceBehavior.natureOfContent = makeGet('bf:natureOfContent')

// preferredCitation -> Literal
WorkOrInstanceBehavior.setPreferredCitation = makeSet('bf:preferredCitation')
WorkOrInstanceBehavior.removePreferredCitation = makeRemove('bf:preferredCitation')
WorkOrInstanceBehavior.preferredCitation = makeGet('bf:preferredCitation')

// review -> Review

// soundContent -> SoundContent

// summary -> Summary
WorkOrInstanceBehavior.setSummary = makeSetAsLabelOnType('bf:Summary', 'bf:summary')
WorkOrInstanceBehavior.getSummary = makeGetLabelFromNode('bf:summary')

// Work or instance -> bf:copyrightRegistration
WorkOrInstanceBehavior.setRights = makeSetAsLabelOnType('bf:CopyrightRegistration', 'bf:copyrightRegistration')
WorkOrInstanceBehavior.getRights = makeGetLabelFromNode('bf:copyrightRegistration')

// supplementaryContent -> SupplementaryContent
// tableOfContents -> TableOfContents

export default WorkOrInstanceBehavior
