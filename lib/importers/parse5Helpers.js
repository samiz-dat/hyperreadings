function * iterator (node) {
  if (!node.childNodes || node.childNodes.length === 0) return
  for (let child of node.childNodes) {
    yield child
    yield * iterator(child)
  }
}

function accumulator (node, reducer, ctx) {
  const itr = iterator(node)
  let c = itr.next().value
  while (c) {
    ctx = reducer(ctx, c)
    c = itr.next().value
  }
  return ctx
}

export function textContent (node) {
  return accumulator(node, (prev, child) => {
    if (child.nodeName === '#text') return prev + child.value
    // maybe should not do this.. but lets roll with it for now
    else if (child.nodeName === 'br') return prev + '\n'
    return prev
  }, '')
}

export function attr (node, name) {
  if (!node || !node.attrs) return undefined
  const attr = node.attrs.find(attr => attr.name === name)
  return attr && attr.value
}
