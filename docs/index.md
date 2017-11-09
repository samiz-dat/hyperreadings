# README.md
_Last edited: 9 November 2017_

## Introduction

How might we ensure the survival and availability of community libraries, individual collections, and other precarious archives? If these libraries, archives, and collections are unwanted by official institutions or, worse, buried beneath good intentions and bureaucracy, then what tools and platforms and queer institutions might we develop instead?

While trying to both formulate and respond to these questions, we began making Dat Library (DatDatDat?!) and HyperReadings:

**Dat Library** distributes libraries across many computers so that many people can provide disk space and bandwidth, sharing in the labour and responsibility of the archival infrastructure.

**HyperReadings** implements "reading lists", or a structured set of pointers (a list, a syllabus, a bibliography, etc.) into one or more libraries, _activating_ the archives.

## Installation

The easiest way to get started is to install [Dat Library as a desktop app](http://dat-dat-dat-library.hashbase.io), but there is also a program called [datcat](http://github.com/sdockray/dat-cardcat) that can be run on the command-line or included in other NodeJS projects.

## Accidents of the Archive

The 1996 UNESCO publication, [Lost Memory - Libraries and Archives Destroyed in the Twentieth Century](http://www.stephenmclaughlin.net/ph-library/texts/UNESCO%201996%20-%20Lost%20Memory_%20Libraries%20and%20Archives%20Destroyed%20in%20the%20Twentieth%20Century.pdf), makes the fragility of historical repositories startlingly clear. "[A]cidified paper that crumbles to dust, leather, parchment, film and magnetic light attacked by light, heat humidity or dust" all assault archives. "Floods, fires, hurricanes, storms, earthquakes" and, of course, "acts of war, bombardment and fire, whether deliberate or accidental" wiped out significant portions of many hundreds of major research libraries worldwide. When expanding the scope to consider public, private, and community libraries, that number becomes uncountable.

Published during the early days of the World Wide Web, the report acknowledges the emerging role of digitization ("online databases, CD-ROM etc."), but today we might reflect on the last 20 years, which has also introduced new forms of loss.

Digital archives and libraries are subject to a number of potential hazards: technical accidents like disk failures, accidental deletions, misplaced data, imperfect migrations; and political-economic accidents like defunding of the hosting insitution, deaccessioning parts of the collection, and sudden restriction of access rights. Immediately after library.nu was shut down on the grounds of copyright infringement in 2012, [Lawrence Liang wrote](https://kafila.online/2012/02/19/library-nu-r-i-p/) of feeling "first and foremost as a visceral experience of loss."

Whatever its legal status, the abrupt absence of a collection 400,000 books emerged as a prototype for the 21st century. In 2008, Aaron Swartz moved millions of U.S. federal court documents out from behind a paywall resulting in a trial and FBI investigation. Three years later he was arrested and indicted for a similar gesture, systematically downloading academic journal articles from JSTOR. That year, Kazakhstani scientist Alexandra Elbakyan began Sci-Hub in response to scientific journal articles that were prohibitively expensive for scholars based outside of Western academic institutions. The repository, growing to more than 60 millions papers, was sued in 2015 by Elsevier for $15 million resulting and a permanent injunction. Library Genesis, another library of comparable scale, finds itself in a similar legal predicament.

The simple fact is that some of these libraries are among the largest in the world and also subject to sudden disappearance. We can only begin to grope at what the contours of "Lost Memory - Libraries and Archives Destroyed in the Twenty-First Century" will be when it is written 90 years from now.

**What about commercial examples, the ironic example of Orwell's 1984 (and animal farm) being quitely removed from peoples Kindles over night because of commercial agreement with the publisher. http://www.nytimes.com/2009/07/18/technology/companies/18amazon.html**

## Non-profit, non-state archives

Cultural and social movements have produced histories which are only partly represented in state libraries and archives. Often they are deemed too small or insignificant or, in some cases, dangerous. Most frequently, they are not deemed anything at all - they are simply neglected. While the market, eager for any new resources to exploit, might occasionally fill in the gaps, it is ultimately motivated by profit and not by responsibility to communities or archives.

So what happens to these minor libraries? They are innumerable, but for the sake of argument let's say that each could be respresented by a single book. Gathered together, these books would form a great library (in both importance and scale). But to return this image to reality, these books fly off their shelves to the furthest reaches of the world, their covers fling open and the pages themselves scatter into bookshelves and basements, into the caring hands of relatives or small institutions devoted to passing these archives on to future generations.

While the massive digital archives listed above (library.nu, Library Genesis, Sci-Hub, etc.) could play the role of the library of libraries, they tend to be defined more as sites for [biblioleaks](https://www.jmir.org/2014/4/e112/). Furthermore, given the vulnerability of  these archives, we ought to look for alternative approaches that do not rule out using their resources, but also do not _depend_ on them.

Dat Library takes the concept of "a library of libraries" not to manifest it in a single, universal library, but to realize it progressively and partially with different individuals, groups, and institutions.

## Archival properties

So far, the emphasis of this README has been on _durability_; and the "accidents of the archive" have been instances of destruction and loss. The persistence of an archive is, however, no guarantee of its _accessibility_, a common reality in digital libraries where access management is ubiquitous. Official institutions police access to their archives vigilantly for the ostensible purpose of preservation, but ultimately creating a rarified relationship between the archives and their publics. Disregarding this precious tendency, we also introduce _adaptability_ as a fundamental consideration in the making of the projects, Dat Library and HyperReadings.

To adapt is to fit something for a new purpose. It emphasizes that the archive is not a dead object of research but a set of possible tools waiting to be activated in new circumstances. This is always a possibility of an archive, but we want to treat this possibility as desirable, as the horizon towards which these projects move. We know how infrastructures can attenuate desire and simply just make things difficult. We want to actively encourage radical reuse.

In the following section, we don't define these properties but rather discuss how we implement (or fail to implement) them in software, while highlighting some of the potential difficulties introduced.

### Durability

In 1964, in the midst of the "loss" of the twentieth-century, Paul Baran's RAND Corporation publication [On Distributed Communications](https://www.rand.org/content/dam/rand/pubs/research_memoranda/2006/RM3420.pdf) examined "redundancy as one means of building ... highly survivable and reliable communications systems," thus midwifing the military foundations of the digital networks that we operate within today. While the underlying framework of the internet generally follows distributed principles, the client-server/ request-response model of the HTTP protocol is highly centralized in practice and is only as durable as the server.

**(redundancy as a concept needs explaining - not a term people commonly understood as its meant in this context.)**

Dat Library is built on the [Dat Protocol](https://github.com/datproject/docs/blob/master/papers/dat-paper.md), a peer-to-peer protocol for syncing folders of data. It is not the first distributed protocol (BitTorrent is the most well-known and is noted as an inspiration for Dat) nor is it the only new one being developed today (IPFS, or Inter-Planetary File System is often referenced in comparison) but it is unique in the foundational goals of preserving scientific knowledge as a public good. Dat's provocation is that by creating custom infrastructure it will be possible to overcome the accidents that restrict access to scientific knowledge. We would specifically acknowledge here the role that the Dat community - any community around a protocol - has in the formation of the world that is built on top of that protocol.

When running Dat Library, a person sees their list of libraries. These can be thought of as similar to a torrent, where items are stored across many computers. This means that many people will share in the provision of disk space and bandwidth for a particular library, and that when one of them loses electricity or drops their computer, the library will not also break. Although this is a technical claim, one that's been made from Baran to BitTorrent, it is more importantly a social claim: the users and lovers of a library will share the library. More than that, they will share in the work of ensuring that it will continue to be shared.

**(This is not dissimilar to the process of reading generally, where knowledge is distributed and maintained through readers sharing and referencing the books important to them.)

### Accessibility

In the world of the web, durability is synonymous with accessibility - if something can't be accessed, it doesn't exist. Here, we disentangle the two in order to consider _access_ independent from questions of resilience.

Technically Accessible (

> When you have created a new library in Dat, a unique 64-digit "key" will automatically be generated for it. An example key is 6f963e59e9948d14f5d2eccd5b5ac8e157ca34d70d724b41cb0f565bc01162bf, which points to a library of texts. In order for someone else to see the library you have created, you must provide them your library’s unique key (by email, chat, on paper, or you could publish it on your website). In short, _you_ manage access to the library by copying that key; and then every key holder also manages access _ad infinitum_.

> At the moment this has its limitations. A Dat is only writable by a single creator. If you want to collaboratively develop a library or reading list, you need to have a single administrator managing its contents. This will change in the near future with the integration of [hyperdb](https://github.com/mafintosh/hyperdb) into Dat’s core. This will enable multiple contributors and management of permissions. Our single key will become a key chain.

> How is this any different from knowing the domain name of a website? If a site isn't indexed by Google and has a suitably unguessable domain name, then isn't that effectively the same degree of privacy? Yes, and this is precisely why the metaphor of the key is so apt (with whom do you share the key to your apartment?) but also why it is limited. With the key, one not only has access to enter the library, but access to completely reproduce the library.

)

Its important to note that accessibility is not always about indiscriminate open access.

// how do I frame knowledge traditions.

- Write something about interaction between indigenous knowledge traditions and western knowledge traditions. The uncomfortable tension that is pragmatically necessary to address is it is an ongoing and real co-existence. [Australian Indigenous Knowledge and Libraries](https://epress.lib.uts.edu.au/system/files_force/Aus%20Indigenous%20Knowledge%20and%20Libraries.pdf?download=1) Power of access and management in the hands of the community itself. (perhaps reference the importance of open source nature)

- Write about infinite hospitality. In thinking about accessibility Ranganathan's idea - originally in relation to cataloging - extending to software / systems generally. Developing an architecture which accommodates uses outside of the intention for which it was initially developed. How can many knowledge traditions co-exist e.g. [Mapping of the Universe of Knowledge in Different Classification Schemes](http://ijkcdt.net/xml/10973/10973.pdf) and [Infinite Hospitality](http://www.dextersinister.org/MEDIA/PDF/InfiniteHospitality.pdf) – what does our schema ? classification look like?
  hyper readings as a simple agnostic layer on which communities can build there own application layers.

- this is not just about tech. Its about developing situations and contexts, the technology is always secondary. A support to real need.

- write about accessibility in regards to tools for discovery - how do we navigate the mass of information? Manage the accumulation. Etc...

For some communities, it is important to both be able to determine who has access to their archives and to continue to have access themselves.



### Adoptability (ability to use/ modify as one’s own)

## Use cases

We began work on Dat Library and HyperReadings with a range of exemplary use cases, real-world circumstances in which these projects might intervene. Not only would the use cases make demands on the software we were and still are beginning to write, but it would also give us demands to make on the Dat protocol, which is still in its formative development. And crucially, in an iterative feedback loop, this process of design produces transformative effects on those situations described in the use cases themselves, resulting in further new circumstances and new demands.

### Thorunka

Wendy Bacon and Chris Nash made us aware of Thorunka and Thor.

Thorunka and Thor were two underground papers in the early 70’s which spewed out from a censorship controversy surrounding the University of NSW student newspaper Tharunka. Between 1971 to 1973 the student magazine was under focused attack from the NSW state police with several arrests were made on charges of obscenity and indecency. Rather than ceding to the charges, this prompted a large and sustained political protest from Sydney activists, writers, lawyers, students and others, of which Thorunka and Thor were central.

> "The campaign contested the idea of obscenity and the legitimacy of the legal system itself. The newspapers campaigned on the war in Vietnam, Aboriginal land rights, women’s and gay liberation, and the violence of the criminal justice system. By 1973 the censorship regime in Australia was broken. Nearly all the charges were dropped." – [Words from here](http://107.org.au/event/tharunka-thor-journalism-politics-art-1970-1973/)

Although the collection of Tharunkas are largely accessible via Trove(insert link), the subsequent issues of Thorunka, and later Thor, are not. For us this demonstrates clearly how collection themselves can encourage modes of reading. If you focus on Tharunka as a singular and long standing periodical, this significant political moment is rendered almost invisible. ...... Wendy and Chris have kindly allowed us to make their personal collection available via Dat Library (insert key).

### Academia.edu alternative

Academia.edu, started in 2008, has raised tens of millions of dollars as a social networks for academics to share their publications. As a for-profit venture, it is rife with metrics and it attempts to capitalize on the innate competition and self-promotion of precarious knowledge workers in the academy. It is both popular and despised: popular because it fills an obvious desire to share the fruits of ones intellectual work, but despised for the neoliberal atmosphere that pervades every design decision and automated correspondence. It is, however, just trying to provide a return on investment.

It is incredibly easy for any scholar running Dat Library to make a library of their own publications and post the key to their faculty web page, Facebook profile, or business card. The tricky - and interesting - thing would be to develop platforms that aggregate thousands of these libraries in direct competition with Academia.edu. This way, individuals would maintain control over their own work; their peer groups would assist in mirroring it; and no one would be capitalizing on the sale of data related to their performance and popularity.

### Syllabus

The syllabus is the manifesto of the twenty-first century. From [Your Baltimore Syllabus](https://apis4blacklives.wordpress.com/2015/05/01/your-baltimore-syllabus/) to [#StandingRockSyllabus](https://nycstandswithstandingrock.wordpress.com/standingrocksyllabus/) to [Women and gender non-conforming people writing about tech](https://docs.google.com/document/d/1Qx8JDqfuXoHwk4_1PZYWrZu3mmCsV_05Fe09AtJ9ozw/edit), syllabi are being produced as provocations [tbc...]

### Publication format

In writing this README, we have string together several references through the text that we are writing. The writing might be published in a book and the references will be listed as words at the bottom of the page or at the end of the text. But the writing might just as well be published as a HyperReadings object, providing the reader with an archive of all the things we referred to and an editable version of this text.

A new text-editor could be created for this new publication format, not to mention a new form of publication, which bundles together a set of HyperReadings texts, producing a universe of texts and references. Each HyperReadings text might reference others, of course, generating something that begins to feel like a serverless World Wide Web.

### Self-education

## Proposition

### Role of individuals
### Role of institutions
