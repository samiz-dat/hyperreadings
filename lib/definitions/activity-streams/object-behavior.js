import {
  makeGet,
  makeSet,
  makeRemove
} from '../helpers'

const ObjectBehavior = {}

// as:attachment
// as:attributedTo
// as:audience
// as:content
/*
The content or textual representation of the Object encoded as a JSON string. By default, the value of content is HTML. The mediaType property can be used in the object to indicate a different content type.
*/
ObjectBehavior.content = makeGet('as:content')
ObjectBehavior.setContent = makeSet('as:content')
ObjectBehavior.removeContent = makeRemove('as:content')

// as:context
/*
Identifies the context within which the object exists or an activity was performed.
The notion of "context" used is intentionally vague. The intended function is to serve as a means of grouping objects and activities that share a common originating context or purpose. An example could be all activities relating to a common project or event.
Range: Object | Link
*/
ObjectBehavior.context = makeGet('as:context')
ObjectBehavior.setContext = makeSet('as:context')
ObjectBehavior.removeContext = makeRemove('as:context')

// as:name
/* A simple, human-readable, plain-text name for the object. HTML markup must not be included. */
ObjectBehavior.getName = makeGet('as:name')
ObjectBehavior.setName = makeSet('as:name')
ObjectBehavior.removeName = makeRemove('as:name')

// as:endTime
// as:generator
// as:icon
// as:image
// as:inReplyTo
// as:location
// as:preview
// as:published
// as:replies
// as:startTime

// as:summary
/*  A natural language summarization of the object encoded as HTML. Multiple language tagged summaries may be provided. */
ObjectBehavior.summary = makeGet('as:summary')
ObjectBehavior.setSummary = makeSet('as:summary')
ObjectBehavior.removeSummary = makeRemove('as:summary')

// as:tag

// as:updated
/* The date and time at which the object was updated */
// TODO: should override the default set - to include an update to this field automatically

// as:url
// as:to
// as:bto
// as:cc
// as:bcc

// as:mediaType
/*
When used on a Link, identifies the MIME media type of the referenced resource.
When used on an Object, identifies the MIME media type of the value of the content property. If not specified, the content property is assumed to contain text/html content.
*/
ObjectBehavior.mediaType = makeGet('as:mediaType')
ObjectBehavior.setMediaType = makeSet('as:mediaType')
ObjectBehavior.removeMediaType = makeRemove('as:mediaType')

// as:duration

export default ObjectBehavior
