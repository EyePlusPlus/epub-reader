const { JSDOM } = require('jsdom');
const blessed = require('blessed');

const screen = blessed.screen({
	smartCSR: true
});
screen.title = 'my window title';
const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Document</title>
</head>
<body>

</body>
</html>`;

const dom = new JSDOM(html);
console.log(typeof dom);
screen.render();