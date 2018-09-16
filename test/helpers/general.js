import ram from 'random-access-memory'
import hyperreadings from '../../lib/hyperreadings'

export function ramHyperReadings () {
  return hyperreadings(() => ram())
}

export function collect (stream) {
  const data = []
  return new Promise((resolve, reject) => {
    stream.on('data', data.push.bind(data))
    stream.on('end', () => resolve(data))
    stream.on('error', reject)
  })
}
