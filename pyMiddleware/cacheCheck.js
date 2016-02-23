define(['server_util/request-cache'], function(requestCache) {
	return function() {
		return function(req, res, next) {
			var resultHtml = requestCache.getByRequest(req);
			if(typeof(resultHtml) !== 'undefined' && resultHtml !== null) {
				res.send(resultHtml);
			} else {
				return next();
			}
		};
	};
});