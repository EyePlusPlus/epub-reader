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

const getTitle = rawJson => _.get(rawJson, ['ncx', 'docTitle', '0', 'text']);

const getLabel = navLabelEl => _.get(navLabelEl, ['0', 'text', '0']);

const getSrc = (opts, contentEl) => _.get(opts, ['opsRoot'], '') + _.get(contentEl, ['0', '$', 'src']);

const traverseNavElement = function (root, nm, opts) {
	if (_.has(nm, ['navLabel'])) {
		root.push({ label: getLabel(nm.navLabel), src: getSrc(opts, nm.content)});
	}
	if (_.has(nm, ['navPoint'])) {
		_.each(_.get(nm, ['navPoint']), (nm, idx) => {
			return traverseNavElement(root, nm, opts);
		});
	}
	return root;
}

module.exports = function onLoaded ({epub, _parserCtx}) {
	const rawJson = _.get(epub, ['raw', 'json']);
	const navRoot = _.get(rawJson, ['ncx', 'navMap', '0']);
	const opsRoot = _.get(epub, ['paths', 'opsRoot'], '');
	const navList = traverseNavElement([], navRoot, {opsRoot});

	const tocList = _.map(navList, 'label');

	screen.title = getTitle(rawJson);

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

		const dataSrc = _.find(navList, el => el.label === data.content).src;
		const newContent = getContent(h2p(_parserCtx.extractText(dataSrc)));

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