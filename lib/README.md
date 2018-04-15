# HyperReadings - Working API Document

HyperReadings is just a collection of standardised operations built on top of a [hyper-graph-db](hyperdb.).

# Node Operations

## predicate determined operations

container is object with
  predicate: co:containsAsHeader (optional)
  predicate: co:contains
  predicate: co:firstItem

container has operations:
  iterate:
    1. get the co:firstItem,
    2. execute cb,
    3. then if has co:nextItem follow it,
       else finished
    4. repeat 2...

## type determined operations

### po:Block
### – doco:Section
### —– doco:Title
### —– doco:Paragraph

All can be containers.

### po:Inline
### – doco:TextChunk
### – datacite:AlternateResourceIdentifier

# HyperReading level operations

This is basically type operations on `hr:root`

## reading / viewing / navigating operations

#### `hr.node(name)`

Return node object from name. If no name exists, return null?
Node object includes all operations which can be performed on the node.

#### `hr.disconnected()`

Return all nodes that are not connected to another node. This could be super expensive operation on large graphs, as you have to check every node.

eg:
```sparql
SELECT ?item
WHERE {
 ?item ?a ?b
 NOT EXISTS {
   ?c ?d ?item
 }
}
```

#### `hr.iterate(fn)`

Calls fn for each contained element.
> passes the itemContent node to fn. Perhaps pre-wrapped with hr.node(x) to allow access to all the operations of the itemContent.

#### `hr.references()`

Returns a stream of reference objects.
*? What are these? How do we deconstruct them. ?*

#### `hr.skeleton()`

Return a hierarchical representation of the hr object.
Iterating over each container, returning the nodes and types.
I am imagining this will be useful for rendering / displaying quick index view of the hyperreading object.

#### `hr.display(engine)`

*What would an engine look like?*
Perhaps a series of functions that are called in response to data.
```js
{
  'po:Inline': (element) => { /* do something */ }
}
```
or functions to determine type?
```js
function (node) {
  /* perform some analysis on the graph to determine type */
  return type
}
```

## writing

These operations will always be based on element context. Use hr.node(name) to create node object.

#### `hr.createNode(type, [properties])`

Creates a blankNode.

*Needs to be attached as the object of another triple statement to make it discoverable.*

Returns reference to newly created Node.

#### `node.insertItem(newNode, [index])`

Adds a new item to container like node.

1. inserts`< node co:contains newNode >`
2. make newItem `< newItem co:hasContent newNode >`
3. if `< node co:firstItem ? >` does not exist, insert`< node co:firstItem newItem >`
  else find lastItem of node, or not at index-1, and  insert `<lastItemNode co:nextItem > newItem >`
4. return existing node

#### `node.removeItem(nodeToDelete || index)`

Only for container like nodes

1. find node or node at index
2. get nodeToDeletes nextItem
3. delete key `< node po:contains nodeToDelete >`
4. file all references `< ? co:nextItem nodeToDelete >`
5. update all to `< ? co:nextItem nextItemOfNoteToDelete >`
6. if `< node co:firstItem nodeToDelete >` exist
   update it to `< node co:firstItem nextItemOfNoteToDelete >`

*ToDo: Factor in removing a number of items at a time*

#### `node.disconnect()`

delete all references to this node.

1. delete all keys matching `< ?a ?b node >`
2. stitch up all lists that are broken by this action
3. eg - if ?b is `firstItem` or `nextItem`
4. return node

#### `node.destroy()`

Disconnect node and then delete it and all of its children
1. node.disconnect()
2. find all `< node ?a ?b >`
3. for each check if it has other nodes connecting to it eg `< ? ? ?b >`
   if not call .destroy() on it too.

*? what happens to circular references with such an operation! ?*

#### `node.addNode(type)`

eg:
1. create newNode = `< newNode a doco:Section >`
2. node.insertItem(newNode)
3. return newNode

#### `node.attr(name, value)`

Value can be named node or rdf value.

eg:
1. delete all `< node name ? >` triples
1. create new key `< node name value >`
2. return node

*? Do we add validation ?*

*? What about updating an attribute if it already exists, sometimes we want to allow multiple values, other times singular. Should singular be the default - with removing previous values if they exist ?*

#### `node.addSection()`

Shorthand for `addNode('doco:Section')`

#### `node.addTitle()`

Shorthand for `addNode('doco:Title')`

#### `node.addParagraph()`

Shorthand for `addNode('doco:Paragraph')`

*note different types although allowing the same operations, allow renderers to display them differently.*

#### `node.addUrlLink(href)`

Perhaps:

1. add inline node eg: `node.addNode('po:Inline')`
2. create a reference node eg:
  ```js
  {
    a: 'datacite:AlternateResourceIdentifier'
    'cito:usesIdentifierScheme': 'datacite:url'
    value: href
  }
  ```
3. then attach reference to inlineNode eg: `inlineNode.attr('cito:hasIdentifier', referenceNode)`

Or if not using inline nodes to represent the text, perhaps it would be better to simple specify a { to: from: } type relationship between reference and parent nodes content.

#### `node.addMetadata()`
