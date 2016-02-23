define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params', 'js/constants/chained-keys',
        'js/constants/content-types', 'admin-js/constants/admin-partials'],
		function(service, $, ng, apiUrls, params, chainedKeys, contentTypes, adminPartials) {
	
	service.factory('AUser', ['ApiData', 'Authentication', 'pyaUser', function(ApiData, Authentication, pyaUser) {
		
		var getChained = function(user) {
			var chained = {};
			chained[chainedKeys.CURRENT] = function(callback, error, apiError) {
				pyaUser.currentUser(callback, error, apiError, user, true);
			};
			chained[chainedKeys.BALANCE] = function(callback, error, apiError) {
				pyaUser.getBalance(callback, error, apiError, user, true);
			};
			chained[chainedKeys.ROLES] = function(callback, error, apiError) {
				pyaUser.getRoles(callback, error, apiError, user, true);
			};
			return chained;
		};
		
		return {
			user: function($scope, user, success, fail, apiFail, autoSub, args) {
				var authed = Authentication.isAuthenticated();
				
				var method = function(callback, error, apiError) {
					var c = callback;
					if(typeof(success) === 'function') {
						c = success(callback);
					}
					var e = error;
					if(typeof(fail) === 'function') {
						e = fail(error);
					}
					var aE = error;
					if(typeof(apiFail) === 'function') {
						aE = apiFail(apiError);
					}
					pyaUser.getProfile(c, e, aE, user);
				};
				var chained = getChained(user);

				var data = ApiData.getData({
					scope: $scope,
					view: adminPartials.USER,
					method: method,
					callChained: authed,
					chained: chained,
					autoLoad: false,
					autoSub: autoSub,
					args: args
				});
				return data;
			}
		};
	}]);
});