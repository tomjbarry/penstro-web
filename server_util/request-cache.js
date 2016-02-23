define(['memory-cache', 'server_util/app-settings', 'server_util/param-util'], function(cache, settings, paramUtil) {
	var cacheSettings = settings.getCacheSettings();
	
	var getString = function(param) {
		if(typeof(param) !== 'undefined') {
			return '' + param;
		}
		return '';
	};
	
	var getMethod = function(req) {
		return req.method;
	};
	
	var getPath = function(req) {
		return req.path;
	};
	
	var getParams = function(req) {
		return '?' + getString(paramUtil.constructPage(req)) + '&' +
			getString(paramUtil.constructSort(req)) + '&' +
			getString(paramUtil.constructTime(req)) + '&' +
			getString(paramUtil.constructTimeReplies(req)) + '&' +
			getString(paramUtil.constructWarning(req)) + '&' +
			getString(paramUtil.constructLanguage(req)) + '&' +
			getString(paramUtil.constructInterfaceLanguage(req));
	};
	
	var getKeyByRequest = function(req) {
		if(typeof(req) !== 'undefined') {
			return getMethod(req) + getPath(req) + getParams(req);
		}
		return;
	};
	
	if(cacheSettings.enabled) {
		return {
			getByRequest: function(req) {
				var key = getKeyByRequest(req);
				if(typeof(key) === 'undefined') {
					return;
				}
				return cache.get(key);
			},
			setByRequest: function(req, value) {
				var key = getKeyByRequest(req);
				if(typeof(key) === 'undefined' || (cacheSettings.maxSize > 0 && cache.size() >= cacheSettings.maxSize)) {
					return false;
				}
				cache.put(getKeyByRequest(req), value, cacheSettings.ttl);
				return true;
			}
		};
	} else {
		return {
			getByRequest: function(){},
			setByRequest: function(){}
		};
	}
});