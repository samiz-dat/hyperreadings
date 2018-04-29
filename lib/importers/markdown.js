import marked from 'marked'
import htmlImporter from './html'

function markdownImporter (hr, text) {
  const html = marked(text)
  return htmlImporter(hr, html)
}

export default markdownImporter
