'use strict';

const React = require('react');
const balanced = require('balanced-match');
const api = require('zotero-api-client');
const apiCache = require('zotero-api-client-cache');
const cachedApi = api().use(apiCache());
const load = require('load-script');
const formatBib = require('./cite');
const { baseMappings } = require('zotero-web-library/src/js/constants/item');
const stylesCache = {};

// todo put this style in its own file
const policyDebateStyle = `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="never" page-range-format="minimal-two">
  <!-- This style was edited with the Visual CSL Editor (https://editor.citationstyles.org/visualEditor/) -->
  <info>
    <title>Policy Debate (Modified MLA8)</title>
    <title-short>CX</title-short>
    <id>https://en.wikipedia.org/wiki/Policy_debate</id>
    <summary>This style adheres to the norms for &quot;cards&quot; in competitive policy debate.</summary>
    <updated>2020-02-20T03:21:43+00:00</updated>
  </info>
  <locale xml:lang="en">
    <date form="text">
      <date-part name="day" suffix=" "/>
      <date-part name="month" suffix=" " form="short"/>
      <date-part name="year"/>
    </date>
    <terms>
      <term name="month-01" form="short">Jan.</term>
      <term name="month-02" form="short">Feb.</term>
      <term name="month-03" form="short">Mar.</term>
      <term name="month-04" form="short">Apr.</term>
      <term name="month-05" form="short">May</term>
      <term name="month-06" form="short">June</term>
      <term name="month-07" form="short">July</term>
      <term name="month-08" form="short">Aug.</term>
      <term name="month-09" form="short">Sept.</term>
      <term name="month-10" form="short">Oct.</term>
      <term name="month-11" form="short">Nov.</term>
      <term name="month-12" form="short">Dec.</term>
      <term name="translator" form="short">trans.</term>
    </terms>
  </locale>
  <macro name="card-author">
    <names variable="author" suffix="">
      <name form="short" and="text" delimiter-precedes-et-al="always" delimiter-precedes-last="always" initialize="false" initialize-with=". " name-as-sort-order="first"/>
      <label form="long" prefix=", "/>
      <substitute>
        <names variable="editor"/>
        <names variable="translator"/>
        <text macro="title"/>
      </substitute>
    </names>
  </macro>
  <macro name="author">
    <names variable="author" suffix="">
      <name name-as-sort-order="first" and="text" delimiter-precedes-last="always" delimiter-precedes-et-al="always" initialize="false" initialize-with=". "/>
      <label form="long" prefix=", "/>
      <substitute>
        <names variable="editor"/>
        <names variable="translator"/>
        <text macro="title"/>
      </substitute>
    </names>
  </macro>
  <macro name="author-short">
    <group delimiter=", ">
      <names variable="author">
        <name form="short" initialize-with=". " and="text"/>
        <substitute>
          <names variable="editor"/>
          <names variable="translator"/>
          <text macro="title-short"/>
        </substitute>
      </names>
      <choose>
        <if disambiguate="true">
          <text macro="title-short"/>
        </if>
      </choose>
    </group>
  </macro>
  <macro name="title">
    <choose>
      <if variable="container-title" match="any">
        <text variable="title" quotes="true" text-case="title"/>
      </if>
      <else>
        <text variable="title" font-style="italic" text-case="title"/>
      </else>
    </choose>
  </macro>
  <macro name="title-short">
    <choose>
      <if variable="container-title" match="any">
        <text variable="title" form="short" quotes="true" text-case="title"/>
      </if>
      <else>
        <text variable="title" form="short" font-style="italic" text-case="title"/>
      </else>
    </choose>
  </macro>
  <macro name="container-title">
    <text variable="container-title" font-style="italic" text-case="title"/>
  </macro>
  <macro name="other-contributors">
    <group delimiter=", ">
      <choose>
        <if variable="container-title" match="any">
          <names variable="container-author editor illustrator interviewer translator" delimiter=", ">
            <label form="verb" suffix=" "/>
            <name and="text"/>
          </names>
        </if>
        <else>
          <names variable="container-author editor illustrator interviewer translator" delimiter=", ">
            <label form="verb" suffix=" " text-case="capitalize-first"/>
            <name and="text"/>
          </names>
        </else>
      </choose>
      <names variable="director">
        <label form="verb" suffix=" " text-case="capitalize-first"/>
        <name and="text"/>
      </names>
    </group>
  </macro>
  <macro name="version">
    <group delimiter=", ">
      <choose>
        <if is-numeric="edition">
          <group delimiter=" ">
            <number variable="edition" form="ordinal"/>
            <text term="edition" form="short"/>
          </group>
        </if>
        <else>
          <text variable="edition" text-case="capitalize-first"/>
        </else>
      </choose>
      <text variable="version"/>
    </group>
  </macro>
  <macro name="volume-lowercase">
    <group delimiter=" ">
      <text term="volume" form="short"/>
      <text variable="volume"/>
    </group>
  </macro>
  <macro name="number">
    <group delimiter=", ">
      <group>
        <choose>
          <if variable="edition container-title" match="any">
            <text macro="volume-lowercase"/>
          </if>
          <else-if variable="author" match="all">
            <choose>
              <if variable="editor translator container-author illustrator interviewer director" match="any">
                <text macro="volume-lowercase"/>
              </if>
            </choose>
          </else-if>
          <else-if variable="editor" match="all">
            <choose>
              <if variable="translator container-author illustrator interviewer director" match="any">
                <text macro="volume-lowercase"/>
              </if>
            </choose>
          </else-if>
          <else-if variable="container-author illustrator interviewer director" match="any">
            <text macro="volume-lowercase"/>
          </else-if>
          <else>
            <group delimiter=" ">
              <text term="volume" form="short" text-case="capitalize-first"/>
              <text variable="volume"/>
            </group>
          </else>
        </choose>
      </group>
      <group delimiter=" ">
        <text term="issue" form="short"/>
        <text variable="issue"/>
      </group>
      <choose>
        <if type="report">
          <text variable="genre"/>
        </if>
      </choose>
      <text variable="number"/>
    </group>
  </macro>
  <macro name="publisher">
    <text variable="publisher"/>
  </macro>
  <macro name="publication-date">
    <choose>
      <if type="book chapter paper-conference motion_picture" match="any">
        <date variable="issued" form="numeric" date-parts="year"/>
      </if>
      <else-if type="article-journal article-magazine" match="any">
        <date variable="issued" form="text" date-parts="year-month"/>
      </else-if>
      <else-if type="speech" match="none">
        <date variable="issued" form="text"/>
      </else-if>
    </choose>
  </macro>
  <macro name="location">
    <group delimiter=", ">
      <group delimiter=" ">
        <label variable="page" form="short"/>
        <text variable="page"/>
      </group>
      <choose>
        <if variable="source" match="none">
          <text macro="URI"/>
        </if>
      </choose>
    </group>
  </macro>
  <macro name="container2-title">
    <group delimiter=", ">
      <choose>
        <if type="speech">
          <text variable="event"/>
          <date variable="event-date" form="text"/>
          <text variable="event-place"/>
        </if>
      </choose>
      <text variable="archive"/>
      <text variable="archive-place"/>
      <text variable="archive_location"/>
    </group>
  </macro>
  <macro name="container2-location">
    <choose>
      <if variable="source">
        <choose>
          <if variable="DOI URL" match="any">
            <group delimiter=", ">
              <text variable="source" font-style="italic"/>
              <text macro="URI"/>
            </group>
          </if>
        </choose>
      </if>
    </choose>
  </macro>
  <macro name="URI">
    <choose>
      <if variable="DOI">
        <text variable="DOI" prefix="doi:"/>
      </if>
      <else>
        <text variable="URL"/>
      </else>
    </choose>
  </macro>
  <macro name="accessed">
    <choose>
      <if variable="issued" match="none"/>
    </choose>
    <text value=""/>
  </macro>
  <citation et-al-min="3" et-al-use-first="1" disambiguate-add-names="true" disambiguate-add-givenname="true">
    <layout prefix="(" suffix=")" delimiter="; ">
      <choose>
        <if locator="page line" match="any">
          <group delimiter=" ">
            <text macro="author-short"/>
            <text variable="locator"/>
          </group>
        </if>
        <else>
          <group delimiter=", ">
            <text macro="author-short"/>
            <group>
              <label variable="locator" form="short"/>
              <text variable="locator"/>
            </group>
          </group>
        </else>
      </choose>
    </layout>
  </citation>
  <bibliography hanging-indent="true" et-al-min="3" et-al-use-first="1" line-spacing="2" entry-spacing="0" subsequent-author-substitute="---">
    <sort>
      <key macro="author"/>
      <key variable="title"/>
    </sort>
    <layout suffix=".">
      <group delimiter=". ">
        <group font-variant="normal" font-weight="bold">
          <text macro="card-author" suffix=" "/>
          <date date-parts="year" form="text" variable="issued" prefix="'">
            <date-part name="year" form="short"/>
          </date>
        </group>
        <choose>
          <if match="any" variable="note">
            <text variable="note" prefix="[" suffix="]"/>
          </if>
        </choose>
        <text macro="author"/>
        <text macro="title"/>
        <date variable="original-date" form="numeric" date-parts="year"/>
        <group delimiter=", ">
          <text macro="container-title"/>
          <text macro="other-contributors"/>
          <text macro="version"/>
          <text macro="number"/>
          <text macro="publisher"/>
          <text macro="publication-date"/>
          <text macro="location"/>
        </group>
        <group delimiter=", ">
          <text macro="container2-title"/>
          <text macro="container2-location"/>
        </group>
        <group delimiter=" ">
          <text value="DOA:" text-case="capitalize-first"/>
          <date form="numeric" variable="accessed"/>
        </group>
      </group>
    </layout>
  </bibliography>
</style>`;

