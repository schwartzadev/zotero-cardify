'use strict';

const cheerio = require('cheerio');
const config = require('config');
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const marked = require('marked');
const path = require('path');

Handlebars.registerHelper('json', context => JSON.stringify(context));

const addAnchors = html => {
	const $ = cheerio.load(html);
	const headers = $('h2, h3');
	headers.map((_, element) => {
		const id = element.attribs.id;
		$('<a>')
			.attr('href', '#' + id)
			.addClass('anchor-link')
			.text('#')
			.appendTo(element);
	});
	return $.html();
};

const buildIndexPage = async () => {
	const indexConfig = config.get('indexConfig');
	const srcFile = path.join(__dirname, '..', 'src', 'html', 'index.hbs');
	const dstFile = path.join(__dirname, '..', 'build', 'index');
	const index = await fs.readFile(srcFile);
	const template = Handlebars.compile(index.toString());
	const output = await template({ indexConfig });

	await fs.writeFile(dstFile, output);
	console.log(`index page generated based on ${config.util.getConfigSources().length} config sources`);
};

(async () => {
	const dstDir = path.join(__dirname, '..', 'build');
	await fs.ensureDir(dstDir);
	await Promise.all([buildIndexPage()]);
})();
