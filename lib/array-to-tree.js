const identity = a => a

function arrayToTree (array, splitter, transform) {
  if (!transform) transform = identity
  var depth = 0
  var nested = []
  var layers = []
  var current = nested
  var newSection
  array.forEach((child) => {
    var splitValue = splitter(child)
    if (splitValue === null) {
      // add to current array
      current.push(child)
    } else if (splitValue > depth) {
      // add current array to top of layers
      layers.push({ depth: depth, array: current })
      // update depth to latest
      depth = splitValue
      newSection = [child]
      // go one layer deeper
      current.push(transform(newSection))
      current = newSection
    } else if (splitValue <= depth) {
      // if depth >= layer depth - we add to this one
      // if depth < layer depth - we continue down the tree until we find the depth we want
      var previousLayer = layers.pop()
      while (previousLayer && previousLayer.depth >= splitValue) {
        previousLayer = layers.pop()
      }
      if (!previousLayer) {
        // current array is root
        current = nested
      } else {
        // get the array associated with depth
        layers.push(previousLayer)
        current = previousLayer.array
      }
      // add
      depth = splitValue
      newSection = [child]
      current.push(transform(newSection))
      current = newSection
    }
  })
  return nested
}

module.exports = arrayToTree
