/* eslint-env mocha */

var expect = require('chai').expect
var arrayToTree = require('../lib/array-to-tree')

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
      return undefined
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
      return undefined
    }
    var transform = (array) => {
      return { children: array }
    }
    expect(arrayToTree(input, hashSplitter, transform)).to.deep.eql(expected)
  })
})
