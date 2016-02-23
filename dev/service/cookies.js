define(['./module', 'jquery', 'angular', 'jquery-cookie', 'js/constants/cookies'],
		function(service, $, ng, jqueryCookie, cookies) {
	
	var cookieOptions = cookies.getCookieOptions();
	
	var options = {
		domain: cookieOptions.domain,
		path: cookieOptions.path,
		secure: cookieOptions.secure
	};
	
	var removeCookie = function(name) {
		$.removeCookie(name, options);
	};
	
	var set = function(name, value) {
		if(typeof(value) === 'undefined') {
			removeCookie(name);
		} else {
			$.cookie(name, value, options);
		}
	};
	
	var get = function(name) {
		// to prevent check for if name is undefined and it returns all cookies
		return $.cookie()[name];
	};
	
	service.factory('Cookies', function() {
		return {
			enabled: function() {
				// dont do complicated browser checking. if the plugin doesnt work for that browser, then its considered disabled for our purposes
				set(cookies.TEST_COOKIES_ENABLED, '1');
				var result = get(cookies.TEST_COOKIES_ENABLED);
				if(result === '1') {
					return true;
				}
				return false;
			},
			set: set,
			get: get,
			getAll: function() {
				return $.cookie();
			},
			remove: removeCookie
		};
	});
});