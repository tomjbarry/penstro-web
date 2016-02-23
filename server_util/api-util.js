define(['request',
        'server_util/render',
        'js/constants/api',
        'js/constants/api-urls',
        'js/constants/params',
        'js/constants/response-codes',
        'js/util/utils'],
		function(request, render, api, urls, params, responseCodes, utils) {
	var GET = 'GET';
	var POST = 'POST';
	var DELETE = 'DELETE';
	
	var handleApiException = function() {
		// do nothing
	};
	
	var handleApiResponse = function(apiResponse, callback, errorCallback, apiCallback) {
		if(typeof(apiResponse) !== 'undefined') {
			var code = apiResponse.code;
			var dto = apiResponse.dto;
			var page = apiResponse.page;
			if(code === responseCodes.SUCCESS ||
					code === responseCodes.CREATED ||
					code === responseCodes.DELETED) {
				if(typeof(callback) !== 'undefined' && callback !== null) {
					callback(code, dto, page);
				}
			} else {
				if(typeof(errorCallback) !== 'undefined' && errorCallback !== null) {
					errorCallback(code, dto);
				}
			}
		} else {
			if(typeof(apiCallback) !== 'undefined') {
				apiCallback();
			} else {
				handleApiException();
			}
		}
	};
	
	var pyRequest = function(method, path, pathVars,
			params, callback, errorCallback, apiCallback) {
		// user agent set automatically by browsers, but not for node
		var headers = {
			'Accept': 'application/json',
			'User-Agent': 'pyweb'
		};
		if(method === POST) {
			headers['Content-Type'] = 'application/json';
		}
		var options = {
			// disable this if we aren't using our own server. if the certificate is invalid, we have bigger problems
			strictSSL: false,
			url: api.getBaseUrl() + utils.constructPath(path, pathVars, params),
			headers: headers,
			method: method
		};
		var c = function(error, res, body) {
			var errorFunc = function() {
				if(typeof(apiCallback) !== 'undefined') {
					apiCallback();
				} else {
					handleApiException(res);
				}
			};
			/*
			var str = '';
			res.on('data', function(chunk) {
				str += chunk;
			});
			res.on('end', function() {
				var apiResponse;
				try {
					apiResponse = JSON.parse(str);
					handleApiResponse(apiResponse, callback, errorCallback, apiCallback);
				} catch(e) {
					if(typeof(apiCallback) !== 'undefined') {
						apiCallback();
					} else {
						handleApiException(res);
					}
				}
			});
			res.on('error', function() {
				if(typeof(apiCallback) !== 'undefined') {
					apiCallback();
				} else {
					handleApiException(res);
				}
			});
			*/
			if(error) {
				errorFunc();
				console.log(error);
				return;
			}
			// only success should be used currently
			if(res.statusCode === responseCodes.SUCCESS || res.statusCode === responseCodes.CREATED || res.statusCode === responseCodes.DELETED) {
				try {
					handleApiResponse(JSON.parse(body), callback, errorCallback, apiCallback);
				} catch(e) {
					errorFunc();
				}
			} else {
				errorFunc();
			}
		};
		var r = request(options, c);
		/*
		r.on('error', function(ex) {
			if(typeof(apiCallback) !== 'undefined') {
				apiCallback();
			} else {
				handleApiException();
			}
		});
		r.end();*/
	};
	return {
		postingPreviews: function(page, size, sort, time,
				author, language, warning, tags, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.USER] = author;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			p[params.TAGS] = tags;
			pyRequest(GET, urls.POSTINGS, null, p, callback, errorCallback, apiCallback);
		},
		posting: function(id, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.WARNING] = warning;
			pyRequest(GET, urls.POSTINGS_ID, [id], p, callback, errorCallback, apiCallback);
		},
		postingComments: function(id, page, size, sort, time,
				language, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			pyRequest(GET, urls.POSTINGS_COMMENTS, [id], p, callback, errorCallback, apiCallback);
		},
		commentPreviews: function(page, size, sort, time,
				author, language, warning, types, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			p[params.COMMENT_TYPE] = types;
			pyRequest(GET, urls.COMMENTS, null, p, callback, errorCallback, apiCallback);
		},
		comment: function(id, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.WARNING] = warning;
			pyRequest(GET, urls.COMMENTS_ID, [id], p, callback, errorCallback, apiCallback);
		},
		commentComments: function(id, page, size, sort, time,
				language, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			pyRequest(GET, urls.COMMENTS_COMMENTS, [id], p, callback, errorCallback, apiCallback);
		},
		tagPreviews: function(page, size, time, language, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			pyRequest(GET, urls.TAGS, null, p, callback, errorCallback, apiCallback);
		},
		tag: function(id, language, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.LANGUAGE] = language;
			pyRequest(GET, urls.TAGS_ID, [id], p, callback, errorCallback, apiCallback);
		},
		tagComments: function(id, page, size, sort, time,
				language, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			pyRequest(GET, urls.TAGS_COMMENTS, [id], p, callback, errorCallback, apiCallback);
		},
		userPreviews: function(page, size, time, language, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			pyRequest(GET, urls.USERS, null, p, callback, errorCallback, apiCallback);
		},
		user: function(id, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.WARNING] = warning;
			pyRequest(GET, urls.USERS_ID, [id], p, callback, errorCallback, apiCallback);
		},
		userComments: function(id, page, size, sort, time,
				language, warning, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.SORT] = sort;
			p[params.TIME] = time;
			p[params.LANGUAGE] = language;
			p[params.WARNING] = warning;
			pyRequest(GET, urls.USERS_COMMENTS, [id], p, callback, errorCallback, apiCallback);
		},
		userFeed: function(id, page, size, events, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			p[params.EVENT] = events;
			pyRequest(GET, urls.USERS_FEED, [id], p, callback, errorCallback, apiCallback);
		},
		userFollowees: function(id, page, size, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			pyRequest(GET, urls.USERS_FOLLOWEES, [id], p, callback, errorCallback, apiCallback);
		},
		userFollowers: function(id, page, size, callback, errorCallback, apiCallback) {
			var p = {};
			p[params.PAGE] = page;
			p[params.SIZE] = size;
			pyRequest(GET, urls.USERS_FOLLOWERS, [id], p, callback, errorCallback, apiCallback);
		}
	};
});