const getCSL = () => {
	if('CSL' in window) {
		return Promise.resolve(window.CSL);
	}

	return new Promise((resolve, reject) => {
		load('/static/js/citeproc.js', (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(window.CSL);
			}
		});
	});
};

const getCiteproc = async (citationStyle, bib) => {
	const lang = window ? window.navigator.userLanguage || window.navigator.language : null;

	const [ CSL, style ] = await Promise.all([
		getCSL(),
		retrieveStyle(citationStyle)
	]);

	return new CSL.Engine({
		retrieveLocale: retrieveLocaleSync,
		retrieveItem: itemId => {
			const item = bib.itemsCSL.find(item => item.id === itemId);

			// Don't return URL or accessed information for journal, newspaper, or magazine
			// articles if there's a page number. Equivalent to export.citePaperJournalArticleURL
			// being set in Zotero (as it is by default)
			if (item.type.startsWith('article-') && item.page) {
				delete item.URL;
				delete item.accessed;
			}

			if(!('author' in item) && !('title' in item) && !('issued' in item)) {
				// there is a risk of this item being skipped by citeproc
				// in makeBibliography so we inject title to make sure it
				// can be edited in bib-web
				return {
					...item,
					title: 'Untitled'
				};
			} else {
				return item;
			}
		},
		uppercase_subtitles: isAPASentenceCaseStyle(citationStyle)
	}, style, lang);
};

