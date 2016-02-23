define([], function() {
	return function() {
		return function(req, res, next) {
			res.locals.req = {
					params: req.params,
					query: req.query,
					cookies: req.cookies,
					url: req.url,
					path: req.path,
					originalUrl: req.originalUrl
			};
			return next();
		};
	};
});