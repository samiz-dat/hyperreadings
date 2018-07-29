/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'
import { spo } from '../../lib/utils'

describe('InstanceNode', () => {
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
})