const syncRequestAsText = url => {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url, false);
	xhr.send();
	if(xhr.readyState === xhr.DONE && xhr.status === 200) {
		return xhr.responseText;
	} else {
		return false;
	}
};

const parseIdentifier = identifier => {
	identifier = identifier.trim();

	//attemt to extract DOI from doi url:
	const matches = identifier.match(/^https?:\/\/doi.org\/(10(?:\.[0-9]{4,})?\/[^\s]*[^\s.,])$/);
	if(matches) {
		return matches[1];
	}
	return identifier;
};

const isLikeUrl = identifier => {
	return !!identifier.match(/^(https?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b(\S*)$/i);
};

const isSentenceCaseStyle = (citationStyle) => {
	return false;
};

// Sentence-case styles that capitalize subtitles like APA
const isAPASentenceCaseStyle = (citationStyle) => {
	return false;
};

const isNoteStyle = cslData => !!cslData.match(/citation-format="note.*?"/);
const isNumericStyle = cslData => !!cslData.match(/citation-format="numeric.*?"/);

const validateUrl = url => {
		try {
			url = new URL(url);
			return url.toString();
		} catch(e) {
			try {
				url = new URL(`http://${url}`);
				return url.toString();
			} catch(e) {
				return false;
			}
		}
};

const getParentStyle = async styleXml => {
	const matches = styleXml.match(/<link.*?href="?(https?:\/\/[\w.\-/]*)"?.*?rel="?independent-parent"?.*?\/>/i);
	if(matches) {
		// try to extract style id, fallback using url as id
		const idMatches = matches[1].match(/https?:\/\/www\.zotero\.org\/styles\/([\w-]*)/i);
		return await retrieveStyle(idMatches ? idMatches[1] : matches[1]);
	}
	return styleXml;
};

const retrieveStyle = async styleIdOrUrl => {
	return policyDebateStyle;
};

const retrieveLocaleSync = lang => {
	const cacheId = `zotero-style-locales-${lang}`;
	var locales = localStorage.getItem(cacheId);

	// fix in place for scenarios where potentially bad locales have been cached
	// see issue #236
	if(typeof locales === 'string' && !locales.startsWith('<?xml')) {
		locales = false;
	}

	if(!locales) {
		const url = `/static/locales/locales-${lang}.xml`;
		try {
			locales = syncRequestAsText(url);
			localStorage.setItem(cacheId, locales);
		} catch(e) {
			if(!locales) {
				throw new Error('Failed to load locales');
			}
		}
	}
	return locales;
};

const retrieveStylesData = async url => {
	try {
		const response = await fetchWithCachedFallback(url);
		if(!response.ok) { throw new Error(); }
		return await response.json();
	} catch(_) {
		throw new Error('Failed to load styles data');
	}
};

const fetchWithCachedFallback = async url => {
	try {
		return await fetch(url);
	} catch(_) {
		// try to fallback for a cached version
		return await fetch(url, { 'cache': 'force-cache' });
	}
}

const getItemTypes = async () => {
	return (await cachedApi.itemTypes().get()).getData();
};

const getItemTypeMeta = async (itemType) => {
	var [itemTypeR, itemTypeFieldsR, creatorTypesR] = await Promise.all([
		cachedApi.itemTypes().get(),
		cachedApi.itemTypeFields(itemType).get(),
		cachedApi.itemTypeCreatorTypes(itemType).get()
	]);

	return {
		itemTypes: itemTypeR.getData(),
		itemTypeFields: itemTypeFieldsR.getData(),
		itemTypeCreatorTypes: creatorTypesR.getData()
	};
};

const validateItem = async item => {
	const { itemTypeFields, itemTypeCreatorTypes } = await getItemTypeMeta(item.itemType);

	//remove item properties that should not appear on this item type
	for (var prop in item) {
		if(!([...itemTypeFields.map(f => f.field), 'creators', 'key', 'itemType', 'version', 'tags'].includes(prop))) {
			delete item[prop];
		}
	}

	//convert item creators to match creators appropriate for this item type
	if(item.creators && Array.isArray(item.creators)) {
		for(var creator of item.creators) {
			if(typeof itemTypeCreatorTypes.find(c => c.creatorType === creator.creatorType) === 'undefined') {
				creator.creatorType = itemTypeCreatorTypes[0].creatorType;
			}
		}
	}
};


//@TODO: implement retry
const fetchFromPermalink = async url => {
	try {
		const response = await fetch(url);
		if(!response.ok) {
			throw new Error(`Unexpected response from the server: ${response.status}: ${response.statusText}`);
		}
		return await response.json();
	} catch(e) {
		throw e;
	}
};

//@TODO: implement retry
const saveToPermalink = async (url, data) => {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if(!response.ok) {
			throw new Error(`Unexpected response from the server: ${response.status}: ${response.statusText}`);
		}
		let { key } = await response.json();
		if(!key) {
			throw new Error('Error: Response did not contain a key');
		}
		return key;
	} catch(e) {
		throw e;
	}
};

