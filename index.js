const { JSDOM } = require('jsdom');
const blessed = require('blessed');
const EPub = require('epub');

const screen = blessed.screen({
	smartCSR: true
});

const epub = new EPub('./riaklil-en.zip', __dirname, __dirname);
epub.on("end", function(){
	// epub is now usable
	screen.title = epub.metadata.title;

	epub.flow.forEach(function(chapter){
		console.log(chapter.id);
	});

	epub.getChapter("html35", function(err, text){
		console.log("here");
		// const dom = new JSDOM(html);
		// console.log(typeof dom);
		// screen.render();

	});
});
epub.parse();
