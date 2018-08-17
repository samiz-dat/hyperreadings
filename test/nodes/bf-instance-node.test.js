/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'
import { spo } from '../../lib/utils'

xdescribe('InstanceNode', () => {
  let hr
  let instance
  beforeEach(done => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hr = ramHyperReadings()
    hr.on('ready', async () => {
      instance = await hr.createNode('bf:Instance')
      done()
    })
  })

  describe('.setSummary()', () => {
    context('when summary already exists', () => {
      it('replaces summary', async () => {
        await instance.setSummary('property...')
        await instance.setSummary('property is theft')
        const v = hr.graph.v
        const node = await hr._search([
          spo(instance.name, 'bf:summary', v('x')),
          spo(v('x'), 'rdfs:label', v('y'))
        ])
        expect(node).to.have.length(1)
        expect(node[0].y).to.eql('"property is theft"')
      })
    })
    context('when summary does not exists', () => {
      it('adds summary', async () => {
        await instance.setSummary('no slaves, no masters')
        const v = hr.graph.v
        const node = await hr._search([
          spo(instance.name, 'bf:summary', v('x')),
          spo(v('x'), 'rdfs:label', v('y'))
        ], { limit: 1 })
        expect(node).to.have.length(1)
        expect(node[0].y).to.eql('"no slaves, no masters"')
      })
    })
  })

  describe('.getSummary()', () => {
    context('when summary already exists', () => {
      it('returns summary', async () => {
        await instance.setSummary('eat the rich')
        const summary = await instance.getSummary()
        expect(summary).to.eql('eat the rich')
      })
    })
    context('when summary does not exists', () => {
      it('returns nothing', async () => {
        const summary = await instance.getSummary()
        expect(summary).to.eql(null)
      })
    })
  })

  describe('.setRights`()', () => {
    context('when rights already exists', () => {
      it('replaces rights', async () => {
        await instance.setRights('exclusive')
        await instance.setRights('unlicensed')
        const v = hr.graph.v
        const node = await hr._search([
          spo(instance.name, 'bf:copyrightRegistration', v('x')),
          spo(v('x'), 'rdfs:label', v('y'))
        ])
        expect(node).to.have.length(1)
        expect(node[0].y).to.eql('"unlicensed"')
      })
    })
    context('when rights does not exists', () => {
      it('adds rights', async () => {
        await instance.setRights('none reserved')
        const v = hr.graph.v
        const node = await hr._search([
          spo(instance.name, 'bf:copyrightRegistration', v('x')),
          spo(v('x'), 'rdfs:label', v('y'))
        ])
        expect(node).to.have.length(1)
        expect(node[0].y).to.eql('"none reserved"')
      })
    })
  })

  describe('.getRights`()', () => {
    context('when rights already exists', () => {
      it('returns rights', async () => {
        await instance.setRights('cc0')
        const rights = await instance.getRights()
        expect(rights).to.eql('cc0')
      })
    })
    context('when rights does not exists', () => {
      it('returns nothing', async () => {
        const rights = await instance.getRights()
        expect(rights).to.eql(null)
      })
    })
  })

  describe('.addSubject(subject)', () => {
    it('adds a new subject to the instance', async () => {
      await instance.addSubject('anarchism')
      await instance.addSubject('politics')
      await instance.addSubject('20th Century')
      const subjects = await hr._get(spo(instance.name, 'bf:subject'))
      expect(subjects).to.have.length(3)
      expect(subjects.map(sub => sub.object)).to.have.members(['"anarchism"', '"politics"', '"20th Century"'])
    })
  })

  describe('.subjects()', () => {
    context('when instance has subjects', () => {
      it('returns all subjects', async () => {
        await instance.addSubject('Activism')
        await instance.addSubject('Computer Programming')
        const subjects = await instance.subjects()
        expect(subjects).to.have.length(2)
        expect(subjects).to.have.members(['Activism', 'Computer Programming'])
      })
    })
    context('when instance has no subjects', () => {
      it('returns an empty array', async () => {
        const subjects = await instance.subjects()
        expect(subjects).to.be.an('array').that.has.length(0)
      })
    })
  })

  describe('.removeSubject(subject)', () => {
    context('when subject exists', () => {
      it('deletes subjects from instance', async () => {
        await instance.addSubject('anarchism')
        await instance.addSubject('politics')
        await instance.addSubject('20th Century')
        await instance.removeSubject('politics')
        const subjects = await instance.subjects()
        expect(subjects).to.have.length(2)
        expect(subjects).to.have.members(['anarchism', '20th Century'])
      })
    })
    context('when subject does not exists', () => {
      it('does nothing', async () => {
        await instance.addSubject('anarchism')
        await instance.removeSubject('politics')
        const subjects = await instance.subjects()
        expect(subjects).to.have.length(1)
        expect(subjects).to.have.members(['anarchism'])
      })
    })
  })

  describe('.setTitle()', async () => {
    context('when instance already has a title', () => {
      it('replaces the title', async () => {
        await instance.setTitle('Philosophy of Poverty')
        await instance.setTitle('Poverty of Philosophy')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(1)
        expect(titles[0].title).to.eql('"Poverty of Philosophy"')
        expect(titles[0].type).to.eql('bf:Title')
      })
    })
    context('when instance already has an abbreviated title', () => {
      it('adds a title', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(2)
        const sanitizedTitles = titles.map(t => { delete t.x; return t })
        expect(sanitizedTitles).to.deep.include.members([
          { title: '"We, the anarchists"', type: 'bf:AbbreviatedTitle' },
          { title: '"We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937"', type: 'bf:Title' }
        ])
      })
    })
    context('when instance has no titles', () => {
      it('adds a title', async () => {
        await instance.setTitle('What is property?')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(1)
        expect(titles[0].title).to.eql('"What is property?"')
        expect(titles[0].type).to.eql('bf:Title')
      })
    })
  })

  describe('.getTitle()', async () => {
    context('when instance has a title', () => {
      it('returns a title', async () => {
        await instance.setTitle('Philosophy of Poverty')
        const title = await instance.getTitle()
        expect(title).to.eql('Philosophy of Poverty')
      })
    })
    context('when instance has multiple types of titles', () => {
      it('returns only the Title type', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        const title = await instance.getTitle()
        expect(title).to.eql('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
      })
    })
    context('when instance has no title', () => {
      it('returns null', async () => {
        const title = await instance.getTitle()
        expect(title).to.eql(null)
      })
    })
    context('when instance has only abbreviated title', () => {
      it('returns null', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        const title = await instance.getTitle()
        expect(title).to.eql(null)
      })
    })
  })

  describe('.removeTitle()', async () => {
    context('when instance has a title', () => {
      it('it removes the title', async () => {
        await instance.setTitle('Philosophy of Poverty')
        await instance.removeTitle()
        const title = await instance.getTitle()
        expect(title).to.eql(null)
      })
    })
    context('when instance has multiple types of titles', () => {
      it('removes only the Title type', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        await instance.removeTitle()
        const title = await instance.getTitle()
        const abbreviatedTitle = await instance.getAbbreviatedTitle()
        expect(title).to.eql(null)
        expect(abbreviatedTitle).to.eql('We, the anarchists')
      })
    })
    context('when instance has no title', () => {
      it('does not error', async () => {
        await instance.removeTitle()
      })
    })
    context('when instance has only abbreviated title', () => {
      it('returns null', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.removeTitle()
        const title = await instance.getTitle()
        const abbreviatedTitle = await instance.getAbbreviatedTitle()
        expect(title).to.eql(null)
        expect(abbreviatedTitle).to.eql('We, the anarchists')
      })
    })
  })

  describe('.setAbreviatedTitle()', async () => {
    context('when instance already has an abbreviated title', () => {
      it('replaces the abbreviated title', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setAbbreviatedTitle('Hackers Manifesto')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(1)
        expect(titles[0]).to.deep.include({ title: '"Hackers Manifesto"', type: 'bf:AbbreviatedTitle' })
      })
    })
    context('when instance already has a title', () => {
      it('adds the abbreviated title', async () => {
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        await instance.setAbbreviatedTitle('We, the anarchists')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(2)
        const sanitizedTitles = titles.map(t => { delete t.x; return t })
        expect(sanitizedTitles).to.deep.include.members([
          { title: '"We, the anarchists"', type: 'bf:AbbreviatedTitle' },
          { title: '"We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937"', type: 'bf:Title' }
        ])
      })
    })
    context('when instance has no titles', () => {
      it('adds the abbreviated title', async () => {
        await instance.setAbbreviatedTitle('Gender Trouble')
        const v = hr.graph.v
        const titles = await hr._search([
          spo(instance.name, 'bf:title', v('x')),
          spo(v('x'), 'rdfs:label', v('title')),
          spo(v('x'), 'rdf:type', v('type'))
        ])
        expect(titles).to.have.length(1)
        expect(titles[0]).to.deep.include({ title: '"Gender Trouble"', type: 'bf:AbbreviatedTitle' })
      })
    })
  })

  describe('.getAbbreviatedTitle()', async () => {
    context('when instance has am abbreviated title', () => {
      it('returns the abbreviated', async () => {
        await instance.setAbbreviatedTitle('Philosophy of Poverty')
        const title = await instance.getAbbreviatedTitle()
        expect(title).to.eql('Philosophy of Poverty')
      })
    })
    context('when instance has multiple types of titles', () => {
      it('returns only the AbbreviatedTitle type', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        const title = await instance.getAbbreviatedTitle()
        expect(title).to.eql('We, the anarchists')
      })
    })
    context('when instance has no abbreviated title', () => {
      it('returns null', async () => {
        const title = await instance.getAbbreviatedTitle()
        expect(title).to.eql(null)
      })
    })
    context('when instance has title but no abbreviated title', () => {
      it('returns null', async () => {
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        const title = await instance.getAbbreviatedTitle()
        expect(title).to.eql(null)
      })
    })
  })

  describe('.removeAbbreviatedTitle()', async () => {
    context('when instance has an abbreviated title', () => {
      it('it removes the abbreviated title', async () => {
        await instance.setTitle('Philosophy of Poverty')
        await instance.removeTitle()
        const title = await instance.getTitle()
        expect(title).to.eql(null)
      })
    })
    context('when instance has multiple types of titles', () => {
      it('removes only the AbbreviatedTitle type', async () => {
        await instance.setAbbreviatedTitle('We, the anarchists')
        await instance.setTitle('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        await instance.removeAbbreviatedTitle()
        const title = await instance.getTitle()
        const abbreviatedTitle = await instance.getAbbreviatedTitle()
        expect(title).to.eql('We, the anarchists : a study of the Iberian Anarchist Federation (FAI), 1927-1937')
        expect(abbreviatedTitle).to.eql(null)
      })
    })
    context('when instance has no title', () => {
      it('does not error', async () => {
        await instance.removeAbbreviatedTitle()
      })
    })
    context('when instance has only title type', () => {
      it('returns null', async () => {
        await instance.setTitle('We, the anarchists')
        await instance.removeAbbreviatedTitle()
        const abbreviatedTitle = await instance.getAbbreviatedTitle()
        const title = await instance.getTitle()
        expect(abbreviatedTitle).to.eql(null)
        expect(title).to.eql('We, the anarchists')
      })
    })
  })

  describe('.addContribution(agent, role)', () => {
    context('when agent is a string', () => {
      it('attempts to create a Person from the string')
    })
    context('when agent and valid role are provided', () => {
      it('adds a contributor to with a role to the Instance')
    })
    context('when role is not a valid marc relation', () => {
      it('returns a rejected promise')
    })
    context('when role is not provided', () => {
      it('adds a contributor to with role author')
    })
    context('when there is already a contributor', () => {
      it('adds another')
    })
  })

  describe('.contributions(role)', () => {
    context('when role is provided', () => {
      it('returns a list of all contributions with that role')
    })
    context('when role is not provided', () => {
      it('returns all contributions')
      context('when no contributions', () => {
        it('returns an empty array')
      })
    })
  })

  describe('.setPublicationDate(date)', () => {
    context('when bf:Publication does not yet exist under bf:provisionActivity', () => {
      it('creates a Publication under bf:provisionActivity with date')
    })
    context('when bf:Publication already exists under bf:provisionActivity', () => {
      context('when publication date already exists', () => {
        it('overwrites the old date with the new')
      })
      context('when publication date does not exist', () => {
        it('adds the publication date to the Publication')
      })
    })
  })

  describe('.getPublicationDate(date)', () => {
    context('when bf:Publication does not yet exist under bf:provisionActivity', () => {
      it('returns null')
    })
    context('when bf:Publication exist under bf:provisionActivity', () => {
      context('when bf:Publication has date', () => {
        it('returns the date')
      })
      context('when bf:Publication does not have date', () => {
        it('returns null')
      })
    })
  })

  describe('.setPublicationPlace(place)', () => {
    context('when bf:Publication does not yet exist under bf:provisionActivity', () => {
      it('creates a Publication under bf:provisionActivity with place')
    })
    context('when bf:Publication already exists under bf:provisionActivity', () => {
      context('when publication place already exists', () => {
        it('overwrites the old place with the new')
      })
      context('when publication place does not exist', () => {
        it('adds the publication place to the Publication')
      })
    })
  })

  describe('.getPublicationPlace(place)', () => {
    context('when bf:Publication does not yet exist under bf:provisionActivity', () => {
      it('returns null')
    })
    context('when bf:Publication exist under bf:provisionActivity', () => {
      context('when bf:Publication has place', () => {
        it('returns the place')
      })
      context('when bf:Publication does not have place', () => {
        it('returns null')
      })
    })
  })
})
