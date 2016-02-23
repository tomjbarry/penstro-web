define(['js/constants/cookies', 'js/constants/params'],
		function(cookies, params) {
	return function() {
		var checkWarning = function(req, res) {
			var paramWarning = req.query[params.WARNING];
			var cookieWarning = req.cookies[cookies.WARNING];
			if(typeof(paramWarning) !== 'undefined') {
				if(paramWarning !== cookieWarning) {
					res.cookie(cookies.WARNING, paramWarning, cookies.getCookieOptions());
				}
			}
		};
		var checkLanguage = function(req, res) {
			var paramLanguage = req.query[params.LANGUAGE];
			var cookieLanguage = req.cookies[cookies.LANGUAGE];
			if(typeof(paramLanguage) !== 'undefined') {
				if(paramLanguage !== cookieLanguage) {
					res.cookie(cookies.LANGUAGE, paramLanguage, cookies.getCookieOptions());
				}
			}
		};
		var checkInterfaceLanguage = function(req, res) {
			var paramLanguage = req.query[params.INTERFACE_LANGUAGE];
			var cookieLanguage = req.cookies[cookies.INTERFACE_LANGUAGE];
			if(typeof(paramLanguage) !== 'undefined') {
				if(paramLanguage !== cookieLanguage) {
					res.cookie(cookies.INTERFACE_LANGUAGE, paramLanguage, cookies.getCookieOptions());
				}
			}
		};
		var checkTime = function(req, res) {
			var paramTime = req.query[params.TIME];
			var cookieTime = req.cookies[cookies.TIME];
			if(typeof(paramTime) !== 'undefined') {
				if(paramTime !== cookieTime) {
					res.cookie(cookies.TIME, paramTime, cookies.getCookieOptions());
				}
			}
		};
		var checkSort = function(req, res) {
			var paramSort = req.query[params.SORT];
			var cookieSort = req.cookies[cookies.SORT];
			if(typeof(paramSort) !== 'undefined') {
				if(paramSort !== cookieSort) {
					res.cookie(cookies.SORT, paramSort, cookies.getCookieOptions());
				}
			}
		};
		return function(req, res, next) {
			
			checkWarning(req, res);
			checkLanguage(req, res);
			// currently handled by i18n middelware
			//checkInterfaceLanguage(req, res);
			checkTime(req, res);
			checkSort(req, res);
			return next();
		};
	};
});