/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'
import { spo } from '../../lib/utils'

describe('InstanceNode', () => {
  let hr
  let person
  beforeEach(done => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hr = ramHyperReadings()
    hr.on('ready', async () => {
      person = await hr.createNode('bf:Person')
      done()
    })
  })
  describe('surname', () => {
    it('has getter', async () => {
      await person.setSurname('Forster')
      const surname = await person.getSurname()
      expect(surname).to.eql('Forster')
    })
  })
})
