import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

const typographyEvents = [
  { year:-15000, dateLabel:'15,000–10,000 BCE', name:'Cave Paintings, Lascaux', description:'The Lascaux cave paintings in the Dordogne, France—discovered in 1940 by teenagers—are the finest known example of Upper Paleolithic art. Rendered with mineral pigments, they depict large animals, human figures, and abstract signs. They represent early symbolic communication: a precursor to writing itself.', imageUrl:'', position:'top' },
  { year:-9000,  dateLabel:'c. 9000 BCE', name:'Natufian Incised Pebbles', description:'Incised pebbles from the Natufian culture of the Levant display deliberate marking systems—an early form of symbolic record-keeping predating formal writing by thousands of years.', imageUrl:'', position:'bottom' },
  { year:-3400,  dateLabel:'c. 3400 BCE', name:'Proto-Cuneiform Tablets', description:'Proto-cuneiform appears on clay tablets at Uruk, Mesopotamia. These are the earliest administrative records: pictographic symbols pressed into clay with a reed stylus to track commodities like grain and livestock.', imageUrl:'', position:'top' },
  { year:-3200,  dateLabel:'c. 3200 BCE', name:'Early Egyptian Hieroglyphs', description:'The earliest Egyptian hieroglyphic inscriptions appear on ivory labels and pottery from Abydos. Hieroglyphs would remain in continuous use for over 3,500 years.', imageUrl:'', position:'bottom' },
  { year:-3100,  dateLabel:'c. 3100 BCE', name:'Sumerian Pictographs', description:'Sumerian pictographic writing emerges on clay tablets at Uruk. These pictographs are the direct ancestors of cuneiform script and represent one of humanity\'s first true writing systems.', imageUrl:'', position:'top' },
  { year:-3000,  dateLabel:'c. 3000 BCE', name:"King Zet's Ivory Tablet", description:'One of the earliest examples of hieroglyphic inscription, found at Abydos, demonstrating the rapid formalisation of Egyptian writing under the early pharaohs.', imageUrl:'', position:'bottom' },
  { year:-2800,  dateLabel:'c. 2800 BCE', name:'Cuneiform Rotated 90°', description:'Sumerian scribes rotate pictographic signs 90 degrees for faster writing on horizontal clay tablets, accelerating the abstraction of symbols from pictorial origins.', imageUrl:'', position:'top' },
  { year:-2600,  dateLabel:'c. 2600 BCE', name:'Enheduanna: First Named Author', description:'Enheduanna, daughter of Sargon of Akkad, becomes the earliest known named author in recorded history. She composed hymns to the goddess Inanna, inscribed in cuneiform.', imageUrl:'', position:'bottom' },
  { year:-2000,  dateLabel:'c. 2000 BCE', name:'Proto-Sinaitic Alphabet', description:'The Proto-Sinaitic script, found in the turquoise mines of Sinai, is among the earliest evidence of an alphabetic system—the common ancestor of Phoenician, Hebrew, Arabic, Greek, and all Western alphabets.', imageUrl:'', position:'top' },
  { year:-1050,  dateLabel:'c. 1050 BCE', name:'Phoenician Alphabet', description:'The Phoenician alphabet—a consonantal abjad of 22 letters—spreads through Mediterranean trade. It is the direct ancestor of Greek, Latin, Hebrew, Arabic, and all modern European scripts.', imageUrl:'', position:'bottom' },
  { year:-800,   dateLabel:'c. 800 BCE', name:'Greek Alphabet with Vowels', description:'The Greeks adapt Phoenician script and add vowel letters—a revolutionary innovation making literacy far more accessible. The Greek alphabet is the direct ancestor of Latin, Cyrillic, and Coptic scripts.', imageUrl:'', position:'top' },
  { year:-700,   dateLabel:'c. 700 BCE', name:'Latin Alphabet Emerges', description:'The Latin alphabet, derived from the Etruscan adaptation of Greek script, is established in Rome. With 23 letters (J, U, W added later), it becomes the most widely used writing system in history.', imageUrl:'', position:'bottom' },
  { year:-197,   dateLabel:'197 BCE', name:'Rosetta Stone Inscribed', description:'The Rosetta Stone is inscribed with a decree by Ptolemy V in three scripts: Hieroglyphics, Demotic, and Greek. Discovered by Napoleon\'s troops in 1799, it became the key to deciphering Egyptian hieroglyphics.', imageUrl:'', position:'top' },
  { year:100,    dateLabel:'c. 100 CE', name:'Roman Imperial Capitals', description:'The monumental inscribed capitals of Imperial Rome—seen on Trajan\'s Column (113 CE)—represent the apex of Roman letterform design. Their carefully modulated proportions became the model for Renaissance and all subsequent Western type design.', imageUrl:'', position:'bottom' },
  { year:105,    dateLabel:'105 CE', name:'Paper Invented (Cai Lun)', description:'Chinese court official Cai Lun refines papermaking using bark, hemp, and rags. Paper gradually replaces papyrus and bamboo, transforming the storage and transmission of written knowledge.', imageUrl:'', position:'top' },
  { year:800,    dateLabel:'c. 800 CE', name:'Carolingian Minuscule', description:'Charlemagne, with scholar Alcuin of York, standardises Carolingian minuscule—a clear, legible lowercase script across the Frankish Empire. It is the direct ancestor of modern lowercase letters.', imageUrl:'', position:'bottom' },
  { year:1040,   dateLabel:'1040 CE', name:'Bi Sheng: Movable Type in Clay', description:'Chinese inventor Bi Sheng creates the world\'s first movable type system using baked clay characters. The concept predates Gutenberg by four centuries.', imageUrl:'', position:'top' },
  { year:1450,   dateLabel:'c. 1450 CE', name:"Gutenberg's Printing Press", description:'Johannes Gutenberg develops a practical system of movable metal type and oil-based ink in Mainz, Germany. His Gutenberg Bible (c. 1455) marks the beginning of mass communication and the democratisation of literacy in Europe.', imageUrl:'', position:'bottom' },
  { year:1470,   dateLabel:'1470 CE', name:'Nicolas Jenson: Roman Type', description:'Venetian printer Nicolas Jenson designs what many consider the most beautiful roman typeface of the incunabula period. His harmonious letterforms became the model for centuries of type designers.', imageUrl:'', position:'top' },
  { year:1501,   dateLabel:'1501 CE', name:'First Italic Type', description:'Francesco Griffo cuts the first italic typeface for Aldus Manutius. Originally intended to save space in pocket editions, italic type becomes a standard typographic complement.', imageUrl:'', position:'bottom' },
  { year:1540,   dateLabel:'c. 1540 CE', name:"Claude Garamond's Roman Types", description:'French punchcutter Claude Garamond creates refined roman typefaces setting the European standard. Garamond types remain in use today—Adobe Garamond and EB Garamond are popular contemporary revivals.', imageUrl:'', position:'top' },
  { year:1722,   dateLabel:'1722 CE', name:"William Caslon's Typefaces", description:'London punchcutter William Caslon creates the typeface bearing his name—a workhorse roman with warmth and legibility. Caslon type was used in the first printing of the US Declaration of Independence.', imageUrl:'', position:'bottom' },
  { year:1757,   dateLabel:'1757 CE', name:"John Baskerville's Types", description:'Birmingham businessman John Baskerville designs a refined transitional typeface with higher contrast and sharper serifs. Though controversial in his time, Baskerville\'s types are now beloved classics.', imageUrl:'', position:'top' },
  { year:1784,   dateLabel:'1784 CE', name:'Didot & Bodoni: The Modern Face', description:'Firmin Didot in Paris and Giambattista Bodoni in Parma independently create "modern" typefaces with extreme thick-thin contrast and hairline serifs—the high-fashion look of the Neoclassical era.', imageUrl:'', position:'bottom' },
  { year:1816,   dateLabel:'1816 CE', name:'First Sans-Serif Typeface', description:'William Caslon IV publishes the first known sans-serif typeface. Initially dismissed as eccentric, sans-serifs would not gain wide acceptance until the early 20th century.', imageUrl:'', position:'top' },
  { year:1886,   dateLabel:'1886 CE', name:'Linotype Machine Invented', description:'Ottmar Mergenthaler demonstrates the Linotype at the New York Tribune. It casts entire lines of type as a single metal slug, dramatically speeding newspaper composition.', imageUrl:'', position:'bottom' },
  { year:1898,   dateLabel:'1898 CE', name:'Akzidenz Grotesk', description:'Berthold Type Foundry releases Akzidenz Grotesk—the first widely adopted sans-serif typeface. Its neutral, functional form becomes the model for 20th-century grotesks and, ultimately, Helvetica.', imageUrl:'', position:'top' },
  { year:1916,   dateLabel:'1916 CE', name:'Johnston Sans: London Underground', description:'Edward Johnston designs a typeface for the London Underground—arguably the first purpose-built corporate typeface. Its geometric humanist forms inspired Gill Sans and influenced all subsequent sans-serif design.', imageUrl:'', position:'bottom' },
  { year:1927,   dateLabel:'1927 CE', name:'Futura (Paul Renner)', description:'Paul Renner\'s Futura—a geometric sans-serif based on circle, triangle, and square—is released by Bauer Type Foundry. It becomes the defining modernist typeface, used by Volkswagen, IKEA, and inscribed on the Apollo 11 plaque.', imageUrl:'', position:'top' },
  { year:1928,   dateLabel:'1928 CE', name:'Gill Sans', description:'Eric Gill designs Gill Sans for Monotype. It becomes the BBC\'s typeface, Penguin Books\' text face, and British Rail\'s signage font.', imageUrl:'', position:'bottom' },
  { year:1932,   dateLabel:'1932 CE', name:'Times New Roman', description:'Stanley Morison and Victor Lardent design Times New Roman for The Times of London. It becomes the most widely used typeface of the 20th century.', imageUrl:'', position:'top' },
  { year:1957,   dateLabel:'1957 CE', name:'Helvetica & Univers', description:'Max Miedinger releases Helvetica in Switzerland; Adrian Frutiger releases Univers the same year. Together they define the International Typographic Style and mid-century corporate modernism.', imageUrl:'', position:'bottom' },
  { year:1984,   dateLabel:'1984 CE', name:'Macintosh & Desktop Publishing', description:'Apple launches the Macintosh with bitmapped fonts and a graphical interface. With the LaserWriter (1985) and PageMaker, it ignites the desktop publishing revolution.', imageUrl:'', position:'top' },
  { year:1991,   dateLabel:'1991 CE', name:'Verdana & Georgia', description:'Type designer Matthew Carter creates Verdana and Georgia for Microsoft, designed specifically for legibility on low-resolution screens. They become the most widely read typefaces in digital history.', imageUrl:'', position:'bottom' },
  { year:1994,   dateLabel:'1994 CE', name:'OpenType Developed', description:'Adobe and Microsoft jointly develop the OpenType format—a cross-platform font file with support for expanded character sets, ligatures, and advanced typographic features.', imageUrl:'', position:'top' },
  { year:2009,   dateLabel:'2009 CE', name:'Google Fonts Launches', description:'Google launches its free web font service, growing into the world\'s largest font delivery platform and making thousands of open-source typefaces freely available.', imageUrl:'', position:'bottom' },
  { year:2016,   dateLabel:'2016 CE', name:'Variable Fonts (OpenType 1.8)', description:'Apple, Google, Microsoft, and Adobe jointly introduce variable fonts: a single file containing a continuous range of weights, widths, and optical sizes.', imageUrl:'', position:'top' },
  { year:2020,   dateLabel:'2020 CE', name:'Inter: De Facto Screen Standard', description:'Rasmus Andersson\'s Inter becomes the most widely used typeface in digital product design—appearing in thousands of apps, dashboards, and operating systems worldwide.', imageUrl:'', position:'bottom' },
  { year:2024,   dateLabel:'2024 CE', name:'Type in 3D: Spatial Computing', description:'Apple Vision Pro and spatial computing introduce typography in three-dimensional environments. Letterforms must now work at variable focal depths and across mixed-reality contexts.', imageUrl:'', position:'top' },
]

