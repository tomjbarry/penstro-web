var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname,
	paths: {
		'admin-js': 'admin/js',
		'js': 'dev'
	},
	nodeRequire: require
});

requirejs(['showdown', 'js/util/markdown-extensions', 'path', 'fs'], function(showdown, ext, path, fs) {
showdown.setOption('noHeaderId', true);
showdown.setOption('parseImgDimensions', true);
var converter = new showdown.Converter({extensions: ext.ext});

var convert = function(str) {
	if(typeof(str) !== 'undefined') {
		return converter.makeHtml(str).replace(/[\"]/g, "\\\"").replace(/[\n]/g, "\\n");
	}
	return '';
};

var file = fs.readFileSync('/home/tom/postings.json', 'utf8');
if(typeof(file) === 'undefined') {
	throw 'Could not load file!';
}

var postings = JSON.parse(file.replace(/^\uFEFF/, ''));
var result = '';
var posting;
var delim = '';
for(var i = 0; i < postings.length; i++) {
	posting = postings[i];
	result = result + 'db.posting.update({"_id":' + posting['_id'] + '},{"$set":{"con":"' + convert(posting.con) + '"}});' + delim;
	delim = "\n";
}

fs.writeFile('/home/tom/convertPostings.js', result, function(err){if(err){console.log(err);}});

});
