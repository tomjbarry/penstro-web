define(['js/constants/cookies', 'js/constants/params', 'js/constants/path-variables', 'js/constants/defaults'],
	function(cookies, params, pathVars, defaults) {
	
		var upper = function(str) {
			if(str) {
				return str.toUpperCase();
			}
			return str;
		};
		
		var lower = function(str) {
			if(str) {
				return str.toLowerCase();
			}
			return str;
		};
		return {
			constructWarning: function(req) {
				var warning = req.query[params.WARNING];
				if(typeof(warning) === 'undefined') {
					warning = req.cookies[cookies.WARNING];
					if(typeof(warning) === 'undefined') {
						warning = defaults.WARNING.toString();
					}
				}
				return upper(warning);
			},
			constructLanguage: function(req) {
				var language = req.query[params.LANGUAGE];
				if(typeof(language) === 'undefined') {
					language = req.cookies[cookies.LANGUAGE];
					if(typeof(language) === 'undefined') {
						language = defaults.LANGUAGE;
					}
				}
				return lower(language);
			},
			constructInterfaceLanguage: function(req) {
				var language = req.query[params.INTERFACE_LANGUAGE];
				if(typeof(language) === 'undefined') {
					language = req.cookies[cookies.INTERFACE_LANGUAGE];
					if(typeof(language) === 'undefined') {
						language = defaults.INTERFACE_LANGUAGE;
					}
				}
				return lower(language);
			},
			constructPage: function(req) {
				return req.query[params.PAGE];
			},
			constructSize: function(req) {
				//return url.parse(req.url, true).query[params.SIZE];
				return defaults.PAGE_SIZE;
			},
			constructSort: function(req) {
				var sort = req.query[params.SORT];
				if(typeof(sort) === 'undefined') {
					sort = req.cookies[cookies.SORT];
					if(typeof(sort) === 'undefined') {
						sort = defaults.SORT;
					}
				}
				return upper(sort);
			},
			constructTime: function(req) {
				var time = req.query[params.TIME];
				if(typeof(time) === 'undefined') {
					time = req.cookies[cookies.TIME];
					if(typeof(time) === 'undefined') {
						time = defaults.TIME;
					}
				}
				return upper(time);
			},
			constructTimeReplies: function(req) {
				var time = req.query[params.TIME_REPLIES];
				if(typeof(time) === 'undefined') {
					time = req.cookies[cookies.TIME_REPLIES];
					if(typeof(time) === 'undefined') {
						time = defaults.TIME_REPLIES;
					}
				}
				return upper(time);
			},
			constructTags: function(req) {
				return req.query[params.TAGS];
			},
			constructCommentTypes: function(req) {
				return req.query[params.COMMENT_TYPE];
			},
			constructUser: function(req) {
				return req.query[params.USER];
			},
			constructPostingId: function(req) {
				return req.params[pathVars.POSTING];
			},
			constructCommentId: function(req) {
				return req.params[pathVars.COMMENT];
			},
			constructUserId: function(req) {
				return req.params[pathVars.USER];
			},
			constructTagId: function(req) {
				return req.params[pathVars.TAG];
			},
			constructExternalUrl: function(req) {
				return req.query[params.EXTERNAL_URL];
			},
			toBoolean: function(b) {
				if(typeof(b) !== 'undefined') {
					if((typeof(b) === 'boolean' && b) || (typeof(b.toUpperCase) !== 'undefined' && b.toUpperCase() === 'TRUE')) {
						return true;
					}
				}
				return false;
			}
		};
	});