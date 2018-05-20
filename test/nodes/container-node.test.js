/* eslint-env mocha */
import { expect } from 'chai'
import { ramHyperReadings } from '../helpers/general'
// var utils = require('../lib/utils')
// var fs = require('fs')

async function confirmIteration (container, expected) {
  let count = 0
  await container.iterate(async (node) => {
    expect(node.type).to.eql('doco:Paragraph')
    expect(node.name).to.eql(expected[count])
    count++
  })
  expect(count).to.eql(expected.length)
}

async function confirmContent (container, expected) {
  const contents = await container.contains()
  expect(contents).to.have.length(expected.length)
  expect(contents.map(v => v.name)).to.include.all.members(expected)
}

async function confirmIterationAndContent (container, expected) {
  // check iteration
  await confirmIteration(container, expected)
  // check contains
  await confirmContent(container, expected)
}

describe('ContainerNode', () => {
  let hr
  beforeEach(done => {
    // const file = fs.readFileSync('./reading-lists/hyper-graph-db-research.md')
    hr = ramHyperReadings()
    hr.on('ready', done)
  })

  describe('.iterate(fn)', async () => {
    context('with empty container', () => {
      it('does not call callback', async () => {
        const c = await hr.createNode('doco:Section')
        await c.iterate(async () => {
          throw new Error('Should not invoke function')
        })
      })
    })
    context('with empty container that once had content but is now empty', () => {
      it('does not call callback (with removeNodeAt)', async () => {
        const c = await hr.createNode('doco:Section')
        const p = await hr.createNode('doco:Paragraph')
        await c.insertNode(p)
        let count = 0
        await c.iterate(() => { count++ })
        expect(count).to.eql(1)
        await c.removeNodeAt(0)
        await c.iterate(async () => {
          throw new Error('Should not invoke function')
        })
      })
      it('does not call callback (with removeNodesFrom)', async () => {
        const c = await hr.createNode('doco:Section')
        const p = await hr.createNode('doco:Paragraph')
        await c.insertNode(p)
        let count = 0
        await c.iterate(() => { count++ })
        expect(count).to.eql(1)
        await c.removeNodesFrom(0)
        await c.iterate(async () => {
          throw new Error('Should not invoke function')
        })
      })
    })
  })

  describe('insert()', () => {
    it('inserts new nodes', async () => {
      const c = await hr.createNode('doco:Section')
      for (var i = 0; i < 4; i++) {
        const p = await hr.createNode('doco:Paragraph')
        await p.set('rdf:value', i)
        await c.insertNode(p)
      }

      let count = 0
      await c.iterate(async (node) => {
        const v = await node.get('rdf:value')
        expect(node.type).to.eql('doco:Paragraph')
        expect(v).to.eql(count)
        count++
      })
      expect(count).to.eql(4)
    })
  })

  describe('.at(index, [opts])', () => {
    let c
    context('without opts', () => {
      context('with empty container', () => {
        beforeEach(async () => {
          c = await hr.createNode('doco:Section')
        })
        it('returns null if no content at that index', async () => {
          const node = await c.at(0)
          expect(node).to.eql(null)
        })
        it('returns null if no content at that index (again)', async () => {
          const node = await c.at(2000)
          expect(node).to.eql(null)
        })
      })
      context('with content in container', () => {
        let initialData = []
        beforeEach(async () => {
          c = await hr.createNode('doco:Section')
          initialData = []
          /* insert nodes */
          for (var i = 0; i < 4; i++) {
            const p = await hr.createNode('doco:Paragraph')
            initialData.push(p.name)
            await c.insertNode(p)
          }
        })
        it('returns content at index', async () => {
          let node = await c.at(0)
          expect(node.name).to.eql(initialData[0])
          node = await c.at(1)
          expect(node.name).to.eql(initialData[1])
          node = await c.at(3)
          expect(node.name).to.eql(initialData[3])
        })
        it('returns null if no content at that index', async () => {
          const node = await c.at(2000)
          expect(node).to.eql(null)
        })
      })
    })

    context('with opts.listItems = true', () => {
      const opts = { listItems: true }
      context('with empty container', () => {
        beforeEach(async () => {
          c = await hr.createNode('doco:Section')
        })
        it('returns null if no content at that index', async () => {
          const node = await c.at(0, opts)
          expect(node).to.eql(null)
        })
      })
      context('with content in container', () => {
        let listItems = []
        beforeEach(async () => {
          c = await hr.createNode('doco:Section')
          listItems = []
          for (var i = 0; i < 4; i++) {
            const p = await hr.createNode('doco:Paragraph')
            await c.insertNode(p)
          }
          await c.iterate(async (child) => {
            listItems.push(child.name)
          }, opts)
        })
        it('returns content at index', async () => {
          let node = await c.at(0, opts)
          expect(node.name).to.eql(listItems[0])
          node = await c.at(1, opts)
          expect(node.name).to.eql(listItems[1])
          node = await c.at(3, opts)
          expect(node.name).to.eql(listItems[3])
        })
        it('returns null if no content at that index', async () => {
          const node = await c.at(2000, opts)
          expect(node).to.eql(null)
        })
      })
    })
  })

  describe('.removeNodeAt(index)', () => {
    let c
    let initialData = []
    beforeEach(async () => {
      c = await hr.createNode('doco:Section')
      initialData = []
      /* insert nodes */
      for (var i = 0; i < 5; i++) {
        const p = await hr.createNode('doco:Paragraph')
        initialData.push(p.name)
        await c.insertNode(p)
      }
    })
    it('removes node at the start', async () => {
      initialData.splice(0, 1)
      await c.removeNodeAt(0)
      await confirmIteration(c, initialData)
    })
    it('removes node in the middle', async () => {
      initialData.splice(3, 1)
      await c.removeNodeAt(3)
      await confirmIteration(c, initialData)
    })
    it('removes node at the end', async () => {
      const end = initialData.length - 1
      initialData.splice(end, 1)
      await c.removeNodeAt(end)
      await confirmIteration(c, initialData)
    })
  })

  describe('.removeNodesFrom(index)', () => {
    let c
    let initialData = []
    beforeEach(async () => {
      c = await hr.createNode('doco:Section')
      initialData = []
      /* insert nodes */
      for (var i = 0; i < 5; i++) {
        const p = await hr.createNode('doco:Paragraph')
        initialData.push(p.name)
        await c.insertNode(p)
      }
    })
    it('removes node starting from the start', async () => {
      await c.removeNodesFrom(0)
      await confirmIteration(c, [])
    })
    it('removes node starting from somewhere in the middle', async () => {
      const after = initialData.slice(0, 3)
      await c.removeNodesFrom(3)
      await confirmIteration(c, after)
    })
    it('removes node starting from the end', async () => {
      const after = initialData.slice(0, initialData.length - 1)
      await c.removeNodesFrom(initialData.length - 1)
      await confirmIteration(c, after)
    })
  })

  describe('.updateList(nodeIds)', async () => {
    context('with empty container', () => {
      it('inserts adds all node ids to the container in the order of the array', async () => {
        const c = await hr.createNode('doco:Section')
        const newData = []
        /* insert nodes */
        for (var i = 0; i < 4; i++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        // check iteration
        await confirmIterationAndContent(c, newData)
      })
    })
    context('with pre-existing container with nodes already inserted', () => {
      let c = null
      let initialData = []
      beforeEach(async () => {
        c = await hr.createNode('doco:Section')
        initialData = []
        /* insert nodes */
        for (var i = 0; i < 4; i++) {
          const p = await hr.createNode('doco:Paragraph')
          initialData.push(p.name)
          await c.insertNode(p)
        }
      })
      it('updates the list to match array (prepend only)', async () => {
        const newData = [...initialData]
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (append only)', async () => {
        const newData = []
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        newData.push(...initialData)
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (inserted in the middle)', async () => {
        const newData = initialData.slice(0, 2)
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        newData.push(...initialData.slice(2))
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (zipped insertion)', async () => {
        const data = []
        for (var j = 0; j < initialData.length; j++) {
          const p = await hr.createNode('doco:Paragraph')
          data.push(p.name)
        }
        const newData = []
        data.forEach((v, i) => {
          newData.push(v, initialData[i])
        })
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (append and prepend)', async () => {
        const newData = []
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        newData.push(...initialData)
        for (j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (empty)', async () => {
        const newData = []
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (deletions)', async () => {
        const newData = initialData.slice(1, 2)
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (deletions + preppended)', async () => {
        const newData = []
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        newData.push(...initialData.slice(1, 2))
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (deletions + appended)', async () => {
        const newData = initialData.slice(1, 2)
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (deletions + appended)', async () => {
        const newData = initialData.slice(1, 2)
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
      it('updates the list to match array (deletions + appended + preppended)', async () => {
        const newData = []
        for (var j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        newData.push(...initialData.slice(1, 2))
        for (j = 0; j < 2; j++) {
          const p = await hr.createNode('doco:Paragraph')
          newData.push(p.name)
        }
        await c.updateList(newData)
        await confirmIterationAndContent(c, newData)
      })
    })
  })

  xdescribe('remove()', async () => {
    it('removes existing node', async () => {
      const c = await hr.createNode('doco:Section')
      const inserted = []
      for (var i = 0; i < 4; i++) {
        const p = await hr.createNode('doco:Paragraph')
        inserted.push(p)
        await p.set('rdf:value', i)
        await c.insertNode(p)
      }

      inserted[1].disconnect()

      // did this actually work?
      let count = 0
      await c.iterate(async (node) => {
        // const v = await node.get('rdf:value', 1)
        expect(node.type).to.eql('doco:Paragraph')
        // expect(v).to.eql(count)
        count++
      })
      expect(count).to.eql(3)
    })
  })
})
