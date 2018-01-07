const blessed = require('blessed');
const { JSDOM } = require('jsdom');
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


module.exports = function onLoaded ({epub}) {
	// epub is now usable
	screen.title = epub.metadata.title;
	const tocList = [];

	epub.flow.forEach(function(chapter){
		tocList.push(chapter.id);
	});

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
		epub.getChapter(data.content, function(err, text){
			// const dom = new JSDOM(html);
			const newContent = getContent(text);

			screen.remove(list);
			screen.append(newContent);
			screen.render();

			newContent.key('left', () => {
				screen.remove(newContent);
				screen.append(list);
				screen.render();
			});
		});
	});

	screen.key(['escape', 'q', 'C-c'], function(ch, key) {
		return process.exit(0);
	});

	list.focus();
	screen.render();
};