define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params', 'js/constants/chained-keys', 'js/constants/content-types',
        'js/constants/partials'],
		function(service, $, ng, apiUrls, params, chainedKeys, contentTypes, partials) {
	
	service.factory('User', ['Authentication', 'ApiData', 'pyUser', 'pyFollow', 'pyBlock', 'pyProfile', 'pyMessage',
	function(Authentication, ApiData, pyUser, pyFollow, pyBlock, pyProfile, pyMessage) {
		
		var getChained = function(user) {
			/*
			var chained = {};
			chained[chainedKeys.FOLLOW] = function(callback, error, apiError) {
				pyFollow.getFollowee(callback, error, apiError, user, true);
			};
			chained[chainedKeys.BLOCK] = function(callback, error, apiError) {
				pyBlock.getBlocked(callback, error, apiError, user, true);
			};
			chained[chainedKeys.APPRECIATION_RESPONSE] = function(callback, error, apiError) {
				pyUser.appreciationResponse(callback, error, apiError, user, true);
			};
			return chained;
			*/
			return undefined;
		};
		
		return {
			setUserSingle: function(user, success) {
				/*
				var authed = Authentication.isAuthenticated();
				Authentication.manageEvent(undefined, function(event, authenticated) {
					authed = authenticated;
					if(authed) {
						Single.refreshChained();
					}
				});
				
				var method = function(callback, error, apiError) {
					var c = callback;
					if(typeof(success) === 'function') {
						c = success(callback);
					}
					pyUser.user(c, error, apiError, user);
				};
				var chained = {};
				chained[chainedKeys.FOLLOW] = function(callback, error, apiError) {
					pyFollow.getFollowee(callback, error, apiError, user, true);
				};
				chained[chainedKeys.BLOCK] = function(callback, error, apiError) {
					pyBlock.getBlocked(callback, error, apiError, user, true);
				};
				chained[chainedKeys.APPRECIATION_RESPONSE] = function(callback, error, apiError) {
					pyUser.appreciationResponse(callback, error, apiError, user, true);
				};
				chained[chainedKeys.CONVERSATION] = function(callback, error, apiError) {
					pyMessage.getConversation(callback, error, apiError, user, true);
				};
				if(Single.stale()) {
					Single.setMethod(contentTypes.USER, method, chained, authed);
				}
				*/
			},
			setSelfSingle: function(success) {
				/*
				var method = function(callback, error, apiError) {
					var c = callback;
					if(typeof(success) === 'function') {
						c = success(callback);
					}
					pyProfile.getProfile(c, error, apiError);
				};
				if(Single.stale()) {
					Single.setMethod(contentTypes.CURRENT, method);
				}
				*/
			},
			self: function($scope, success, fail, apiFail, autoSub, args) {
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
					pyProfile.getProfile(c, e, aE);
				};

				var data = ApiData.getData({
					scope: $scope,
					view: partials.CURRENT,
					method: method,
					autoLoad: false,
					autoSub: autoSub,
					args: args
				});
				return data;
			},
			userChained: function(code, dto, p) {
				return getChained(dto.username.username);
			},
			user: function($scope, user, success, fail, apiFail, autoSub, args) {
				
				var authed = Authentication.isAuthenticated();
				/*
				Authentication.manageEvent(undefined, function(event, authenticated) {
					authed = authenticated;
					if(authed && ng.isDefined(data.single)) {
						// DO NOT DO THIS! COULD RESULT IN A LOT OF REQUESTS IF THERE ARE A LOT OF USERS IN VIEW
						//data.single.refreshChained();
					}
				});*/
				
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
					pyUser.user(c, e, aE, user);
				};
				var chained = getChained(user);

				var data = ApiData.getData({
					scope: $scope,
					view: partials.USER,
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