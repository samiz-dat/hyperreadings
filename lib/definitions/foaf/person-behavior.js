import { makeGet, makeSet, makeRemove, makeAll, makeAdd } from '../helpers'

const PersonBehavior = {}

PersonBehavior.getPlan = makeGet('foaf:plan')
PersonBehavior.setPlan = makeSet('foaf:plan')
PersonBehavior.removePlan = makeRemove('foaf:plan')

PersonBehavior.getFirstName = makeGet('foaf:firstName')
PersonBehavior.setFirstName = makeSet('foaf:firstName')
PersonBehavior.removeFirstName = makeRemove('foaf:firstName')

PersonBehavior.getGivenName = makeGet('foaf:givenName')
PersonBehavior.setGivenName = makeSet('foaf:givenName')
PersonBehavior.removeGivenName = makeRemove('foaf:givenName')

PersonBehavior.getSurname = makeGet('foaf:surname')
PersonBehavior.setSurname = makeSet('foaf:surname')
PersonBehavior.removeSurname = makeRemove('foaf:surname')

PersonBehavior.getLastName = makeGet('foaf:lastName')
PersonBehavior.setLastName = makeSet('foaf:lastName')
PersonBehavior.removeLastName = makeRemove('foaf:lastName')

PersonBehavior.getFamilyName = makeGet('foaf:familyName')
PersonBehavior.setFamilyName = makeSet('foaf:familyName')
PersonBehavior.removeFamilyName = makeRemove('foaf:familyName')

PersonBehavior.getGeekcode = makeGet('foaf:geekcode')
PersonBehavior.setGeekcode = makeSet('foaf:geekcode')
PersonBehavior.removeGeekcode = makeRemove('foaf:geekcode')

PersonBehavior.getCurrentProjects = makeGet('foaf:currentProject')
PersonBehavior.allCurrentProjects = makeAll('foaf:currentProject')
PersonBehavior.addCurrentProject = makeAdd('foaf:currentProject')
PersonBehavior.getCurrentProject = makeRemove('foaf:currentProject')

PersonBehavior.allPastProjects = makeAll('foaf:pastProject')
PersonBehavior.addPastProject = makeAdd('foaf:pastProject')
PersonBehavior.removePastProject = makeRemove('foaf:pastProject')

PersonBehavior.allPublications = makeAll('foaf:publications')
PersonBehavior.addPublication = makeAdd('foaf:publications')
PersonBehavior.removePublication = makeRemove('foaf:publications')

PersonBehavior.getWorkplaceHomepage = makeGet('foaf:workplaceHomepage')
PersonBehavior.setWorkplaceHomepage = makeSet('foaf:workplaceHomepage')
PersonBehavior.removeWorkplaceHomepage = makeRemove('foaf:workplaceHomepage')

PersonBehavior.getWorkInfoHomepage = makeGet('foaf:workInfoHomepage')
PersonBehavior.setWorkInfoHomepage = makeSet('foaf:workInfoHomepage')
PersonBehavior.removeWorkInfoHomepage = makeRemove('foaf:workInfoHomepage')

PersonBehavior.getSchoolHomepage = makeGet('foaf:schoolHomepage')
PersonBehavior.setSchoolHomepage = makeSet('foaf:schoolHomepage')
PersonBehavior.removeSchoolHomepage = makeRemove('foaf:schoolHomepage')

PersonBehavior.getMyersBriggs = makeGet('foaf:myersBriggs')
PersonBehavior.setMyersBriggs = makeSet('foaf:myersBriggs')
PersonBehavior.removeMyersBriggs = makeRemove('foaf:myersBriggs')

PersonBehavior.getImage = makeGet('foaf:img')
PersonBehavior.setImage = makeSet('foaf:img')
PersonBehavior.removeImage = makeRemove('foaf:img')

PersonBehavior.allKnowRelations = makeAll('foaf:knows')
PersonBehavior.addKnowRelation = makeAdd('foaf:knows')
PersonBehavior.removeKnowRelation = makeRemove('foaf:knows')

export default PersonBehavior
