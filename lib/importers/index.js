import htmlImporter from './html'
import markdownImporter from './markdown'
import zoteroApiImporter from './zoteroApi'

export default {
  // ttl: todo importer
  // rdf: todo importer
  md: markdownImporter,
  html: htmlImporter,
  zoteroApi: zoteroApiImporter
}