const historicalEvents = [
  { year:-10000, dateLabel:'c. 10000 BCE', name:'End of last Ice Age' },
  { year:-8000,  dateLabel:'c. 8000 BCE',  name:'Neolithic Period begins' },
  { year:-4000,  dateLabel:'c. 4000 BCE',  name:'Bronze Age begins' },
  { year:-3500,  dateLabel:'c. 3500 BCE',  name:'Sumerians settle Mesopotamia' },
  { year:-2560,  dateLabel:'c. 2560 BCE',  name:'Great Pyramid built' },
  { year:-776,   dateLabel:'776 BCE',       name:'First Olympic Games' },
  { year:-753,   dateLabel:'753 BCE',       name:'Rome founded' },
  { year:-551,   dateLabel:'551 BCE',       name:'Confucius born' },
  { year:-44,    dateLabel:'44 BCE',        name:'Julius Caesar assassinated' },
  { year:476,    dateLabel:'476 CE',        name:'Fall of Western Rome' },
  { year:1066,   dateLabel:'1066 CE',       name:'Battle of Hastings' },
  { year:1215,   dateLabel:'1215 CE',       name:'Magna Carta signed' },
  { year:1347,   dateLabel:'1347 CE',       name:'Black Death reaches Europe' },
  { year:1492,   dateLabel:'1492 CE',       name:'Columbus reaches Americas' },
  { year:1776,   dateLabel:'1776 CE',       name:'American Independence' },
  { year:1789,   dateLabel:'1789 CE',       name:'French Revolution' },
  { year:1859,   dateLabel:'1859 CE',       name:'Darwin: Origin of Species' },
  { year:1861,   dateLabel:'1861 CE',       name:'US Civil War' },
  { year:1876,   dateLabel:'1876 CE',       name:'Telephone invented' },
  { year:1895,   dateLabel:'1895 CE',       name:"Lumière Bros: first film" },
  { year:1903,   dateLabel:'1903 CE',       name:'Wright Brothers fly' },
  { year:1914,   dateLabel:'1914 CE',       name:'World War I begins' },
  { year:1939,   dateLabel:'1939 CE',       name:'World War II begins' },
  { year:1969,   dateLabel:'1969 CE',       name:'Moon landing' },
  { year:1989,   dateLabel:'1989 CE',       name:'Berlin Wall falls' },
  { year:2001,   dateLabel:'2001 CE',       name:'9/11; Wikipedia founded' },
  { year:2007,   dateLabel:'2007 CE',       name:'iPhone introduced' },
  { year:2020,   dateLabel:'2020 CE',       name:'COVID-19 pandemic' },
  { year:2022,   dateLabel:'2022 CE',       name:'ChatGPT launched' },
]

