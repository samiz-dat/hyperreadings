## Zotero Types:

- **Artwork**: `artwork`
  http://purl.org/spar/fabio/ArtisticWork
- **Audio Recording**: `audioRecording`
  http://purl.org/spar/fabio/SoundRecording
- **Blog Post**: `blogPost`
  http://purl.org/spar/fabio/BlogPost
- **Book**: `book`
  http://purl.org/spar/fabio/Book
- **Book Section**: `bookSection`
  http://purl.org/spar/fabio/BookChapter
- **Computer Program**: `computerProgram`
  http://purl.org/spar/fabio/ComputerProgram
- **Conference Paper**: `conferencePaper`
  http://purl.org/spar/fabio/ConferencePaper
- **Dictionary Entry**: `dictionaryEntry`
   http://purl.org/spar/fabio/Entry
- **Document**: `document`
  http://purl.org/spar/fabio/Expression
- **E-mail**: `email`
  http://purl.org/spar/fabio/Email
- **Encyclopedia Article**: `encyclopediaArticle` ?
- **Film**: `film`
  http://purl.org/spar/fabio/Film
- **Forum Post**: `forumPost`
  http://purl.org/spar/fabio/WebContent
- **Journal Article**: `journalArticle`
  http://purl.org/spar/fabio/JournalArticle
- **Letter**: `letter`
  http://purl.org/spar/fabio/Letter
- **Magazine Article**: `magazineArticle`
  http://purl.org/spar/fabio/MagazineArticle
- **Manuscript**: `manuscript`
  http://purl.org/spar/fabio/Manuscript
- **Map**: `map`
   http://purl.org/spar/fabio/StillImage
- **Newspaper Article**: `newspaperArticle`
  http://purl.org/spar/fabio/NewspaperArticle
- **Patent**: `patent`
  http://purl.org/spar/fabio/Patent
- **Podcast**: `podcast`
  http://purl.org/spar/fabio/AudioDocument
- **Presentation**: `presentation`
  http://purl.org/spar/fabio/Presentation
- **Report**: `report`
  http://purl.org/spar/fabio/ReportDocument
- **Thesis**: `thesis`
  http://purl.org/spar/fabio/Thesis
- **Video Recording**: `videoRecording`
  http://purl.org/spar/fabio/MovingImage
- **Web Page**: `webpage`
  http://purl.org/spar/fabio/WebPage

**These types are ignored for now:**

- **Bill**: `bill`
- **Case**: `case`
- **Hearing**: `hearing`
- **Instant Message**: `instantMessage`
- **Interview**: `interview`
- **Note**: `note`
- **Radio Broadcast**: `radioBroadcast`
- **Statute**: `statute`
- **TV Broadcast**: `tvBroadcast`

There is no Type in BibFrame2.0. Instead we should translate these into Content, Media, and Carrier fields . For example: https://rdabasics.com/2012/09/10/content-media-and-carrier-fields/

`Work -> content -> [ Content -> rdf:value -> x ]`

`[Work or Instance] -> media -> [ Media -> rdf:value -> x ]`

`Instance -> carrier -> [ Carrier -> rdf:value -> x ]`

`[Work or Instance] -> issuance -> <http://id.loc.gov/vocabulary/issuance>`

Issuance will likely be one of the following:

- integrating resource
 > A resource that is added to or changed by means of updates that do not remain discrete and are integrated into the whole. Examples include updating loose-leafs and updating Web sites. Integrating resources may be finite or continuing.
- multipart monograph
 >A resource issued in two or more parts, either simultaneously or successively, that is complete or intended to be completed within a finite number of parts
- serial
 > A resource issued in successive parts, usually bearing numbering, that has no predetermined conclusion.
- single unit
 > A resource that is complete in one part or intended to be completed within a finite number of parts.

BibFrame2.0 basic structure is:

`Work -> hasInstance -> [Instance -> hasItem -> Item ]`


## Zotero Type Fields


#### `itemType` 

This is a standard zotero type as above

#### `relations` 

This is an array of ids pointing to other zotero items

#### `collections` 

This is an array of ids pointing to other zotero items 

