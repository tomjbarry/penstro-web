define(['url', 'server_util/render', 'js/constants/cookies', 'js/constants/params', 'js/constants/path-variables'],
		function(url, render, cookies, params, pathVars) {
	return {
		standardCallback: function(callback) {
			return function(code, dto, page) {
				return callback(null, {success: true,
								code: code,
								dto: dto,
								page: page});
			};
		},
		standardErrorCallback: function(callback) {
			return function(code, dto) {
				return callback(null, {success: false,
								code: code,
								dto: dto});
			};
		},
		apiCallback: function(req, res) {
			return function() {
				render(req, res, 'apiError');
			};
		},
		getSingleFromResultList: function(results) {
			var single;
			for(var i = 0; i < results.length; i++) {
				if(results[i].success && typeof(results[i].dto) !== 'undefined' && results[i].dto !== null) {
					if(typeof(single) === 'undefined') {
						single = results[i].dto;
					} else {
						return undefined;
					}
				}
			}
			return single;
		},
		getPageFromResultList: function(results) {
			var page;
			for(var i = 0; i < results.length; i++) {
				if(results[i].success && typeof(results[i].page) !== 'undefined' && results[i].page !== null) {
					if(typeof(page) === 'undefined') {
						page = results[i].page;
					} else {
						return undefined;
					}
				}
			}
			return page;
		},
		setTitle: function(res, title, translate, args) {
			res.locals.req.titleTranslate = false;
			if(typeof(translate) !== 'undefined' && translate) {
				res.locals.req.titleTranslate = true;
				res.locals.req.titleArgs = args;
			}
			res.locals.req.title = title;
		}
	};
});