/**
	 * copied from https://github.com/zotero/zotero/blob/1f5639da4297ac20fd21223d2004a7cfeef72e21/chrome/content/zotero/xpcom/cite.js#L43
	 * Convert formatting data from citeproc-js bibliography object into explicit format
	 * parameters for RTF or word processors
	 * @param {bib} citeproc-js bibliography object
	 * @return {Object} Bibliography style parameters.
 */

const getBibliographyFormatParameters = bib => {
		var bibStyle = {'tabStops':[], 'indent':0, 'firstLineIndent':0,
						'lineSpacing':(240 * bib[0].linespacing),
						'entrySpacing':(240 * bib[0].entryspacing)};
		if(bib[0].hangingindent) {
			bibStyle.indent = 720;				// 720 twips = 0.5 in
			bibStyle.firstLineIndent = -720;	// -720 twips = -0.5 in
		} else if(bib[0]['second-field-align']) {
			// this is a really sticky issue. the below works for first fields that look like "[1]"
			// and "1." otherwise, i have no idea. luckily, this will be good enough 99% of the time.
			var alignAt = 24+bib[0].maxoffset*120;
			bibStyle.firstLineIndent = -alignAt;
			if(bib[0]['second-field-align'] == 'margin') {
				bibStyle.tabStops = [0];
			} else {
				bibStyle.indent = alignAt;
				bibStyle.tabStops = [alignAt];
			}
		}

		return bibStyle;
};