`[Work, Instance or Item] -> partOf -> [Work, Instance or Item]`

#### `tags` 

???? - This corresponds with subject generally
Can be translated into `[Work, Instance or Item] -> subject -> Literal`

#### `shortTitle`

http://purl.org/spar/fabio/hasShortTitle

Short form of the title, often without the subtitle. Used mostly in footnote styles for subsequent citations

`[Work, Instance or Item] -> title -> [ AbbreviatedTitle -> rdfs:label title ]`

#### `creators` 

- http://purl.org/dc/terms/creator

`creators` is an array of:

```js
{
  firstName: "First",
  lastName: "Last",
  name: "Name"
}
```

Creators have has roles:

Mapping to Marc Roles in comments.
Look at https://www.loc.gov/marc/relators/relacode.html and http://memory.loc.gov/diglib/loc.terms/relators/dc-contributor.html for details.

```js
{
  artist: 'Artist', // art - Artist
  contributor: 'Contributor', // ctb - Contributor
  performer: 'Performer', // prf - Performer
  composer: 'Composer', // cmp - Composer
  wordsBy: 'Words By', // lyr - Lyricist
  sponsor: 'Sponsor', // spn - Sponsor
  cosponsor: 'Cosponsor', // spn - Sponsor
  author: 'Author', // aut- Author
  commenter: 'Commenter', // for blog post only ? 
  editor: 'Editor', // edt - Editor
  seriesEditor: 'Series Editor', // edt - Editor
  translator: 'Translator', // trl - Translator
  bookAuthor: 'Book Author', // in chapter -> special as points to author of containing book. // aut - Author
  counsel: 'Counsel', // n/a? 
  programmer: 'Programmer', // prg - Programmer
  reviewedAuthor: 'Reviewed Author', // special - aut of the book which is subject
  recipient: 'Recipient',  // rcp - Addressee
  director: 'Director', // drt - Director
  producer: 'Producer', // pro - Producer
  scriptwriter: 'Scriptwriter', // aus - Screenwriter
  interviewee: 'Interview With', // ive - Interviewee
  interviewer: 'Interviewer', // ivr - Interviewer
  cartographer: 'Cartographer', // ctg - Cartographer
  inventor: 'Inventor', // inv - Inventor
  attorneyAgent: 'Attorney/Agent', // ?
  podcaster: 'Podcaster', // hst - Host
  guest: 'Guest', // ?
  presenter: 'Presenter', // pre - Presenter
  castMember: 'Cast Member' // prf - Performer
}
```

`[Work, Instance or Item] -> contribution -> [ Contribution -> role -> a-marc-relator, -> agent -> Agent ]`

Where `Agent` may be a `Person` which is a subclass of FOAF.
See: http://xmlns.com/foaf/spec/#term_Person

#### `extra` 

This field will often contain other data eg: https://www.zotero.org/support/kb/item_types_and_fields#citing_fields_from_extra

#### `abstractNote` 

-  http://purl.org/dc/terms/abstract

`[Work or Instance] -> summary -> Summary`

#### `rights` 

- http://purl.org/dc/terms/rights

`[Work or Instance] -> copyrightRegistration -> CopyrightRegistration`

#### `url` 

- http://purl.org/spar/fabio/hasURL

`Item -> electronicLocator -> url`

#### `accessDate` 

- http://purl.org/spar/fabio/hasAccessDate

This is really only related to citation data.

#### `title` 

This is not within types: `case` `email` `statute` 

- http://purl.org/dc/terms/title

`[Work, Instance or Item] -> title -> [ Title -> rdfs:label -> x ]`

#### `language` 

This is not within types: `computerProgram` `note` 

-  http://purl.org/dc/terms/language

`[ unspecified ] -> bf:language <http://id.loc.gov/vocabulary/languages/eng>`

Should probably use controlled data from here: http://id.loc.gov/vocabulary/languages.html


#### `date`

This is not within types: `case` `note` `patent` `podcast` `statute`

 - http://purl.org/dc/terms/date

`Instance -> provisionActivity -> [ Publication -> date -> value ]`

#### `callNumber`

