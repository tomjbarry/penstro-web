define(['server_util/app-settings'], function(settings) {
	return function() {
		// 1 days of caching
		//var maxAge = 86400000 * 1;
		var maxAge = 14400;
		var expiresAge = maxAge * 1000;
		// hour of caching
		//var maxAge = 3600;
		
		var blankFunction = function(req, res, next) {return next();};
		var cacheFunction = function(req, res, next) {
			
			// perhaps check if it is css/img/lib etc and only cache then?
			if(req.path.match(/\.(ico|flv|jpg|jpeg|png|gif|js|css|svg|json|txt|xml)/)) {
				res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
				res.setHeader('Expires', new Date(Date.now() + expiresAge).toUTCString());
			} else {
				res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
				res.setHeader('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');
			}
			return next();
		};
		
		if (settings.isDevMode()) {
			return blankFunction;
		}
		return cacheFunction;
	};
});