const getCitations = (bib, citeproc) => {
	const items = bib.itemsRaw.map(item => item.key);
	const citations = [];
	//@NOTE: this is deprecated but seems to be the only way to reset registry
	//       otherwise previous calls to appendCitationCluster aggregate incorrectly
	//		 Alternatively we could do even more hackier:
	//		 citeproc.registry = new CSL.Registry(citeproc)
	citeproc.restoreProcessorState();
	citeproc.updateItems(items);

	bib.itemsRaw.forEach(item => {
		let outList = citeproc.appendCitationCluster({
			'citationItems': [{ 'id': item.key }],
			'properties': {}
		}, true);
		outList.forEach(listItem => {
			citations[listItem[0]] = listItem[1];
		});
	});
	return citations;
};

const getBibliographyOrFallback = (bib, citeproc) => {
	const items = bib.itemsRaw.map(item => item.key);
	citeproc.updateItems([]); // workaround for #256
	citeproc.updateItems(items);
	const bibliography = citeproc.makeBibliography();

	if(bibliography) {
		return {
			items: bib.itemsRaw,
			isFallback: false,
			bibliography
		};
	}

	return {
		items: bib.itemsRaw,
		isFallback: true,
		citations: getCitations(bib, citeproc)
	};
};

const getCitation = (bib, itemId, modifiers, formats, citeproc, isWarm = false) => {
	const items = bib.itemsRaw.map(item => item.key);
	if(!isWarm) {
		citeproc.restoreProcessorState(items.map((key, i) => {
			return {
				citationID: key,
				citationItems: [{ 'id': key }],
				properties: {
					index: i
				}
			};
		}));
	}

	const index = items.indexOf(itemId);
	const pre = items.slice(0, index).map((key, i) => ([key, i]));
	const post = items.slice(index + 1).map((key, i) => ([key, i]));
	const citation = {
		'citationItems': [{ 'id': itemId }],
		'properties': {}
	};

	if(modifiers) {
		for(let i in modifiers) {
			let prop = i == 'suppressAuthor' ? 'suppress-author' : i;
			citation.citationItems[0][prop] = modifiers[i];
		}
	}

	const output = {};
	const validFormats = ['text', 'html'];

	if (!formats || !formats.length) {
		formats = validFormats;
	}

	for (let format of formats.filter(f => validFormats.includes(f))) {
		output[format] = citeproc.previewCitationCluster(citation, pre, post, format);
	}
	return output;
};

