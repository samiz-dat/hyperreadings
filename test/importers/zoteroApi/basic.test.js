/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../../helpers/general'

describe('basic zotero import behaviors', () => {
  let hr
  beforeEach(async () => {
    hr = ramHyperReadings()
  })

  describe('reuse behaviors', () => {
    context('when there is a pre-existing contribution', () => {
      it('does not unnecessarily create duplicate contributions', async () => {
        const first = await hr.importZoteroReference({
          itemType: 'The Promise of Happiness',
          creators: [{
            firstName: 'Sara',
            lastName: 'Ahmed',
            creatorType: 'author'
          }]
        })
        const second = await hr.importZoteroReference({
          itemType: 'book',
          title: 'Queer phenomenology',
          creators: [{
            firstName: 'Sara',
            lastName: 'Ahmed',
            creatorType: 'author'
          }]
        })
        expect((await first.get('bf:contribution')).name).to.eql((await second.get('bf:contribution')).name)
      })
    })

    context('when there is a pre-existing person', () => {
      it('does not unnecessarily create a new Person, but links to existing matching person', async () => {
        await hr.importZoteroReference({
          itemType: 'book',
          title: 'The Promise of Happiness',
          creators: [{
            firstName: 'Sara',
            lastName: 'Ahmed',
            creatorType: 'author'
          }]
        })
        await hr.importZoteroReference({
          itemType: 'book',
          title: 'When Species Meet',
          creators: [{
            creatorType: 'author',
            firstName: 'Donna',
            lastName: 'Haraway'
          }]
        })
        await hr.importZoteroReference({
          itemType: 'book',
          title: 'Thinking Through the Skin',
          creators: [
            {
              firstName: 'Sara',
              lastName: 'Ahmed',
              creatorType: 'editor'
            }
          ]
        })
        const people = await hr.findPeople()
        expect(people).to.have.length(2)
      })
    })

    context('when there is a pre-existing series', () => {
      it('does not unnecessarily create a new series, but links to existing matching series', async () => {
        const first = await hr.importZoteroReference({
          itemType: 'book',
          title: 'Critique of cynical reason',
          series: 'Ideology'
        })
        const second = await hr.importZoteroReference({
          itemType: 'book',
          title: 'Postmodernism, or, The Cultural Logic of Late Capitalism',
          series: 'Ideology'
        })
        const third = await hr.importZoteroReference({
          itemType: 'book',
          title: 'Dance',
          series: 'Documents of Contemporary Art'
        })
        const collection = await hr.getCollection('default')
        const references = await collect(collection.stream())
        expect(references).to.have.length(3)
        expect((await first.hasSeries()).name).is.eql((await second.hasSeries()).name)
        expect((await first.hasSeries()).name).is.not.eql((await third.hasSeries()).name)
      })
    })

    context('when there is a pre-existing subject', () => {
      // TODO: fix subjects to not use strings, but types
      // Maybe madsrdf:SimpleType - although that then opens the big question of supporting ComplexTypes
      it.skip('does not unnecessarily create duplicate subjects', async () => {
        await hr.importZoteroReference({
          itemType: 'book',
          title: 'The Promise of Happiness',
          tags: [
            { tag: 'Philosophy', type: 1 },
            { tag: 'Women\'s Studies', type: 1 },
            { tag: 'LGBT Studies', type: 1 }
          ]
        })
        await hr.importZoteroReference({
          itemType: 'book',
          title: 'Queer phenomenology',
          tags: [
            { tag: 'Social Science', type: 1 },
            { tag: 'Women\'s Studies', type: 1 },
            { tag: 'LGBT Studies', type: 1 }
          ]
        })
        expect(await hr.subjects()).to.have.length(3)
      })
    })

    context('when there is a pre-existing publication', () => {
      it('does not unnecessarily create new publication data')
    })
  })
})
