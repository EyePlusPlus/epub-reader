const EPub = require('epub');
const onLoaded = require('./events/loaded.js');

const epub = new EPub('./riaklil-en.zip', __dirname, __dirname);
epub.on("end", () => {
	onLoaded({epub});
});
epub.parse();