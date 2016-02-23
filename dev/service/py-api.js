define([ './module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils', 'js/constants/view-urls',
				'js/constants/api', 'js/constants/response-codes', 'js/constants/params', 'js/constants/states'],
function(service, $, ng, i18n, utils, viewUrls,
		api, responseCodes, params, states) {

	var defaultCallback = function(code, dto, page) {
		return;
	};

	var defaultErrorCallback = function(code, dto) {
		return;
	};

	var getDefaultApiCallback = function(Alerts) {
		return function(data, status) {
			i18n(function(t) {
				Alerts.error(t('alerts:apiError'));
				return;
			});
		};
	};

	var handleApiResponse = function($http, $state, Authentication, Alerts, Reloader, method,
			path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, stop) {
		if (data !== 'undefined') {
			var code = data.code;
			var dto = data.dto;
			var page = data.page;
			if (code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
				if (typeof (callback) !== 'undefined' && callback !== null) {
					callback(code, dto, page);
				}
			} else {
				if(handleAllErrors) {
					if (typeof (errorCallback) !== 'undefined' && errorCallback !== null) {
						errorCallback(code, dto);
					}
				} else {
					var link = $state.href(states.LOGGED_OUT);
					if (code === responseCodes.EXPIRED) {
						i18n(function(t) {
							Authentication.setToken(undefined, true);
							Alerts.warning(t('alerts:expired'), link);
							if(!stop) {
								pyRequest($http, $state, Authentication, Alerts, Reloader, method,
													path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, true);
							}
						});
					} else if (code === responseCodes.THEFT) {
						i18n(function(t) {
							Authentication.setToken(undefined, true);
							Alerts.warning(t('alerts:theft'), link);
							if(!stop) {
								pyRequest($http, $state, Authentication, Alerts, Reloader, method,
													path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, true);
							}
						});
					} else if (code === responseCodes.LOCKED) {
						i18n(function(t) {
							Authentication.setToken(undefined, true);
							Alerts.warning(t('alerts:locked'), link);
							if(!stop) {
								pyRequest($http, $state, Authentication, Alerts, Reloader, method,
													path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, true);
							}
						});
					} else if (code === responseCodes.DENIED) {
						i18n(function(t) {
							if(Authentication.isAuthenticated()) {
								Authentication.setToken(undefined, true);
								Alerts.warning(t('alerts:denied'), link);
								if(!stop) {
									pyRequest($http, $state, Authentication, Alerts, Reloader, method,
														path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, true);
								}
							} else {
								Authentication.setToken(undefined, true);
								Alerts.warning(t('alerts:deniedUnauthenticated'), link);
								if(!stop) {
									pyRequest($http, $state, Authentication, Alerts, Reloader, method,
														path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, true);
								}
							}
						});
					} else if (code === responseCodes.FEATURE_DISABLED) {
						i18n(function(t) {
							Alerts.warning(t('alerts:featureDisabled'));
							$state.go(states.DEFAULT, undefined, {reload: true});
							// dont check for !stop, thats for the case where the user is logged out and the request is retried
						});
					} else if (typeof (errorCallback) !== 'undefined' && errorCallback !== null) {
						errorCallback(code, dto);
					}
				}
			}
		}
	};

	var pyRequest = function($http, $state, Authentication, Alerts, Reloader, method,
			path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, stop) {
		// override $http defaults
		var headers = {
			'Accept': 'application/json'
		};
		/* already done by $http defaults
		if(method === 'POST') {
			headers['Content-Type'] = 'application/json';
		}*/
		headers[api.ANTICACHE_HEADER] = new Date().getTime();
		if (Authentication.isAuthenticated()) {
			headers[api.AUTHENTICATION_HEADER] = Authentication.getToken();
		}
		var options = {
			url : api.getBaseUrl() + utils.constructPath(path, pathVars, params),
			method : method,
			headers : headers
		};
		if (typeof (data) !== 'undefined') {
			options.data = ng.toJson(data);
		}

		$http(options).success(function(data, status, headers, config) {
			handleApiResponse($http, $state, Authentication, Alerts, Reloader, method,
			path, pathVars, params, data, callback, errorCallback, apiCallback, handleAllErrors, stop);
		}).error(function(data, status, headers, config) {
			if(typeof(data) === 'undefined' || data === null) {
				// all checks assume it is either undefined or not
				data = undefined;
			}
			if (typeof (apiCallback) !== 'undefined') {
				apiCallback(data, status);
			} else {
				getDefaultApiCallback(Alerts)(data, status);
			}
		});
	};

	service.factory('pyApi', ['$http',
		'$state',
		'Authentication',
		'Alerts',
		'Reloader',
		function($http, $state, Authentication, Alerts, Reloader) {
			return {
				GET : 'GET',
				POST : 'POST',
				DELETE : 'DELETE',
				pyRequest : function(method, path, pathVars, params, data,
						callbackFunc, errorCallbackFunc, apiCallbackFunc, handleAllErrors) {
					var callback = callbackFunc || defaultCallback;
					var errorCallback = errorCallbackFunc || defaultErrorCallback;
					var apiCallback = apiCallbackFunc || getDefaultApiCallback(Alerts);
					var handleAll = handleAllErrors || false;
					return pyRequest($http, $state, Authentication, Alerts, Reloader,
							method, path, pathVars, params, data, callback,
							errorCallback, apiCallback, handleAll);
				}
			};
		}]);
});