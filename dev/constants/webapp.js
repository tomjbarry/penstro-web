define(['config'], function(config) {
	if(typeof(window) !== 'undefined' && typeof(window.pyGetClientConfig) !== 'undefined') {
		config = window.pyGetClientConfig();
	}
	var url = config.app.protocol + '://' + config.app.host;
	var https = (typeof(config.app.protocol) !== 'undefined' && config.app.protocol.toLowerCase() === 'https');
	var port = config.app.httpPort;
	if(https) {
		port = config.app.httpsPort;
		if(port !== 443) {
			url = url + ':' + port;
		}
	} else {
		if(port !== 80) {
			url = url + ':' + port;
		}
	}
	return {
		DOMAIN: config.app.host,
		URL: url
	};
});