const artMovements = [
  { startYear:-500,  endYear:-300,  datesLabel:'500–300 BCE',    name:'Classical Greek',          description:'Classical Greek art produced idealised sculpture and the mature Greek alphabet. The proportioned letterforms of this era became models for all Western type design.' },
  { startYear:1400,  endYear:1600,  datesLabel:'1400–1600',      name:'Renaissance',              description:'The Renaissance revived classical Roman letterforms, producing the first humanist typefaces. Jenson, Manutius, and Garamond defined an aesthetic of clarity and proportion central to typography ever since.' },
  { startYear:1600,  endYear:1750,  datesLabel:'1600–1750',      name:'Baroque',                  description:'Baroque exuberance manifested in ornate title pages, decorated initials, and early display advertising.' },
  { startYear:1750,  endYear:1820,  datesLabel:'1750–1820',      name:'Neoclassicism',            description:'Neoclassicism\'s rationalism produced the "modern" typefaces of Didot and Bodoni—mathematical precision, extreme contrast, hairline serifs.' },
  { startYear:1820,  endYear:1900,  datesLabel:'1820–1900',      name:'Victorian Era',            description:'Industrialisation produced an explosion of display typefaces alongside chromolithographic posters of great visual complexity.' },
  { startYear:1848,  endYear:1915,  datesLabel:'1848–1915',      name:'Arts & Crafts',            description:'William Morris founded the Kelmscott Press, creating Troy and Chaucer typefaces based on 15th-century Venetian models. He elevated the book to a work of art.' },
  { startYear:1890,  endYear:1910,  datesLabel:'1890–1910',      name:'Art Nouveau',              description:'Art Nouveau brought flowing organic ornament to typography and poster art. Alphonse Mucha\'s lettering represents the style\'s apogee.' },
  { startYear:1909,  endYear:1944,  datesLabel:'1909–1944',      name:'Futurism',                 description:'Italian Futurism celebrated speed through radical typographic experiments—diagonal setting, multiple typefaces on a page, words as images.' },
  { startYear:1916,  endYear:1923,  datesLabel:'1916–1923',      name:'Dada',                     description:'Dada embraced anti-rational typography: random letter arrangements, clashing type, typographic collage.' },
  { startYear:1917,  endYear:1931,  datesLabel:'1917–1931',      name:'Constructivism',           description:'Russian Constructivism brought pure geometry to typography—primary colours, right angles, asymmetric layouts.' },
  { startYear:1919,  endYear:1933,  datesLabel:'1919–1933',      name:'Bauhaus',                  description:'The Bauhaus school transformed typography as part of its total design philosophy. Herbert Bayer and Joost Schmidt defined a new visual language that remains influential today.' },
  { startYear:1925,  endYear:1940,  datesLabel:'1925–1940',      name:'Art Deco',                 description:'Art Deco brought geometric glamour to commercial typography—condensed letterforms, zigzag ornament.' },
  { startYear:1950,  endYear:1975,  datesLabel:'1950–1975',      name:'International Style',      description:'The Swiss International Typographic Style—grid layouts, sans-serif type (Helvetica, Univers)—became the house style of corporate modernism worldwide.' },
  { startYear:1970,  endYear:1990,  datesLabel:'1970–1990',      name:'Postmodernism',            description:'Postmodern typography rejected Modernist rationalism, embracing eclecticism, layering, irony, and deliberate illegibility.' },
  { startYear:1985,  endYear:1995,  datesLabel:'1985–1995',      name:'Grunge Typography',        description:'Digital tools enabled deliberately rough, layered typography. David Carson\'s Ray Gun magazine made illegibility a design virtue.' },
  { startYear:1995,  endYear:2010,  datesLabel:'1995–2010',      name:'Early Digital',            description:'Early web and screen constraints created a distinct pixel-font aesthetic. Designers embraced rather than fought pixelation.' },
  { startYear:2010,  endYear:2020,  datesLabel:'2010–2020',      name:'Flat Design & Product UI', description:'iOS 7, Material Design, and the rise of product design put typographic hierarchy at the centre of interface work.' },
  { startYear:2018,  endYear:2026,  datesLabel:'2018–present',   name:'Variable & Expressive',    description:'Variable fonts, colour fonts, and AI-assisted design are reshaping the field. Custom typefaces are key brand differentiators.' },
]

async function main() {
  console.log('Seeding database...')

  await prisma.typographyEvent.deleteMany()
  await prisma.historicalEvent.deleteMany()
  await prisma.artMovement.deleteMany()

  const typo = await prisma.typographyEvent.createMany({ data: typographyEvents })
  const hist = await prisma.historicalEvent.createMany({ data: historicalEvents })
  const art  = await prisma.artMovement.createMany({ data: artMovements })

  console.log(`  ✓ ${typo.count} typography events`)
  console.log(`  ✓ ${hist.count} historical events`)
  console.log(`  ✓ ${art.count} art movements`)
  console.log('Done.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
