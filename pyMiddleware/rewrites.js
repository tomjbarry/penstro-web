define(['server_util/app-settings'], function(appSettings) {
	return function() {
		// should set trust proxy for correct functionality behind load balancers performing ssl termination
		//app.set('trust proxy', true);
		return function(req, res, next) {
			if(typeof(req.headers) !== 'undefined' && typeof(req.headers.host) === 'string' && req.headers.host.slice(0, 4) === 'www.') {
				var newHost = appSettings.getHost();
				return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
			}
			return next();
		};
	};
});