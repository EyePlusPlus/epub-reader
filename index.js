const _ = require('lodash');
const parser = require('epub-parser');
const onLoaded = require('./events/loaded.js');

if (_.isUndefined(process.argv[2])) {
	console.log("Pass the epub file name as the first argument");
	process.exit(1);
}

const epub = parser.open(process.argv[2], (err, data) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	onLoaded({epub: data, _parserCtx: parser});
});