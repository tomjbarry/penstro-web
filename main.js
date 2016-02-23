var requirejs = require('requirejs');

var env = process.env.NODE_ENV || 'development';
var subEnv = process.env.NODE_SUB_ENV || 'development';
//development only
if ('development' === env) {
	var dev = require('./development');
	dev();
}

requirejs.config({
	baseUrl: __dirname,
	paths: {
		'admin-js': 'admin/js',
		'js': 'dev'
	},
	nodeRequire: require
});

requirejs(['app', 'http', 'https'], function(app, http, https) {
	console.log('Server starting for http: ' + app.http.port + ' and https: ' + app.https.port);
	if(typeof(app.http) !== 'undefined') {
		http.createServer(app.http.app).listen(app.http.port);
	}
	if(typeof(app.https) !== 'undefined') {
		https.createServer(app.https.options, app.https.app).listen(app.https.port);
	}
});