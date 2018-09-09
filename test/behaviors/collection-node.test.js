/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings, collect } from '../helpers/general'

describe('Collection Node', () => {
  let hr
  let collection
  describe('.stream()', () => {
    context('with no pagination', () => {
      before(async () => {
        hr = ramHyperReadings()
        collection = await hr.createCollection('wonderful')
        for (var i = 0; i < 4; i++) {
          await collection.addItem(`item${i}`)
        }
      })
      context('with default options', () => {
        it('returns a stream of all items in the collection', async () => {
          const items = await collect(collection.stream())
          expect(items).to.have.length(4)
          const expected = Array.from({ length: 4 }, (v, i) => `item${i}`)
          expect(items).to.have.members(expected)
        })
      })
      context('with opts.limit', () => {
        it('returns items up to the limit', async () => {
          const limit = 2
          const items = await collect(collection.stream({ limit }))
          expect(items).to.have.length(2)
        })
      })
    })
    context('no items', () => {
      before(async () => {
        hr = ramHyperReadings()
        collection = await hr.createCollection('wonderful')
      })
      context('with default options', () => {
        it('returns a stream of all items in the collection', async () => {
          const items = await collect(collection.stream())
          expect(items).to.have.length(0)
        })
      })
      context('with opts.limit', () => {
        it('returns items up to the limit', async () => {
          const limit = 2
          const items = await collect(collection.stream({ limit }))
          expect(items).to.have.length(0)
        })
      })
    })
    context('with 4 pages and 6 items per page (Literals)', () => {
      before(async () => {
        hr = ramHyperReadings()
        collection = await hr.createCollection('wonderful')
        for (var i = 0; i < 4; i++) {
          // console.log('new page', i)
          const page = await collection.addNewPage()
          for (var j = 0; j < 6; j++) {
            // console.log('new item', j)
            await page.addItem(`page${i}-item${j}`)
          }
        }
      })
      context('with default options', () => {
        it('returns a stream of all items in the collection', async () => {
          const items = await collect(collection.stream())
          expect(items).to.have.length(4 * 6)
          const expected = Array.from({ length: 4 * 6 }, (v, i) => `page${Math.floor(i / 6)}-item${i % 6}`)
          expect(items).to.have.members(expected)
        })

        it('returns values in page order', async () => {
          const items = await collect(collection.stream())
          expect(items).to.have.length(4 * 6)
          items.forEach((v, i) => {
            expect(v).to.match(new RegExp(`^page${Math.floor(i / 6)}-`))
          })
        })
      })
      context('with opts.limit', () => {
        it('returns items up to the limit', async () => {
          const limit = 1
          const items = await collect(collection.stream({ limit }))
          expect(items).to.have.length(limit)
          const expected = Array.from({ length: limit }, (v, i) => `page${Math.floor(i / 6)}-item${i % 6}`)
          expect(items).to.have.members(expected)
        })

        it('returns values in page order', async () => {
          const limit = 10
          const items = await collect(collection.stream({ limit }))
          expect(items).to.have.length(limit)
          items.forEach((v, i) => {
            expect(v).to.match(new RegExp(`^page${Math.floor(i / 6)}-`))
          })
        })
      })
    })
  })
})