const whitelist = [
	...(Object.keys(baseMappings).reduce((agg, itemType) => {
		'title' in baseMappings[itemType] && agg.push(baseMappings[itemType]['title']);
		return agg;
	}, [])),
	'title',
	'shortTitle',
];

const isSentenceCase = val => {
	// sanity check, at this point CSL should always be present
	if(!('CSL' in window)) {
		return false;
	}

	let matches = val.match(/^\W*(\w+)(.*?)$/);
	if(matches && matches.length > 2) {
		let [_, firstWord, remainingWords] = matches; // eslint-disable-line no-unused-vars
		let firstLetter = firstWord.substr(0, 1);
		if(firstLetter.toUpperCase() !== firstLetter) {
			// first letter of first word is not uppercase
			return false;
		}
		// count how many words are lowercased, ignoring short words and SKIP_WORDS
		let lowerCaseWords = 0;
		let totalWords = 0;
		remainingWords = remainingWords.match(/(\w+)/g);
		if(remainingWords) {
			remainingWords
				.filter(word => word.length >= 4 || !window.CSL.SKIP_WORDS.includes(word))
				.forEach(word => {
					totalWords++;
					let firstLetter = word.substr(0, 1);
					if(firstLetter.toLowerCase() === firstLetter) {
						lowerCaseWords++;
					}
				});
		}
		let ratio = lowerCaseWords / totalWords;
		return ratio >= 0.5;
	}
};

