/* eslint-env mocha */

import { expect } from 'chai'
import arrayToTree from '../lib/array-to-tree'

describe('arrayToTree', () => {
  it('takes a flat array and makes it into a nested array', () => {
    var input = ['.', '#', '.', '.', '##', '.', '####', '.', '##', '.', '##', '.', '#', '.']
    var expected = [
      '.',
      ['#', '.', '.',
        ['##', '.',
          ['####', '.']
        ],
        ['##', '.'],
        ['##', '.']
      ],
      ['#', '.']
    ]
    var hashSplitter = (value) => {
      if (value && value[0] === '#') return value.length
      return null
    }
    expect(arrayToTree(input, hashSplitter)).to.deep.eql(expected)
  })

  it('takes optional transform function, allowing customisation of nesting', () => {
    var input = ['.', '#', '.', '.', '##', '.', '####', '.', '##', '.', '##', '.', '#', '.']
    var expected = [
      '.',
      { children: ['#', '.', '.',
        { children: ['##', '.',
          { children: ['####', '.'] }
        ] },
        { children: ['##', '.'] },
        { children: ['##', '.'] }
      ] },
      { children: ['#', '.'] }
    ]
    var hashSplitter = (value) => {
      if (value && value[0] === '#') return value.length
      return null
    }
    var transform = (array) => {
      return { children: array }
    }
    expect(arrayToTree(input, hashSplitter, transform)).to.deep.eql(expected)
  })
})
