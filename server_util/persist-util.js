define(['path', 'fs', 'js/util/utils', 'js/constants/language-settings'], function(path, fs, utils, languageSettings) {
	var persist = {};
	var filename = 'persist.json';
	var file;
	var write = function() {
		fs.writeFile(filename, JSON.stringify(persist), function(err) {
			if(err) {
				console.log('Could not save persistent data!', err);
			}
		});
	};
	try {
		file = fs.readFileSync(filename, 'utf8');
		if(typeof(file) === 'undefined') {
			throw 'Could not load persist data!';
		}
	} catch(e) {
		console.log('Could not find persist. Writing a new file');
		write();
	}
	if(typeof(file) !== 'undefined') {
		persist = JSON.parse(file.replace(/^\uFEFF/, ''));
	}
	
	return {
		add: function(k, v) {
			if(typeof(k) !== 'undefined') {
				persist[k] = v;
				write();
				console.log('Writing to persist for {' + k + ', ' + v + '}');
			}
		},
		getData: function() {
			return persist;
		}
	};
});