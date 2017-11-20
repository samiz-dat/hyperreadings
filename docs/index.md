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

Digital archives and libraries are subject to a number of potential hazards: technical accidents like disk failures, accidental deletions, misplaced data, imperfect data migrations; and political-economic accidents like defunding of the hosting insitution, deaccessioning parts of the collection, and sudden restriction of access rights. Immediately after library.nu was shut down on the grounds of copyright infringement in 2012, [Lawrence Liang wrote](https://kafila.online/2012/02/19/library-nu-r-i-p/) of feeling "first and foremost as a visceral experience of loss."

**(perhaps some where here this may find somewhere here.)**
Arguably one of the largest digital archives of the "avant-garde" (loosely defined), UbuWeb is transparent about this fragility. In 2011 [Kenneth Goldsmith wrote](http://www.ubu.com/resources/), "But by the time you read this, UbuWeb may be gone. [...] Never meant to be a permanent archive, Ubu could vanish for any number of reasons: our ISP pulls the plug, our university support dries up, or we simply grow tired of it." Even the banality of exhaustion is a real risk to these libraries.

Whatever its legal status, the abrupt absence of a collection 400,000 books emerged as a prototype for the 21st century **(not sure what you mean by this and how it connects to swarts? Library.nu came after swartz moved documents)**. In 2008, Aaron Swartz moved millions of U.S. federal court documents out from behind a paywall resulting in a trial and FBI investigation. Three years later he was arrested and indicted for a similar gesture, systematically downloading academic journal articles from JSTOR. That year, Kazakhstani scientist Alexandra Elbakyan began Sci-Hub in response to scientific journal articles that were prohibitively expensive for scholars based outside of Western academic institutions. The repository, growing to more than 60 millions papers, was sued in 2015 by Elsevier for $15 million resulting and a permanent injunction. Library Genesis, another library of comparable scale, finds itself in a similar legal predicament.

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

Capitalism places a high value on originality and novelty, exemplified in Art where the ultimate insult would to be "redundant". Worse than being derivative or merely unoriginal, being redundant means having no reason to exist. A uselessness that even Art can't tolerate. It means wasting a perfectly good opportunity to be creative or innovative. In a relational network, on the other hand, redundancy is a mode of support. It doesn't stimulate competition and capture its effects, but rather it is a product of cooperation. <strike>While this attitude of redundancy arose within a Western military context, one can't help but notice that the shared resources, mutual support, and common infrastructure seem fundamentally communist in nature. Computer networks are not fundamentally exploitative or equitable, but they are used in specific ways and they operate within particular economies. A redundant network of interrelated, mutually supporting computers running mostly open-source software can be the guts of an advanced capitalist engine, like Facebook. So could it be possible to organize our networked devices, embedded as they are in capitalist economy, in an anti-capitalist way?</strike>

Dat Library is built on the [Dat Protocol](https://github.com/datproject/docs/blob/master/papers/dat-paper.md), a peer-to-peer protocol for syncing folders of data. It is not the first distributed protocol (BitTorrent is the most well-known and is noted as an inspiration for Dat) nor is it the only new one being developed today (IPFS, or Inter-Planetary File System is often referenced in comparison) but it is unique in the foundational goals of preserving scientific knowledge as a public good. Dat's provocation is that by creating custom infrastructure it will be possible to overcome the accidents that restrict access to scientific knowledge. We would specifically acknowledge here the role that the Dat community - any community around a protocol, for that matter - has in the formation of the world that is built on top of that protocol.

When running Dat Library, a person sees their list of libraries. These can be thought of as similar to a torrent, where items are stored across many computers. This means that many people will share in the provision of disk space and bandwidth for a particular library, and that when one of them loses electricity or drops their computer, the library will not also break. Although this is a technical claim, one that's been made from Baran to BitTorrent, it is more importantly a social claim: the users and lovers of a library will share the library. More than that, they will share in the work of ensuring that it will continue to be shared.

**(This is not dissimilar to the process of reading generally, where knowledge is distributed and maintained through readers sharing and referencing the books important to them.)

### Accessibility

In the world of the web, durability is synonymous with accessibility - if something can't be accessed, it doesn't exist. Here, we disentangle the two in order to consider _access_ independent from questions of resilience.

##### Technically Accessible

When you have created a new library in Dat, a unique 64-digit "key" will automatically be generated for it. An example key is `6f963e59e9948d14f5d2eccd5b5ac8e157ca34d70d724b41cb0f565bc01162bf`, which points to a library of texts. In order for someone else to see the library you have created, you must provide them your library’s unique key (by email, chat, on paper, or you could publish it on your website). In short, _you_ manage access to the library by copying that key; and then every key holder also manages access _ad infinitum_.

At the moment this has its limitations. A Dat is only writable by a single creator. If you want to collaboratively develop a library or reading list, you need to have a single administrator managing its contents. This will change in the near future with the integration of [hyperdb](https://github.com/mafintosh/hyperdb) into Dat’s core. This will enable multiple contributors and management of permissions. Our single key will become a key chain.

How is this key any different from knowing the domain name of a website? If a site isn't indexed by Google and has a suitably unguessable domain name, then isn't that effectively the same degree of privacy? Yes, and this is precisely why the metaphor of the key is so apt (with whom do you share the key to your apartment?) but also why it is limited. With the key, one not only has the ability to _enter_ the library, but also to completely _reproduce_ the library.

##### Consenting Accessibility

When we say "accessibility", some hear, "information wants to be free"; but our idea of accessibility is not about indiscriminate open access to everything. While we do support, in many instances, the desire to increase access to knowledge where it has been restricted by monopoly property ownership, or the urge to increase transparency in delegated decision-making and representative government, we also recognize that Indigenous knowledge traditions often depend on ownership, control, consent, and secrecy in the hands of the traditions' people. [see ["Managing Indigenous Knowledge and
Indigenous Cultural and Intellectual Property"](https://epress.lib.uts.edu.au/system/files_force/Aus%20Indigenous%20Knowledge%20and%20Libraries.pdf?download=1), pg 83] Accessibility understood in merely quantative terms isn't able to reconcile these positions, which this is why we refuse to limit "access" to a question of technology.

While "digital rights management" technologies have been developed almost exclusively for protecting the commercial interests of capitalist property owners within Western Intellectual Property regimes, many of the assumptions and technological implementations are inadequate for the protection of Indigenous knowledge. Rather than describing access in terms of commodities and ownership of copyright, it might be defined by membership, status, or role within a tribe, and the rules of access would not be managed by an generalized legal system but by the rules and traditions of the people and their knowledge. [["The Role of Information Technologies in Indigenous Knowledge Management"](https://epress.lib.uts.edu.au/system/files_force/Aus%20Indigenous%20Knowledge%20and%20Libraries.pdf?download=1), 101-102] These rights would not expire, nor would they be bought and sold, because they are shared, held in common.

It is important, while imagining the possibilities of a technological protocol, to consider how different _cultural protocols_ might be implemented and protected through the life of a project like Dat Library. Certain aspects of this might be accomplished through library metadata, but ultimately it is through people hosting their own archives and libraries (rather than, for example, having them hosted by a state institution) that cultural protocols can be translated and reproduced. Perhaps we should flip the typical question of how might a culture exist within digital networks to ask how should digital networks operate within cultural protocols?


- Write about infinite hospitality. In thinking about accessibility Ranganathan's idea - originally in relation to cataloging - extending to software / systems generally. Developing an architecture which accommodates uses outside of the intention for which it was initially developed. How can many knowledge traditions co-exist e.g. [Mapping of the Universe of Knowledge in Different Classification Schemes](http://ijkcdt.net/xml/10973/10973.pdf) and [Infinite Hospitality](http://www.dextersinister.org/MEDIA/PDF/InfiniteHospitality.pdf) – what does our schema ? classification look like?
  hyper readings as a simple agnostic layer on which communities can build there own application layers.

- write about accessibility in regards to tools for discovery - how do we navigate the mass of information? Manage the accumulation. Etc...


### Adoptability (ability to use/ modify as one’s own)

Durability and accessibility are the foundation for adoptability. Many would say that this is a contradiction, that adoption is about use and transformation and those qualities operate against the preservationist grain of durability, that one must always be at the expense of the other. We say: perhaps that is true, but it is a risk we're willing to take because we don't want to be making monuments and cemeteries that people approach with reverence or fear. We want tools and stories that we use and adapt and are always making new again. But we also say: it is through use that something becomes invaluable, which may change or distort but will not destroy - which is the practical definition of durability. S.R. Ranganathan's very first Law of Library Science was "BOOKS ARE FOR USE", which we would extend to the library itself, such that when he arrives at his final law, "THE LIBRARY IS A LIVING ORGANISM", we note that to live means not only to change, but to live means to live _in the world_.

## Use cases

We began work on Dat Library and HyperReadings with a range of exemplary use cases, real-world circumstances in which these projects might intervene. Not only would the use cases make demands on the software we were and still are beginning to write, but it would also give us demands to make on the Dat protocol, which is still in its formative development. And crucially, in an iterative feedback loop, this process of design produces transformative effects on those situations described in the use cases themselves, resulting in further new circumstances and new demands.

### Thorunka

Wendy Bacon and Chris Nash made us aware of Thorunka and Thor.

Thorunka and Thor were two underground papers in the early 70’s which spewed out from a censorship controversy surrounding the University of NSW student newspaper Tharunka. Between 1971 to 1973 the student magazine was under focused attack from the NSW state police with several arrests were made on charges of obscenity and indecency. Rather than ceding to the charges, this prompted a large and sustained political protest from Sydney activists, writers, lawyers, students and others, of which Thorunka and Thor were central.

> "The campaign contested the idea of obscenity and the legitimacy of the legal system itself. The newspapers campaigned on the war in Vietnam, Aboriginal land rights, women’s and gay liberation, and the violence of the criminal justice system. By 1973 the censorship regime in Australia was broken. Nearly all the charges were dropped." – [Words from here](http://107.org.au/event/tharunka-thor-journalism-politics-art-1970-1973/)

Although the collection of Tharunkas are largely accessible via Trove(insert link), the subsequent issues of Thorunka, and later Thor, are not. For us this demonstrates clearly how collection themselves can encourage modes of reading. If you focus on Tharunka as a singular and long standing periodical, this significant political moment is rendered almost invisible. ...... Wendy and Chris have kindly allowed us to make their personal collection available via Dat Library (insert key).

### Academia.edu alternative

Academia.edu, started in 2008, has raised tens of millions of dollars as a social networks for academics to share their publications. As a for-profit venture, it is rife with metrics and it attempts to capitalize on the innate competition and self-promotion of precarious knowledge workers in the academy. It is both popular and despised: popular because it fills an obvious desire to share the fruits of ones intellectual work, but despised for the neoliberal atmosphere that pervades every design decision and automated correspondence. It is, however, just trying to provide a return on investment.

[Gary Hall has written](http://www.garyhall.info/journal/2015/10/18/does-academiaedu-mean-open-access-is-becoming-irrelevant.html) that "its financial rationale rests ... on the ability of the angel-investor and venture-capital-funded professional entrepreneurs who run Academia.edu to exploit the data flows generated by the academics who use the platform as an intermediary for sharing and discovering research." Moreover, he emphasizes that in the open access world (outside of the exploitative practice of for-profit publishers like Elsevier, who charge a premium for subscriptions) the privileged position is to be the one "_who gate-keeps the data generated around the use of that content_". This lucrative position has been produced by recent "[recentralizing tendencies](http://commonstransition.org/the-revolution-will-not-be-decentralised-blockchains/)" of the internet, which in Academia's case captures various, scattered open access repositories, personal web pages, and other archives.

Is it possible to redecentralize? Can we break free of the subjectivities that Academia.edu is crafting for us as we are interpellated by its infrastructure? It is incredibly easy for any scholar running Dat Library to make a library of their own publications and post the key to their faculty web page, Facebook profile, or business card. The tricky - and interesting - thing would be to develop platforms that aggregate thousands of these libraries in direct competition with Academia.edu. This way, individuals would maintain control over their own work; their peer groups would assist in mirroring it; and no one would be capitalizing on the sale of data related to their performance and popularity.

We note that Academia.edu is a typically centripetal platform: it provides no tools for exporting one's own content, so an alternative would necessarily be a kind of centrifuge.

### Publication format

In writing this README, we have string together several references through the text that we are writing. The writing might be published in a book and the references will be listed as words at the bottom of the page or at the end of the text. But the writing might just as well be published as a HyperReadings object, providing the reader with an archive of all the things we referred to and an editable version of this text.

A new text-editor could be created for this new publication format, not to mention a new form of publication, which bundles together a set of HyperReadings texts, producing a universe of texts and references. Each HyperReadings text might reference others, of course, generating something that begins to feel like a serverless World Wide Web.

It's not even necessary to develop a new publication format, as any book might be considered as a reading list (usually in the footnotes and bibliography) with a very detailed description of the relationship between the consulted texts. What if the history of published works were considered in this way, such that we might always be able to follow a reference from one book directly into the pages of another and so on?

### Syllabus

The syllabus is the manifesto of the twenty-first century. From [Your Baltimore Syllabus](https://apis4blacklives.wordpress.com/2015/05/01/your-baltimore-syllabus/) to [#StandingRockSyllabus](https://nycstandswithstandingrock.wordpress.com/standingrocksyllabus/) to [Women and gender non-conforming people writing about tech](https://docs.google.com/document/d/1Qx8JDqfuXoHwk4_1PZYWrZu3mmCsV_05Fe09AtJ9ozw/edit), syllabi are being produced as provocations, instructions for reprogramming imaginaries. They do not announce a new world but they point out a way to get there. As a program, the syllabus shifts the burden of action onto the readers, who will either execute the program on their own fleshy operating system - or not. A text, which by nature points to other texts, the syllabus is already a relational document acknowledging its own position within a living field of knowledge. It is decidedly not self-contained; however, it often circulates as if it were.

If a syllabus circulated as a HyperReadings document, then it could point directly to the texts and other media that it aggregates. But just as easily as it circulates, a HyperReadings syllabus could be forked into new versions: the syllabus is changed because there is a new essay out; or because of a political disagreement; or because following the syllabus produced new suggestions. These forks become a family tree where one can follow branches and trace epistemological mutations.

### Self-education

## Proposition (or Presuppositions)

While the software that we have begun writing is a proposition in and of itself, there is no guarantee _how_ it will be used. But when writing, we _are_ imagining exactly that, we are making intuitive and hopeful presuppositions about how it will be used, presuppositions that amount to a set of social propositions.

### Role of individuals

Different people have different technical resources and capabilities, but everyone can contribute to an archive. By simple running the Dat Library software and adding an archive to it, a person is sharing their disk space and internet bandwidth in the service of that archive. At first, it is only the archive's index (a list of the contents) that is hosted, but if the person downloads the contents (or even just a small portion of the contents) then they are sharing in the hosting of the contents as well. Individuals, as supporters of an archive or members of a community, can organize together to guarantee the durability and accessibility of the archive. As supporters of many archives, members of many communities, they can use Dat Library to perform this function many times over.

On the Web, individuals are usually users or browsers - they use browsers. In spite of the ostensible interactivity of the medium, users are kept at a distance from the actual code, the infrastructure of a website, which is run on a server. With a distributed protocol, like Dat, applications such as Beaker Browser or Dat Library eliminate the central server, not by destroying it, but by distributing it across all of the users. Individuals are then not _just_ users, but also hosts. What kind of subject is this user-host, especially compared to the user of the server? Michel Serres writes in _The Parasite_:

> It is raining; a passer-by comes in. Here is the interrupted meal once more. Stopped for only a moment, since the traveller is asked to join the diners. His host does not have to ask him twice. He accepts the invitation and sits down in front of his bowl. The host is the satyr, dining at home; he is the donor. He calls to the passer-by, saying to him, be our guest. The guest is the stranger, the interrupter, the one who receives the soup, agrees to the meal. The host, the guest: the same word; he gives and receives, offers and accepts, invites and is invited, master and passer-by…

> An invariable term through the transfer of the gift. It might be dangerous not to decide who is the host and who is the guest, who gives and who receives, who is the parasite and who is the table d’hote, who has the gift and who has the loss, and where hospitality begins with hospitality…

Serres notes that *guest* and *host* are "the same word" in French; we might say the same for *client* and *server* in a distributed protocol. And we will embrace this multiplying hospitality, giving and taking without measure.

---

### Role of institutions

David Cameron launched a doomed initiative in 2010 called the Big Society, which paired large-scale cuts in public programs with a call for local communities to voluntarily self-organize to provide these fundamental services for themselves. This is not the political future that we should be working toward: since 2010, austerity policies have resulted in [120,000 excess deaths in England](http://bmjopen.bmj.com/content/7/11/e017722). In other words, while it might seem as though _institutions_ might be comparable to _servers_, inasmuch as both are centralized infrastructures, we should not give them up or allow them to be dismantled under the assumption that those infrastructures can simply be distributed and self-organized. On the contrary, institutions should be defended and organized in order to support the distributed protocols we are discussing.

One simple way for larger, more established institutions is through the provision of hardware, network capability, and some basic technical support to ensure the durability and accessibility of the archives. It can back up the archives of smaller institutions and groups within its own community while also giving access to its own archives so that those collections might be put to use. A network of smaller institutions, separated by great distances, might mirror eachothers' archives both as an expression of solidarity and positive redundancy as well as a means for circulating their archives, histories, and struggles amongst each of the others.

Through the provision of disk space, office space, grants, technical support, and employment, larger institutions can materially support smaller organizations, individuals and their archival afterlives. They can provide physical space and outreach for dispersed collectors gather and piece together a fragmented archive.

And what happens as more people and collections are brought in? As more of the institutional archives are allowed to circulate outside of its walls? As storage is cut loose from its dependency on the corporate cloud and into forms interdependency such as mutual support networks?




