function assign (target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key)
      return descriptors
    }, {})
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym)
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor
      }
    })
    Object.defineProperties(target, descriptors)
  })
  return target
}

export function compose (...behaviors) {
  return assign({}, ...behaviors)
}

export function createFactory (prototype, defaults) {
  return function (props) {
    const instance = Object.create(prototype)
    if (defaults) Object.assign(instance, defaults)
    return Object.assign(instance, props)
  }
}
