export async function seedDatabase(db) {
  // Clear existing
  await db.executeMultiple(`
    DELETE FROM TypographyEvent;
    DELETE FROM HistoricalEvent;
    DELETE FROM ArtMovement;
  `)

  const typo = [
    [-15000,'15,000–10,000 BCE','Cave Paintings, Lascaux','The Lascaux cave paintings in the Dordogne, France—discovered in 1940 by teenagers—are the finest known example of Upper Paleolithic art. Rendered with mineral pigments, they depict large animals, human figures, and abstract signs — a precursor to writing itself.','','top'],
    [-3400,'c. 3400 BCE','Proto-Cuneiform Tablets','Proto-cuneiform appears on clay tablets at Uruk, Mesopotamia — the earliest administrative records: pictographic symbols pressed into clay with a reed stylus to track grain and livestock.','','top'],
    [-3200,'c. 3200 BCE','Early Egyptian Hieroglyphs','The earliest Egyptian hieroglyphic inscriptions appear on ivory labels from Abydos. Hieroglyphs would remain in continuous use for over 3,500 years.','','bottom'],
    [-3100,'c. 3100 BCE','Sumerian Pictographs','Sumerian pictographic writing emerges on clay tablets at Uruk — direct ancestors of cuneiform and one of humanity\'s first true writing systems.','','top'],
    [-3000,'c. 3000 BCE',"King Zet's Ivory Tablet",'One of the earliest examples of hieroglyphic inscription, found at Abydos.','','bottom'],
    [-2800,'c. 2800 BCE','Cuneiform Rotated 90°','Sumerian scribes rotate pictographic signs 90 degrees for faster writing on horizontal clay tablets.','','top'],
    [-2600,'c. 2600 BCE','Enheduanna: First Named Author','Enheduanna, daughter of Sargon of Akkad, becomes the earliest known named author. She composed hymns to the goddess Inanna in cuneiform.','','bottom'],
    [-2000,'c. 2000 BCE','Proto-Sinaitic Alphabet','Found in the turquoise mines of Sinai — the common ancestor of Phoenician, Hebrew, Arabic, Greek, and all Western alphabets.','','top'],
    [-1050,'c. 1050 BCE','Phoenician Alphabet','A consonantal abjad of 22 letters spreading through Mediterranean trade. Direct ancestor of Greek, Latin, Hebrew, Arabic, and all modern European scripts.','','bottom'],
    [-800,'c. 800 BCE','Greek Alphabet with Vowels','The Greeks add vowel letters to the Phoenician script — making literacy far more accessible and becoming the ancestor of Latin and Cyrillic.','','top'],
    [-700,'c. 700 BCE','Latin Alphabet Emerges','Derived from the Etruscan adaptation of Greek script, established in Rome. With 23 letters it becomes the most widely used writing system in history.','','bottom'],
    [-197,'197 BCE','Rosetta Stone Inscribed','Inscribed with a decree by Ptolemy V in Hieroglyphics, Demotic, and Greek. Discovered in 1799, it became the key to deciphering Egyptian hieroglyphics.','','top'],
    [100,'c. 100 CE','Roman Imperial Capitals','The monumental inscribed capitals of Trajan\'s Column represent the apex of Roman letterform design — the model for all subsequent Western type.','','bottom'],
    [105,'105 CE','Paper Invented (Cai Lun)','Cai Lun refines papermaking using bark, hemp, and rags. Paper gradually replaces papyrus and bamboo worldwide.','','top'],
    [800,'c. 800 CE','Carolingian Minuscule','Charlemagne standardises Carolingian minuscule — a clear, legible lowercase script that is the direct ancestor of modern lowercase letters.','','bottom'],
    [1040,'1040 CE','Bi Sheng: Movable Type','The world\'s first movable type system using baked clay characters — predating Gutenberg by four centuries.','','top'],
    [1450,'c. 1450 CE',"Gutenberg's Printing Press",'Johannes Gutenberg develops movable metal type in Mainz. His Gutenberg Bible marks the beginning of mass communication and democratised literacy.','','bottom'],
    [1470,'1470 CE','Nicolas Jenson: Roman Type','Venetian printer Nicolas Jenson designs what many consider the most beautiful roman typeface of the incunabula period.','','top'],
    [1501,'1501 CE','First Italic Type','Francesco Griffo cuts the first italic typeface for Aldus Manutius — originally to save space in pocket editions.','','bottom'],
    [1540,'c. 1540 CE',"Claude Garamond's Roman Types",'French punchcutter Garamond creates refined roman typefaces setting the European standard — still in use today.','','top'],
    [1722,'1722 CE',"William Caslon's Typefaces",'Caslon creates the workhorse roman used in the first printing of the US Declaration of Independence.','','bottom'],
    [1757,'1757 CE',"John Baskerville's Types",'A refined transitional typeface with higher contrast and sharper serifs — controversial in his time, beloved today.','','top'],
    [1784,'1784 CE','Didot & Bodoni: The Modern Face','Firmin Didot and Giambattista Bodoni independently create modern typefaces with extreme thick-thin contrast and hairline serifs.','','bottom'],
    [1816,'1816 CE','First Sans-Serif Typeface','William Caslon IV publishes the first known sans-serif — initially dismissed as eccentric.','','top'],
    [1886,'1886 CE','Linotype Machine Invented','Ottmar Mergenthaler\'s Linotype casts entire lines of type as a single metal slug, revolutionising newspaper production.','','bottom'],
    [1898,'1898 CE','Akzidenz Grotesk','Berthold releases the first widely adopted sans-serif — the direct ancestor of Helvetica.','','top'],
    [1916,'1916 CE','Johnston Sans: London Underground','The first purpose-built corporate typeface — inspiring Gill Sans and all subsequent humanist sans-serifs.','','bottom'],
    [1927,'1927 CE','Futura (Paul Renner)','A geometric sans-serif based on circle, triangle, and square. Used by Volkswagen, IKEA, and inscribed on the Apollo 11 plaque.','','top'],
    [1928,'1928 CE','Gill Sans','Eric Gill\'s Gill Sans becomes the BBC\'s typeface, Penguin Books\' text face, and British Rail\'s signage font.','','bottom'],
    [1932,'1932 CE','Times New Roman','Designed for The Times of London — the most widely used typeface of the 20th century.','','top'],
    [1957,'1957 CE','Helvetica & Univers','Helvetica and Univers define the International Typographic Style and mid-century corporate modernism.','','bottom'],
    [1984,'1984 CE','Macintosh & Desktop Publishing','Apple\'s Macintosh with bitmapped fonts ignites the desktop publishing revolution.','','top'],
    [1991,'1991 CE','Verdana & Georgia','Matthew Carter designs screen-optimised typefaces for Microsoft — the most widely read digital typefaces in history.','','bottom'],
    [1994,'1994 CE','OpenType Developed','Adobe and Microsoft\'s cross-platform font format with support for ligatures and advanced typographic features.','','top'],
    [2009,'2009 CE','Google Fonts Launches','The world\'s largest font delivery platform — making thousands of typefaces freely available.','','bottom'],
    [2016,'2016 CE','Variable Fonts (OpenType 1.8)','A single font file containing a continuous range of weights and widths — enabling richer, more efficient screen typography.','','top'],
    [2020,'2020 CE','Inter: De Facto Screen Standard','Rasmus Andersson\'s Inter becomes the most widely used typeface in digital product design.','','bottom'],
    [2024,'2024 CE','Type in 3D: Spatial Computing','Apple Vision Pro introduces typography in three-dimensional environments — letterforms must now work at variable focal depths.','','top'],
  ]

  const hist = [
    [-10000,'c. 10000 BCE','End of last Ice Age'],
    [-8000,'c. 8000 BCE','Neolithic Period begins'],
    [-4000,'c. 4000 BCE','Bronze Age begins'],
    [-3500,'c. 3500 BCE','Sumerians settle Mesopotamia'],
    [-2560,'c. 2560 BCE','Great Pyramid built'],
    [-776,'776 BCE','First Olympic Games'],
    [-753,'753 BCE','Rome founded'],
    [-551,'551 BCE','Confucius born'],
    [-44,'44 BCE','Julius Caesar assassinated'],
    [476,'476 CE','Fall of Western Rome'],
    [1066,'1066 CE','Battle of Hastings'],
    [1215,'1215 CE','Magna Carta signed'],
    [1347,'1347 CE','Black Death reaches Europe'],
    [1492,'1492 CE','Columbus reaches Americas'],
    [1776,'1776 CE','American Independence'],
    [1789,'1789 CE','French Revolution'],
    [1859,'1859 CE','Darwin: Origin of Species'],
    [1861,'1861 CE','US Civil War'],
    [1876,'1876 CE','Telephone invented'],
    [1895,'1895 CE',"Lumière Bros: first film"],
    [1903,'1903 CE','Wright Brothers fly'],
    [1914,'1914 CE','World War I begins'],
    [1939,'1939 CE','World War II begins'],
    [1969,'1969 CE','Moon landing'],
    [1989,'1989 CE','Berlin Wall falls'],
    [2001,'2001 CE','9/11; Wikipedia founded'],
    [2007,'2007 CE','iPhone introduced'],
    [2020,'2020 CE','COVID-19 pandemic'],
    [2022,'2022 CE','ChatGPT launched'],
  ]

  const art = [
    [-500,-300,'500–300 BCE','Classical Greek','Classical Greek art produced idealised sculpture and the mature Greek alphabet — models for all Western type design.'],
    [1400,1600,'1400–1600','Renaissance','The Renaissance revived classical Roman letterforms, producing the first humanist typefaces. Jenson, Manutius, and Garamond defined an aesthetic of clarity still central to typography.'],
    [1600,1750,'1600–1750','Baroque','Baroque exuberance manifested in ornate title pages, decorated initials, and early display advertising.'],
    [1750,1820,'1750–1820','Neoclassicism','Neoclassicism produced the modern typefaces of Didot and Bodoni — mathematical precision, extreme contrast, hairline serifs.'],
    [1820,1900,'1820–1900','Victorian Era','Industrialisation produced an explosion of display typefaces alongside chromolithographic posters of great visual complexity.'],
    [1848,1915,'1848–1915','Arts & Crafts','William Morris elevated the book to a work of art with the Kelmscott Press — a reaction against industrial printing\'s coarseness.'],
    [1890,1910,'1890–1910','Art Nouveau','Flowing organic ornament in typography and poster art. Alphonse Mucha\'s lettering represents the style\'s apogee.'],
    [1909,1944,'1909–1944','Futurism','Italian Futurism celebrated speed through radical typographic experiments — diagonal setting, words as images.'],
    [1916,1923,'1916–1923','Dada','Anti-rational typography: random letter arrangements, clashing type, typographic collage.'],
    [1917,1931,'1917–1931','Constructivism','Pure geometry in typography — primary colours, right angles, asymmetric layouts. El Lissitzky defined the style.'],
    [1919,1933,'1919–1933','Bauhaus','The Bauhaus school transformed typography as part of its total design philosophy. Herbert Bayer and Joost Schmidt defined a new visual language.'],
    [1925,1940,'1925–1940','Art Deco','Geometric glamour in commercial typography — condensed letterforms, zigzag ornament. Broadway and Peignot exemplify the style.'],
    [1950,1975,'1950–1975','International Style','The Swiss International Typographic Style — grid layouts, Helvetica and Univers — became the house style of corporate modernism worldwide.'],
    [1970,1990,'1970–1990','Postmodernism','Rejected Modernist rationalism, embracing eclecticism, layering, irony, and deliberate illegibility.'],
    [1985,1995,'1985–1995','Grunge Typography','Digital tools enabled deliberately rough, layered typography. David Carson\'s Ray Gun made illegibility a design virtue.'],
    [1995,2010,'1995–2010','Early Digital','Early web constraints created a distinct pixel-font aesthetic — designers embraced rather than fought pixelation.'],
    [2010,2020,'2010–2020','Flat Design & Product UI','iOS 7, Material Design, and product design put typographic hierarchy at the centre of interface work.'],
    [2018,2026,'2018–present','Variable & Expressive','Variable fonts, colour fonts, and AI-assisted design are reshaping the field. Custom typefaces are key brand differentiators.'],
  ]

  // Insert typography events
  for (const [year, dateLabel, name, description, imageUrl, position] of typo) {
    await db.execute({
      sql: `INSERT INTO TypographyEvent (year, dateLabel, name, description, imageUrl, position) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [year, dateLabel, name, description, imageUrl, position]
    })
  }

  // Insert historical events
  for (const [year, dateLabel, name] of hist) {
    await db.execute({
      sql: `INSERT INTO HistoricalEvent (year, dateLabel, name) VALUES (?, ?, ?)`,
      args: [year, dateLabel, name]
    })
  }

  // Insert art movements
  for (const [startYear, endYear, datesLabel, name, description] of art) {
    await db.execute({
      sql: `INSERT INTO ArtMovement (startYear, endYear, datesLabel, name, description) VALUES (?, ?, ?, ?, ?)`,
      args: [startYear, endYear, datesLabel, name, description]
    })
  }

  return { typography: typo.length, historical: hist.length, movements: art.length }
}
