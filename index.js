const _ = require('lodash');
const parser = require('epub-parser');
const onLoaded = require('./events/loaded.js');

const epub = parser.open('./riaklil-en.zip', (err, data) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	onLoaded({epub: data, _parserCtx: parser});
});