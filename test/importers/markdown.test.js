/* eslint-env mocha */

import { expect } from 'chai'
import markdownImporter from '../../lib/importers/markdown'
import { ramHyperReadings } from '../helpers/general'

describe('markdownImporter', () => {
  context('with very simple markdown', () => {
    let hr
    before(async () => {
      const test = '# yes\n\nno\nmaybe'
      hr = ramHyperReadings()
      return markdownImporter(hr, test)
    })
    it('contains head and body nodes', async () => {
      const expected = ['hr:head', 'hr:body']
      await hr.iterate((node) => {
        expect(node.type).to.eql(expected.shift())
      })
    })
    it('has an empty head', async () => {
      const head = await hr.head()
      await head.iterate((node) => {
        expect.fail()
      })
    })
    it('has body with single section node', async () => {
      const bodys = await hr.nodesByType('hr:body', { limit: 1 })
      const body = bodys[0]
      const expected = ['doco:Section']
      await body.iterate((node) => {
        expect(node.type).to.eql(expected.shift())
      })
    })
    it('has section to have Title and Paragraph', async () => {
      const body = await hr.body()
      const section = await body.get('po:contains')
      const expected = [
        { type: 'doco:Title', 'c4o:hasContent': 'yes' },
        { type: 'doco:Paragraph', 'c4o:hasContent': 'no\nmaybe' }]
      await section.iterate(async (node) => {
        const x = expected.shift()
        expect(node.type).to.eql(x.type)
        expect(await node.get('c4o:hasContent')).to.eql(x['c4o:hasContent'])
      })
    })
  }).timeout(5000)
})
