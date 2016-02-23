define(['moment', 'js/constants/params', 'js/constants/regexes', 'js/constants/view-ids', 'js/constants/view-urls',
        'js/constants/path-variables'],
function(moment, params, regexes, viewIds, viewUrls, pathVars) {
	// use map for future checks and to avoid checking if in list
	var excludedParams = {};
	excludedParams[params.ALERT_ERROR] = true;
	excludedParams[params.ALERT_WARNING] = true;
	excludedParams[params.ALERT_INFO] = true;
	excludedParams[params.ALERT_SUCCESS] = true;
	var excludedQueryParams = [];
	
	var invertObject = function(map) {
		var inverse;
		if(typeof(map) !== 'undefined') {
			inverse = {};
			for(var key in map) {
				if(map.hasOwnProperty(key)) {
					inverse[map[key]] = key;
				}
			}
		}
		return inverse;
	};
	
	var getQueryList = function(query) {
		if(typeof(query) === 'undefined') {
			return undefined;
		} else if(Object.prototype.toString.call(query) === Object.prototype.toString.call([])){
			return query;
		} else {
			return [query];
		}
	};
	

	var constructFilteredQueryString = function(queryObject) {
		var query = {};
		for(var key in queryObject) {
			if(queryObject.hasOwnProperty(key) && !excludedParams.hasOwnProperty(key)) {
				query[key] = queryObject[key];
			}
		}
		return constructQueryString(query);
	};
	
	var constructQueryString = function(queryObject) {
		var query = queryObject || {};
		var queryString = '';
		var delimiter = '?';
		for(var key in query) {
			if(query.hasOwnProperty(key) &&
					typeof(query[key]) !== 'undefined' &&
					query[key] !== null) {
				var value = query[key];
				if(value instanceof Array) {
					for(var i = 0; i < value.length; i++) {
						try {
							queryString = queryString + delimiter + key + '=' + encodeURIComponent(value[i]);
							delimiter = '&';
						} catch(e) {
							// do nothing, it wasnt encoded properly
						}
					}
					delimiter = '&';
				} else if(typeof(value) === 'string') {
					try {
						queryString = queryString + delimiter + key + '=' + encodeURIComponent(value);
						delimiter = '&';
					} catch(e) {
						// do nothing, it wasnt encoded properly
					}
				} else {
					try {
						queryString = queryString + delimiter + key + '=' + encodeURIComponent(value);
						delimiter = '&';
					} catch(e) {
						// do nothing, it wasnt encoded properly
					}
				}
			}
		}
		return queryString;
	};
	
	var format = function(format, args) {
		if(typeof(args) !== 'undefined' &&
				args !== null) {
			if(Object.prototype.toString.call(args) === Object.prototype.toString.call([]) &&
					args.length > 0) {
				var list = [];
				var i;
				// having a list of purely defined items means that there are no accidental not replaced matches
				for(i = 0; i < args.length; i++) {
					if(typeof(args[i]) !== 'undefined' && args[i] !== null) {
						list.push(args[i]);
					}
				}
				return format.replace(/{(\d+)}/g, function(match, number) {
					return typeof list[number] !== 'undefined' ? list[number] : match;
				});
			}
			if(Object.prototype.toString.call(args) === Object.prototype.toString.call({})) {
				return format.replace(/:[A-Za-z0-9]+/g, function(match, number) {
					var m = match.substring(1, match.length);
					return (typeof(args[m]) !== 'undefined' && args[m] !== null) ? args[m] : match;
				});
			}
		}
		return format;
	};
	
	var formatUrl = function(url, pathVariables) {
		var formattedUrl = url;
		var key;
		for (key in pathVariables) {
			if(pathVariables.hasOwnProperty(key)) {
				formattedUrl = formattedUrl.replace(":" + key, pathVariables[key]);
			}
		}
		return formattedUrl;
	};
	
	var formatState = function(state, args) {
		var s = state;
		if(typeof(state) !== 'undefined' && typeof(state) === typeof('') &&
				typeof(args) !== 'undefined' && args !== null) {
			var delim = '({';
			var hasOne = false;
			for(var key in args) {
				if(args.hasOwnProperty(key)) {
					s = s + delim + key + ": '" + args[key] + "'";
					delim = ', ';
					hasOne = true;
				}
			}
			if(hasOne) {
				s = s + '})';
			}
		}
		return s;
	};
	
	var getQueryObject = function(str) {
		var query = {};
		if(typeof(str) !== 'undefined') {
			str = str.substr(1);
			var params = str.split('&');
			for(var i = 0; i < params.length; i++) {
				var pair = params[i].split('=');
				if(pair.length > 1) {
					query[pair[0]] = pair[1];
				}
			}
		}
		return query;
	};
	
	var isValidAuthenticationToken = function(token) {
		if(typeof(token) !== 'undefined' && token !== null && token !== '') {
			return true;
		}
		return false;
	};
	
	var getDelimitedParseFunc = function(delim) {
		return function(str) {
			var list = [];
			if(typeof(str) !== 'undefined') {
				var split = str.split(delim);
				if(typeof(split) !== 'undefined') {
					var i, item;
					for(i = 0; i < split.length; i++) {
						item = split[i];
						if(typeof(item) !== 'undefined' && item !== '') {
							list.push(item);
						}
					}
				}
			}
			return list;
		};
	};
	
	var highestKeyValue = function(map) {
		var largest, i, value;
		if(typeof(map) !== 'undefined') {
			for(i in map) {
				if(map.hasOwnProperty(i)) {
					if(typeof(largest) === 'undefined' || typeof(value) === 'undefined' || map[i] > value) {
						largest = i;
						value = map[i];
					}
				}
			}
		}
		return largest;
	};
	
	/*jslint bitwise: true */
	var hashString = function(str) {
		if(typeof(str) === 'undefined' || str.length === 0) {
			return 0;
		}
		var hash = 0, i, chr;
		for(i = 0; i < str.length; i++) {
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	};
	
	return {
		isExternalUrl: function(host, targetHost) {
			if(typeof(host) !== 'undefined' && typeof(targetHost) !== 'undefined') {
				return host !== targetHost;
			}
			return true;
		},
		getStringHash: hashString,
		isObjectEmpty: function(obj) {
			if(obj === null) {
				return true;
			}
			if(obj.length > 0) {
				return false;
			}
			if(obj.length === 0) {
				return true;
			}
			
			for (var key in obj) {
				if(hasOwnProperty.call(obj, key)) {
					return false;
				}
			}
			
			return true;
		},
		getHighestKeyValue: highestKeyValue,
		getCurrencySymbol: function(locale) {
			// change this later if need be
			return '$';
		},
		format: format,
		formatUrl: formatUrl,
		formatState: formatState,
		constructHelpLink: function(topic, section) {
			if(typeof(topic) === 'undefined') {
				return viewUrls.HELP;
			}
			
			var link;
			var args = {};
			args[pathVars.HELP] = topic;
			link = formatUrl(viewUrls.HELP_ID, args);
			if(typeof(section) !== 'undefined') {
				link = link + '?' + params.SCROLL_TO + '=' + section;
			}
			return link;
		},
		constructNJTermsLink: function(section) {
			if(typeof(section) === 'undefined') {
				return viewUrls.TERMS;
			}
			
			return viewUrls.TERMS + '#NJ' + section;
		},
		constructTermsLink: function(section) {
			if(typeof(section) === 'undefined') {
				return viewUrls.TERMS;
			}
			
			return viewUrls.TERMS + '?' + params.SCROLL_TO + '=' + section;
		},
		constructTermsScrollToLink: function(section) {
			return '#' + section;
		},
		constructPath: function(path, pathVars, params) {
			return format(path, pathVars) + constructQueryString(params);
		},
		constructQueryPathString: function(path, pathVars, query) {
			return format(path, pathVars) + query;
		},
		addQuery: function(name, value, queryObject) {
			var query = {};
			var key;
			for(key in queryObject) {
				if(queryObject.hasOwnProperty(key) && !excludedParams.hasOwnProperty(key)) {
					query[key] = queryObject[key];
				}
			}
			try {
				query[name] = encodeURIComponent(value);
			} catch(e) {
				// do nothing, it wasnt encoded properly
			}
			return constructQueryString(query);
		},
		constructQueryString: constructQueryString,
		constructFilteredQueryString: constructFilteredQueryString,
		getQueryList: getQueryList,
		getAnchorHref: function() {
			return 'javascript:void(0);';
		},
		getTimeSince: function(timestamp) {
			return moment.utc(timestamp).fromNow();
		},
		getCalendarDate: function(timestamp) {
			return moment.utc(timestamp).calendar();
		},
		getTimeISO: function(timestamp) {
			if(typeof(timestamp) !== 'undefined') {
				return (new Date(timestamp)).toISOString();
			}
			return undefined;
		},
		invertObject: invertObject,
		parseTags: getDelimitedParseFunc(regexes.TAGS_DELIMITER_STRING),
		parseRoles: getDelimitedParseFunc(regexes.ROLES_DELIMITER_STRING),
		parsePendingActions: getDelimitedParseFunc(regexes.PENDING_ACTIONS_DELIMITER_STRING),
		getEncodedTitle: function(title) {
			if(typeof(title) !== 'undefined') {
				var replaced = title.toLowerCase().replace(regexes.TITLE, ' ');
				return replaced.trim().replace(regexes.TITLE, '-');
			}
			return title;
		},
		createFullTitle: function(base, title, separator) {
			if(typeof(title) === 'undefined' || typeof(separator) === 'undefined') {
				return base;
			}
			return title + separator + base;
		},
		getTourId: function(section, subSection, authed) {
			var a = 'f';
			if(authed) {
				a = 't';
			}
			return viewIds.TOUR_SECTION + '-' + section + '-' + a + '-' + subSection;
		},
		isValidAuthenticationToken: isValidAuthenticationToken,
		tagify: function(tags) {
			var str = '';
			if(typeof(tags) === 'undefined' || !Array.isArray(tags)) {
				return str;
			}
			for(var i = 0; i < tags.length; i++) {
				str = str + ' [ ' + tags[i] + ' ] ';
			}
			return str;
		},
		getNestedValue: function(obj, str) {
			var arr = str.split('.');
			/* jshint ignore:start */
			while(arr.length && (obj = obj[arr.shift()])) {}
			return obj;
			/* jshint ignore:end */
		},
		setNestedValue: function(obj, str, v) {
			var arr = str.split('.');
			/* jshint ignore:start */
			while(arr.length > 1 && (obj = obj[arr.shift()])) {}
			obj[arr.shift()] = v;
			/* jshint ignore:end */
		},
		getQueryObject: getQueryObject,
		getBaseUrl: function($location) {
			var protocol = $location.protocol() || 'http';
			var host = $location.host();
			var port = $location.port();
			var baseUrl = protocol + '://' + host;
			if(typeof(port) !== 'undefined') {
				baseUrl = baseUrl + ':' + port;
			}
			return baseUrl;
		}
	};
});