This is only within the types: `artwork` `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `document` `encyclopediaArticle` `film` `interview` `journalArticle` `letter` `magazineArticle` `manuscript` `map` `newspaperArticle` `radioBroadcast` `report` `thesis` `tvBroadcast` `videoRecording`


`Item -> shelfMark -> [ ShelfMark -> rdfs:label -> callNumber ]`

`ShelfMark` should also have bf:source for where the number has come from.

#### `archiveLocation`

This is only within the types: `artwork` `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `document` `encyclopediaArticle` `film` `interview` `journalArticle` `letter` `magazineArticle` `manuscript` `map` `newspaperArticle` `radioBroadcast` `report` `thesis` `tvBroadcast` `videoRecording`

`Item -> physicalLocation -> value`

#### `archive`

This is only within the types: `artwork` `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `document` `encyclopediaArticle` `film` `interview` `journalArticle` `letter` `magazineArticle` `manuscript` `map` `newspaperArticle` `radioBroadcast` `report` `thesis` `tvBroadcast` `videoRecording`

`Item -> heldBy -> [ Agent ]`

Where `Agent` is the archive which holds this item

#### `libraryCatalog`

This is only within the types: `artwork` `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `document` `encyclopediaArticle` `film` `interview` `journalArticle` `letter` `magazineArticle` `manuscript` `map` `newspaperArticle` `radioBroadcast` `report` `thesis` `tvBroadcast` `videoRecording`


`Instance -> source -> [ Source ]`

#### `place`

