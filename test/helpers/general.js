import ram from 'random-access-memory'
import hyperreadings from '../../lib/hyperreadings'

export function ramHyperReadings () {
  return hyperreadings(() => ram())
}
