/* eslint-env mocha */
import parse5 from 'parse5'
import { expect } from 'chai'
import { attr, textContent } from '../../lib/importers/parse5Helpers'

describe('attr', () => {
  let node
  before(() => {
    node = parse5.parseFragment('<div id="test" data-node="something" class="class names">something</div>').childNodes[0]
  })
  it('returns a attribute value from node (id)', () => {
    console.log(node)
    const output = attr(node, 'id')
    expect(output).to.eql('test')
  })
  it('returns a attribute value from node (data-attr)', () => {
    const output = attr(node, 'data-node')
    expect(output).to.eql('something')
  })
  it('returns a attribute value from node (class)', () => {
    const output = attr(node, 'class')
    expect(output).to.eql('class names')
  })
  it('returns a attribute value from node (class)', () => {
    const output = attr(node, 'data-not-set')
    expect(output).to.eql(undefined)
  })
  it('returns undefined if node is falsy', () => {
    expect(attr()).to.eql(undefined)
  })
})

describe('textContent', () => {
  it('returns text content from node (simple)', () => {
    const fragment = '<div>so what</div>'
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('so what')
  })
  it('returns text content from node (nested)', () => {
    const fragment = '<div>deeply <h1>nested <span><strong>node</strong> <em>also</em></span> works</h1></div>'
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('deeply nested node also works')
  })
  it('returns text content from node (preserves white spaces over lines)', () => {
    const fragment = `<div>
    over
    lines
    </div>`
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('\n    over\n    lines\n    ')
  })
  it('returns text content from node (preserves white spaces)', () => {
    const fragment = '<div>    over     lines      </div>'
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('    over     lines      ')
  })
  it('returns text content from node (html breaks)', () => {
    const fragment = '<div>over</br>lines</div>'
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('over\nlines')
  })
  it('returns text content from node (html breaks unclosed)', () => {
    const fragment = '<div>over<br>lines</div>'
    const node = parse5.parseFragment(fragment).childNodes[0]
    expect(textContent(node)).to.eql('over\nlines')
  })
})