This is only within the types: `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `encyclopediaArticle` `hearing` `manuscript` `map` `newspaperArticle` `patent` `presentation` `radioBroadcast` `report` `thesis` `tvBroadcast` `videoRecording`

`Instance -> provisionActivity -> [ProvisionActivity -> place [ Place -> rdfs:label -> "Edinburgh, Scotland" ]]`

ProvisionActivity would include date and place info.


#### `pages`

This is only within the types: `bookSection` `conferencePaper` `dictionaryEntry` `encyclopediaArticle` `hearing` `journalArticle` `magazineArticle` `newspaperArticle` `patent` `report` `statute`

http://prismstandard.org/namespaces/basic/2.0/pageRange

Difficult to figure this one out.

Page numbers are stored in mark here under enumeration - https://www.loc.gov/marc/bibliographic/bd76x78x.html
It uses SICI as a standard for encoding the page range - [view the standard here](https://groups.niso.org/apps/group_public/download.php/6514/Serial%20Item%20and%20Contribution%20Identifier%20(SICI).pdf)

Maybe should be stored in Enumeration and Chronology

#### `volume`

This is only within the types: `audioRecording` `book` `bookSection` `conferencePaper` `dictionaryEntry` `encyclopediaArticle` `journalArticle` `magazineArticle` `videoRecording`

http://purl.org/spar/fabio/hasSequenceIdentifier

TODO:

#### `ISBN`

This is only within the types: `audioRecording` `book` `bookSection` `computerProgram` `conferencePaper` `dictionaryEntry` `encyclopediaArticle` `map` `videoRecording`

http://prismstandard.org/namespaces/basic/2.0/isbn

`[unspecified] -> identifiedBy -> [Isbn -> rdf:value -> number]`

#### `publisher`

This is only within the types: `book` `bookSection` `conferencePaper` `dictionaryEntry` `document` `encyclopediaArticle` `hearing` `map`

`[Work or Instance] -> provisionActivity -> [Publication -> agent -> [Agent -> rdfs:label "Oxford University Press"]] `

#### `numberOfVolumes`

This is only within the types: `audioRecording` `book` `bookSection` `dictionaryEntry` `encyclopediaArticle` `hearing` `videoRecording`
 - http://purl.org/spar/fabio/hasVolumeCount

`[Work or Instance] -> hasSeries -> [[Work or Instance] -> seriesEnumeration -> Literal ]`

#### `seriesTitle`

This is only within the types: `audioRecording` `computerProgram` `journalArticle` `map` `podcast` `report` `videoRecording`

  - http://purl.org/vocab/frbr/core#partOf - http://purl.org/spar/fabio/Series / http://purl.org/spar/fabio/JournalIssue etc with title


Zotero docs:
> Title of a series of articles within one issue of a journal (e.g., a special section or “From the Cover”). “Section Title” would likely be a more appropriate label. See [here](http://dtd.nlm.nih.gov/publishing/tag-library/2.2/n-ihv0.html) for an explanation. For citation purposes, this field is currently equivalent to “Series” and is erroneously used instead of series in some item types (e.g., Audio Recording, Map).

`[Work or Instance] -> ofPart -> [[Work or Instance] -> title -> Title ]`


#### `runningTime`

This is only within the types: `audioRecording` `film` `podcast` `radioBroadcast` `tvBroadcast` `videoRecording`

- http://purl.org/dc/terms/format

`[Work or Instance] -> duration -> Literal`

#### `edition`

This is only within the types: `book` `bookSection` `dictionaryEntry` `encyclopediaArticle` `map` `newspaperArticle`



#### `series`

This is only within the types: `book` `bookSection` `conferencePaper` `dictionaryEntry` `encyclopediaArticle` `journalArticle`',

`[Work or Instance] -> hasSeries -> [[Work or Instance] -> title -> Title ]`

#### `history`

This is only within the types: `bill` `case` `hearing` `statute`

 - ignored

#### `seriesNumber`

This is only within the types: `book` `bookSection` `dictionaryEntry` `encyclopediaArticle`',

`[Work or Instance] -> seriesEnumeration -> Literal`

#### `session`

This is only within the types: `bill` `hearing` `statute` 

- ignored

#### `section`

This is only within the types: `bill` `newspaperArticle` `statute`

- http://prismstandard.org/namespaces/basic/2.0/section

- ignore for now

#### `numPages`

This is only within the types: `book` `manuscript` `thesis`

- http://purl.org/spar/fabio/hasPageCount

`Instance -> extent -> [ Extent -> rdfs:label -> "viii, 235 p." ]`

#### `videoRecordingFormat`

This is only within the types: `film` `tvBroadcast` `videoRecording`

- http://purl.org/dc/terms/format

`Instance -> videoCharacteristic -> [VideoFormat -> rdfs:label -> '8mm']`

#### `publicationTitle`

This is only within the types: `journalArticle` `magazineArticle` `newspaperArticle`

`[Work, Instance or Item] -> partOf -> [ [Work, Instance or Item] -> title -> [ Title -> mainTitle -> x ] ]`

#### `ISSN`

This is only within the types: `journalArticle` `magazineArticle` `newspaperArticle`

 - http://prismstandard.org/namespaces/basic/2.0/issn

`[unspecified] -> identifiedBy -> [Issn -> rdf:value -> number]`

#### `episodeNumber`

This is only within the types: `podcast` `radioBroadcast` `tvBroadcast`

-- ignore for now - but likely Enumeration and Chronology

#### `DOI`

This is only within the types: `conferencePaper` `journalArticle`
// or as `extra` field DOI:

http://prismstandard.org/namespaces/basic/2.0/doi 

`[unspecified] -> identifiedBy -> [Doi -> rdf:value -> number]`

#### `network`

This is only within the types: `radioBroadcast` `tvBroadcast`

- ignored

#### `legislativeBody`

This is only within the types: `bill` `hearing`

- ignored

#### `issue`

This is only within the types: `journalArticle` `magazineArticle`

`Item -> enumerationAndChronology -> [ Enumeration -> rdfs:label -> 2]`

#### `code`

This is only within the types: `bill` `statute`

- ignored

#### `websiteType`

This is only within the types: `blogPost` `webpage`',

-- ignored

> Rarely used. Describes the genre of a webpage such as “personal blog” or “intranet”.

#### `programTitle`

This is only within the types: `radioBroadcast` `tvBroadcast`

`[Work, Instance or Item] -> partOf -> [ [Work, Instance or Item] -> title -> [ Title -> mainTitle -> x ] ]`

#### `audioRecordingFormat`

This is only within the types: `audioRecording` `radioBroadcast`

- ignore for now

#### `caseName`

This is only within the types: `case` 

- ingored

#### `reporter`

This is only within the types: `case` 

- ingored

#### `reporterVolume`

This is only within the types: `case` 

- ingored

#### `court`

This is only within the types: `case` 

- ingored

#### `docketNumber`

This is only within the types: `case` 

- ingored

#### `firstPage`

This is only within the types: `case` 

- ingored

#### `dateDecided`

This is only within the types: `case` 

- ingored

#### `versionNumber`

This is only within the types: `computerProgram`

- http://prismstandard.org/namespaces/basic/2.0/versionIdentifier


`[Instance] -> editionStatement -> Literal`

#### `blogTitle`

This is only within the types: blogPost', -  http://purl.org/dc/terms/title

`[Work, Instance or Item] -> partOf -> [ [Work, Instance or Item] -> title -> [ Title -> mainTitle -> x ] ]`

#### `company`

This is only within the types: `computerProgram`

`Unspecified -> agent -> [Organization -> rdfs:label -> x ]`

#### `programmingLanguage`

This is only within the types: `computerProgram`

#### `proceedingsTitle`

This is only within the types: `conferencePaper`',

#### `conferenceName`

This is only within the types: `conferencePaper`',

#### `websiteTitle`

This is only within the types: `webpage`,

`[Work, Instance or Item] -> partOf -> [ [Work, Instance or Item] -> title -> [ Title -> mainTitle -> x ] ]`

#### `dictionaryTitle`

This is only within the types: `dictionaryEntry`,

`[Work, Instance or Item] -> partOf -> [ [Work, Instance or Item] -> title -> [ Title -> mainTitle -> x ] ]`

#### `subject`

This is only within the types: `email`,



#### `encyclopediaTitle`

This is only within the types: encyclopediaArticle',

#### `distributor`

This is only within the types: film',

#### `genre`

This is only within the types: film',

#### `codeVolume`

This is only within the types: bill', - ignored

#### `forumTitle`

This is only within the types: forumPost', http://purl.org/dc/terms/title

#### `postType`

This is only within the types: forumPost',

#### `committee`

This is only within the types: hearing', - ignored

#### `documentNumber`

This is only within the types: hearing', - ignored

#### `interviewMedium`

This is only within the types: interview', - ignored

#### `label`

This is only within the types: audioRecording',

#### `codePages`

This is only within the types: bill', - ignored

#### `seriesText`

This is only within the types: journalArticle',

#### `journalAbbreviation`

This is only within the types: journalArticle',

#### `artworkMedium`

This is only within the types: artwork',

#### `letterType`

This is only within the types: letter',

#### `manuscriptType`

This is only within the types: manuscript',

#### `mapType`

This is only within the types: map',

#### `scale`

This is only within the types: map',

#### // `note`

This is only within the types: note',

#### `country`

This is only within the types: patent',

#### `assignee`

This is only within the types: patent',

#### `issuingAuthority`

This is only within the types: patent',

#### `patentNumber`

This is only within the types: patent',

#### `filingDate`

This is only within the types: patent',

#### `applicationNumber`

This is only within the types: patent',

#### `priorityNumbers`

This is only within the types: patent',

#### `issueDate`

This is only within the types: patent',

#### `references`

This is only within the types: patent',

#### `legalStatus`

This is only within the types: patent',

#### `artworkSize`

This is only within the types: artwork',

#### `audioFileType`

This is only within the types: `podcast`

#### `presentationType`

This is only within the types: `presentation`

#### `meetingName`

This is only within the types: `presentation`

#### `bookTitle`

This is only within the types: `bookSection`

#### `billNumber`

This is only within the types: bill - ignored

#### `reportNumber`

This is only within the types: report

#### `reportType`

This is only within the types: report

#### `institution`

This is only within the types: report

#### `nameOfAct`

This is only within the types: statute - ignore

#### `codeNumber`

This is only within the types: statute - ignored

#### `publicLawNumber`

This is only within the types: statute - ignored

#### `dateEnacted`

This is only within the types: statute - ignored

#### `thesisType`

This is only within the types: thesis

#### `university`

This is only within the types: thesis

#### `studio`

This is only within the types: videoRecording

#### `system`

This is only within the types: computerProgram'

