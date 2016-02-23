define(['./module', 'jquery', 'angular', 'js/util/i18n',
        'js/constants/cookies', 'js/constants/params', 'js/constants/defaults', 'js/constants/events'],
		function(service, $, ng, i18n, cookies, params, defaults, events) {
	
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
	
	var cached = {};
	
	service.factory('Options', ['$rootScope', 'Cookies', '$location', 'Alerts', 'Reloader', 'pyProfile',
															function($rootScope, Cookies, $location, Alerts, Reloader, pyProfile) {
		
		var resetWarning = function() {
			setWarning(defaults.WARNING);
		};
		
		// replace changes the url without refreshing the view or adding to the history
		// DO NOT use replace, as these methods may be called on each page change
		var setLanguage = function(l) {
			if(typeof(l) !== 'undefined') {
				if(l === defaults.LANGUAGE) {
					Cookies.remove(cookies.LANGUAGE);
					cached[cookies.LANGUAGE] = undefined;
				} else {
					Cookies.set(cookies.LANGUAGE, l);
					cached[cookies.LANGUAGE] = l;
				}
			}
		};
		
		var getInterfaceLanguage = function() {
			var language = Cookies.get(cookies.INTERFACE_LANGUAGE);
			if(typeof(language) === 'undefined') {
				language = cached[cookies.INTERFACE_LANGUAGE];
				if(typeof(language) === 'undefined') {
					language = defaults.INTERFACE_LANGUAGE;
				}
			}
			return lower(language);
		};
		var setInterfaceLanguage = function(l) {
			if(typeof(l) !== 'undefined') {
				var current = getInterfaceLanguage();
				if(l === defaults.INTERFACE_LANGUAGE) {
					Cookies.remove(cookies.INTERFACE_LANGUAGE);
					cached[cookies.INTERFACE_LANGUAGE] = undefined;
				} else {
					Cookies.set(cookies.INTERFACE_LANGUAGE, l);
					cached[cookies.INTERFACE_LANGUAGE] = l;
				}
				if(upper(current) !== upper(l)) {
					Reloader.fullRefresh();
				}
			}
		};
		var setWarning = function(w) {
			if(typeof(w) !== 'undefined') {
				if(w === defaults.WARNING) {
					Cookies.remove(cookies.WARNING);
					cached[cookies.WARNING] = undefined;
				} else {
					Cookies.set(cookies.WARNING, w);
					cached[cookies.WARNING] = w;
				}
			}
		};
		var setSort = function(s) {
			if(typeof(s) !== 'undefined') {
				if(s === defaults.SORT) {
					Cookies.remove(cookies.SORT);
					cached[cookies.SORT] = undefined;
				} else {
					Cookies.set(cookies.SORT, s);
					cached[cookies.SORT] = s;
				}
			}
		};
		var setTime = function(t) {
			if(typeof(t) !== 'undefined') {
				if(t === defaults.TIME) {
					Cookies.remove(cookies.TIME);
					cached[cookies.TIME] = undefined;
				} else {
					Cookies.set(cookies.TIME, t);
					cached[cookies.TIME] = t;
				}
			}
		};
		var setTimeReplies = function(t) {
			if(typeof(t) !== 'undefined') {
				if(t === defaults.TIME_REPLIES) {
					Cookies.remove(cookies.TIME_REPLIES);
					cached[cookies.TIME_REPLIES] = undefined;
				} else {
					Cookies.set(cookies.TIME_REPLIES, t);
					cached[cookies.TIME_REPLIES] = t;
				}
			}
		};
		
		var setPage = function(p) {
			if(p === 0) {
				p = undefined;
			}
			$location.search(params.PAGE, p);
		};
		
		var getPage = function() {
			return parseInt($location.search()[params.PAGE] || '0', 10);
		};
		
		var getPageSize = function() {
			return defaults.PAGE_SIZE;
		};
		
		var getLanguage = function() {
			var language = Cookies.get(cookies.LANGUAGE);
			if(typeof(language) === 'undefined') {
				language = cached[cookies.LANGUAGE];
				if(typeof(language) === 'undefined') {
					language = defaults.LANGUAGE;
				}
			}
			return lower(language);
		};
		var getWarning = function() {
			var warning = Cookies.get(cookies.WARNING);
			if(typeof(warning) === 'undefined') {
				warning = cached[cookies.WARNING];
				if(typeof(warning) === 'undefined') {
					warning = defaults.WARNING;
				}
			}
			return (typeof(warning) === 'boolean' && warning) || (upper(warning) === 'TRUE');
		};
		var getSort = function() {
			var sort = Cookies.get(cookies.SORT);
			if(typeof(sort) === 'undefined') {
				sort = cached[cookies.SORT];
				if(typeof(sort) === 'undefined') {
					sort = defaults.SORT;
				}
			}
			return upper(sort);
		};
		var getTime = function() {
			var time = Cookies.get(cookies.TIME);
			if(typeof(time) === 'undefined') {
				time = cached[cookies.TIME];
				if(typeof(time) === 'undefined') {
					time = defaults.TIME;
				}
			}
			return upper(time);
		};
		var getTimeReplies = function() {
			var time = Cookies.get(cookies.TIME_REPLIES);
			if(typeof(time) === 'undefined') {
				time = cached[cookies.TIME_REPLIES];
				if(typeof(time) === 'undefined') {
					time = defaults.TIME_REPLIES;
				}
			}
			return upper(time);
		};
		/*
		var setAutoPreview = function(a) {
			if(typeof(a) !== 'undefined') {
				if(a === defaults.AUTO_PREVIEW) {
					Cookies.remove(cookies.AUTO_PREVIEW);
					cached[cookies.AUTO_PREVIEW] = undefined;
				} else {
					Cookies.set(cookies.AUTO_PREVIEW, a);
					cached[cookies.AUTO_PREVIEW] = a;
				}
			}
		};
		var getAutoPreview = function() {
			var ap = Cookies.get(cookies.AUTO_PREVIEW);
			if(typeof(ap) === 'undefined') {
				ap = cached[cookies.AUTO_PREVIEW];
				if(typeof(ap) === 'undefined') {
					ap = defaults.AUTO_PREVIEW;
				}
			}
			return (typeof(ap) === 'boolean' && ap) || (upper(ap) === 'TRUE');
		};
		*/
		
		setLanguage($location.search()[params.LANGUAGE]);
		setWarning($location.search()[params.WARNING]);
		setSort($location.search()[params.SORT]);
		setTime($location.search()[params.TIME]);
		setTimeReplies($location.search()[params.TIME_REPLIES]);
		
		/*
		
		var settingsSuccess = function(code, dto, page) {
			setLanguage(dto.language);
			setInterfaceLanguage(dto.interfaceLanguage);
		};
		
		var settingsError = function() {
			i18n(function(t) {
				Alerts.warning(t('alerts:user.settingsError'));
			});
		};
		
		$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
			if(authenticated) {
				pyProfile.getSettings(settingsSuccess, settingsError, settingsError);
			}
		});
		
		*/
		
		return {
			setPage: setPage,
			setLanguage: setLanguage,
			setInterfaceLanguage: setInterfaceLanguage,
			setWarning: setWarning,
			setSort: setSort,
			setTime: setTime,
			setTimeReplies: setTimeReplies,
			//setAutoPreview: setAutoPreview,
			
			getPageSize: getPageSize,
			getPage: getPage,
			getLanguage: getLanguage,
			getInterfaceLanguage: getInterfaceLanguage,
			getWarning: getWarning,
			getSort: getSort,
			getTime: getTime,
			getTimeReplies: getTimeReplies,
			//getAutoPreview: getAutoPreview,
			
			resetWarning: resetWarning
		};
	}]);
});