const processSentenceCase = val => {
	if(isSentenceCase(val)) {
		return val;
	}
	let matches = val.match(/(([^.!?]+)[.!?]+)|([^.!?]+$)/g);
	if(matches) {
		return matches.map(s => {
			// skip special characters at the beginning of the sentence
			const [ _, pre, sentence ] = s.trim().match(/^(['"¡¿“‘„«(]*)(.*)$/); // eslint-disable-line no-unused-vars
			// uppercase first actual letter of the sentence, lowercase rest
			return pre + sentence[0].toUpperCase() + sentence.slice(1).toLowerCase();
		})
		.join(' ');
	} else {
		return val;
	}
};

const processSentenceCaseAPAField = value => {
	var match;
	var sentencesInBrackets = [];
	var rootSentences = '';
	// extract all content in balanced parentheses
	while((match = balanced('(', ')', value))) {
		match.body = processSentenceCase(match.body);
		// process sentences within parentheses
		sentencesInBrackets.push(match);
		rootSentences += match.pre;
		value = match.post;
	}
	rootSentences += value;
	// process "root" sentences separately
	rootSentences = processSentenceCase(rootSentences);

	// re-insert content from parentheses at correct indexes
	var pointer = 0;
	sentencesInBrackets.forEach(sentenceInBrackets => {
		let pre = rootSentences.substr(0, pointer + sentenceInBrackets.start);
		let post = rootSentences.substr(pointer + sentenceInBrackets.start);

		rootSentences = `${pre}(${sentenceInBrackets.body})${post}`;
		pointer += sentenceInBrackets.end + 1;
	});
	return rootSentences;
};

const processSentenceCaseAPAItems = items => {
	const itemsMetaData = JSON.parse(localStorage.getItem('zotero-bib-items-metadata')) || {};
	items.forEach(item => {
		Object.keys(item).forEach(k => {
			if(typeof(item[k]) === 'string' && whitelist.includes(k)) {
				if(!(item.key in itemsMetaData &&
					'apaEditedKeys' in itemsMetaData[item.key] &&
					itemsMetaData[item.key]['apaEditedKeys'].includes(k)
				)) {
					item[k] = processSentenceCaseAPAField(item[k]);
				}
			}
		});
	});

	return items;
};

const parseTagAndAttrsFromNode = node => {
	let Tag = node.tagName.toLowerCase();
	let attrs = {
		className: node.getAttribute('class') || '',
		style: (node.getAttribute('style') || '')
			.split(';')
			.map(x => x.split(':')
				.map(y => y.trim())
			).reduce((aggr, val) => {
				aggr[val[0].replace(/-([a-z])/g, g => g[1].toUpperCase())] = val[1];
				return aggr;
			}, {})
	};

	return { Tag, attrs };
};

const processMultipleChoiceItems = async (items, isUrl = false) => {
	const itemTypes = await getItemTypes();
	return Object.entries(items)
		.map(([key, value]) => ({
			key,
			value: typeof value === 'string' ? {
				title: value
			} : {
				...value,
				itemType: (itemTypes.find(it => it.itemType == value.itemType) || {}).localized
			},
			source: isUrl ? 'url' : 'identifier'
		}));
};

const removeDuplicatesBy = (fn, array) => {
	var unique = new Set();
	return array.filter(element => {
		const key = fn(element);
		const isNew = !unique.has(key);
		if(isNew) {
			unique.add(key);
		}
		return isNew;
	});
};

const dedupMultipleChoiceItems = items => {
	items.forEach(item => {
		const { title, description, itemType } = item.value;
		const signature = item.key + title + description + itemType;
		item.signature = signature;
	});
	return removeDuplicatesBy(i => i.signature, items);
};

const getHtmlNodeFromBibliography = bibliographyData => {
	const { citations, bibliography, isFallback } = bibliographyData;
	const html = isFallback ?
		`<ol><li>${citations.join('</li><li>')}</li></ol>` :
		formatBib(bibliography);
	const div = document.createElement('div');
	div.innerHTML = html;
	div.querySelectorAll('a').forEach(link => {
		link.setAttribute('rel', 'nofollow');
	});
	return div;
}

function* makeBibliographyContentIterator(bibliographyData, bibliographyNode) {
	const { items, citations, bibliography, isFallback } = bibliographyData;

	if(isFallback) {
		for(let i = 0; i < items.length; i++) {
			const item = items[i];
			const content = <span dangerouslySetInnerHTML={ { __html: citations[i] } } />;
			yield [item, content];
		}
	} else {
		const nodeArray = Array.from(bibliographyNode.firstChild.children);
		for(let i = 0; i < nodeArray.length; i++) {
			const child = nodeArray[i];
			const [ itemId ] = bibliography[0]['entry_ids'][i];
			const { Tag, attrs } = parseTagAndAttrsFromNode(child);
			const item = items.find(i => i.key === itemId);
			const content = <Tag
				dangerouslySetInnerHTML={ { __html: child.innerHTML } }
				{ ...attrs }
			/>
			yield [item, content];
		}
	}
}

module.exports = {
	dedupMultipleChoiceItems,
	fetchFromPermalink,
	getBibliographyFormatParameters,
	getBibliographyOrFallback,
	getCitation,
	getCiteproc,
	getCSL,
	getHtmlNodeFromBibliography,
	getItemTypeMeta,
	getItemTypes,
	isAPASentenceCaseStyle,
	isLikeUrl,
	isNoteStyle,
	isNumericStyle,
	isSentenceCaseStyle,
	makeBibliographyContentIterator,
	parseIdentifier,
	parseTagAndAttrsFromNode,
	processMultipleChoiceItems,
	processSentenceCaseAPAField,
	processSentenceCaseAPAItems,
	retrieveLocaleSync,
	retrieveStyle,
	retrieveStylesData,
	saveToPermalink,
	syncRequestAsText,
	validateItem,
	validateUrl,
};
