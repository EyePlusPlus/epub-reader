const _ = require('lodash');
const blessed = require('blessed');
const { JSDOM } = require('jsdom');
const h2p = require('html2plaintext');
const screen = blessed.screen({
	smartCSR: true
});

const getContent = (value) => {
	const contentBox = blessed.box({
		content: `This is ${value}`,
		keys: true,
		tags: true,
		border: {
			type: 'line'
		},
		scrollable: true,
		alwaysScroll: true,
		scrollbar: {
			bg: 'blue',
		},
		style: {
			fg: 'white',
			border: {
				fg: '#f0f0f0'
			},
			hover: {
				bg: 'green'
			}
		}
	});
	return contentBox;
};


module.exports = function onLoaded ({epub, _parserCtx}) {
	const title = _.get(epub, ['raw', 'json', 'ncx', 'docTitle', '0', 'text']);
	const navList = _.reduce(_.get(epub, ['raw', 'json', 'ncx', 'navMap', '0', 'navPoint']), (n, tree, idx) => {
		n[_.get(tree, ['navLabel', '0', 'text', '0'])] = _.get(tree, ['content', '0', '$', 'src']);
		return n;
	}, {});
	screen.title = title;

	const tocList = _.keys(navList);

	const list = blessed.list({
		keys: true,
		border: 'line',
		items: tocList,
		style: {
			selected: {
				bg: 'green'
			}
		}
	});

	screen.append(list);

	list.on('select', (data, idx) => {

		const newContent = getContent(h2p(_parserCtx.extractText(navList[data.content])));

		screen.remove(list);
		screen.append(newContent);
		screen.render();

		newContent.key('left', () => {
			screen.remove(newContent);
			screen.append(list);
			screen.render();
		});
	});

	screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		return process.exit(0);
	});

	list.focus();
	screen.render();
};