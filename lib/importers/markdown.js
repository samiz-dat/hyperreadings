const marked = require('marked')
const htmlImporter = require('./html')

function markdownImporter (hr, text) {
  const html = marked(text)
  return htmlImporter(hr, html)
}

module.exports = markdownImporter
