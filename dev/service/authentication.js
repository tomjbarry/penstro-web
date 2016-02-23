define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n',
        'js/constants/cookies', 'js/constants/events', 'js/constants/states', 'js/constants/values'],
		function(service, $, ng, utils, i18n, cookies, events, states, values) {
	service.factory('Authentication', ['$rootScope', '$state', 'AutoRefresh', 'Cookies', 'Alerts', 'EventManager',
		function($rootScope, $state, AutoRefresh, Cookies, Alerts, EventManager) {
	
			var authObj = {};
			var lastAuthed;
	
			authObj.manageEvent = function(scope, callback) {
				EventManager.manage(events.LOGIN_CHANGE, scope, callback);
			};
			
			authObj.getToken = function() {
				var at = Cookies.get(cookies.AUTHENTICATION_TOKEN);
				// now checking for this with auto-refresh, not needed
				/*
				// in case of manual clearing of token or other error
				if(typeof(at) === 'undefined' && authObj.token !== at) {
					i18n(function(t) {
						Alerts.error(t('alerts:noToken'));
					});
				}
				*/
				if(!Cookies.enabled()) {
					return authObj.token;
				}
				
				if(typeof(authObj.token) === 'undefined' || authObj.token !== at) {
					authObj.token = at;
				}
				return authObj.token;
			};
			authObj.isAuthenticated = function() {
				return utils.isValidAuthenticationToken(authObj.getToken());
			};
			lastAuthed = authObj.isAuthenticated();
			
			var refreshed = function() {
				if((authObj.isAuthenticated() && !lastAuthed) || (!authObj.isAuthenticated() && lastAuthed)) {
					// another tab logged in/out
					loginChange(authObj.isAuthenticated());
				}
			};
			
			AutoRefresh.manageRefresh(refreshed, values.AUTHENTICATION_CHECK);
			
			var loginChange = function(authenticated, forced) {
				var f = false;
				if(!authenticated && lastAuthed && forced) {
					f = true;
				}
				lastAuthed = authenticated;
				$rootScope.$broadcast(events.PRE_LOGIN_CHANGE, authenticated, f);
				$rootScope.$broadcast(events.LOGIN_CHANGE, authenticated, f);
			};
			
			authObj.setToken = function(at, forced) {
				if(typeof(at) === 'undefined') {
					if(typeof(authObj.getToken()) === 'undefined') {
						return;
					}
					authObj.token = undefined;
					// just in case we dont hit the end of the eval
					Cookies.remove(cookies.AUTHENTICATION_TOKEN);
					loginChange(false, forced);
				} else {
					if(authObj.getToken() === at) {
						return;
					}
					authObj.token = at;
					Cookies.set(cookies.AUTHENTICATION_TOKEN, at);
					loginChange(true, forced);
				}
			};
			return authObj;
	}]);
});