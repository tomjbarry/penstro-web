define(['./module', 'jquery', 'angular', 'js/util/i18n',
        'js/constants/events', 'js/constants/states', 'js/constants/roles'],
		function(service, $, ng, i18n, events, states, roles) {
	service.factory('RouteCheck', ['$rootScope', '$location', '$state', 'Authentication', 'Alerts', 'CurrentUser',
																		function($rootScope, $location, $state, Authentication, Alerts, CurrentUser) {
		
		var stateChangeStartCallbacks = [];
		var transitionState;
		
		var roleLinks = {};
		roleLinks[roles.overrideRoles.UNACCEPTED] = $state.href(states.TERMS);
		roleLinks[roles.overrideRoles.DELETED] = $state.href(states.DELETED);
		
		var authenticationFailure = function(failure, requiredAuthentication) {
			i18n(function(t) {
				if(requiredAuthentication) {
					Alerts.warning(t('alerts:authenticationRequired'));
				} else {
					Alerts.warning(t('alerts:authenticationNotAllowed'));
				}
				failure();
			});
		};
		var checkAuthenticationFailure = function(failure, state) {
			if(typeof(state) !== 'undefined' && typeof(state.authentication) !== 'undefined') {
				if(state.authentication && !Authentication.isAuthenticated()) {
					authenticationFailure(failure, true);
					return true;
				} else if(!state.authentication && Authentication.isAuthenticated()) {
					authenticationFailure(failure, false);
					return true;
				}
			}
			return false;
		};
		
		// ensures state.go only executes once if a single permission fails
		var getPermissionResult = function(failure) {
			// role specific part of function for alert
			return function(role, reverse) {
				// called if the permission fails;
				return function(result) {
					if(reverse) {
						result = !result;
					}
					if(result) {
						i18n(function(t) {
							if(typeof(role) !== 'undefined') {
								if(reverse) {
									Alerts.warning(t('alerts:role.' + role), roleLinks[role]);
								} else {
									Alerts.warning(t('alerts:overrideRole.' + role), roleLinks[role]);
								}
							}
							failure();
						});
					}
				};
			};
		};
		
		var checkPermissions = function(failure, state) {
			if(typeof(state) !== 'undefined' && ((typeof(state.overrideRoles) !== 'undefined' && state.overrideRoles.length > 0) || (typeof(state.roles) !== 'undefined' && state.roles.length > 0))) {
				if(!Authentication.isAuthenticated()) {
					authenticationFailure(failure, true);
					return;
				}
				
				var permissionResult = getPermissionResult(failure);
				
				var apiFailure = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:apiError'));
						failure();
					});
				};
				
				CurrentUser.refreshRoles();
				var i, r;
				if(typeof(state.roles) !== 'undefined' && state.roles.length > 0) {
					for(i = 0; i < state.roles.length; i++) {
						r = state.roles[i];
						CurrentUser.hasRole(r, permissionResult(r, true), apiFailure);
					}
				}
				if(typeof(state.overrideRoles) !== 'undefined' && state.overrideRoles.length > 0) {
					for(i = 0; i < state.overrideRoles.length; i++) {
						r = state.overrideRoles[i];
						CurrentUser.hasOverrideRole(r, permissionResult(r), apiFailure);
					}
				}
			}
		};
		
		var checkDeleted = function(failure, state) {
			if(Authentication.isAuthenticated() && state.name !== states.DELETED) {
				var d = function(result) {
					if(result) {
						failure(states.DELETED);
					}
				};
				CurrentUser.hasOverrideRole(roles.overrideRoles.DELETED, d, function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:apiError'));
						failure();
					});
				});
			}
		};
		
		var getFailure = function(event) {
			var invoked = false;
			return function(state) {
				if(!invoked) {
					invoked = true;
					if(typeof(event) !== 'undefined') {
						event.preventDefault();
					}
					if(typeof(state) === 'undefined') {
						$state.go(states.AUTHENTICATION, undefined, {reload: true});
					}
				}
				if(typeof(state) !== 'undefined') {
					$state.go(state, undefined, {reload: true});
				}
			};
		};
		
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			transitionState = toState;
			if(typeof(stateChangeStartCallbacks) !== 'undefined') {
				for(var i = 0; i < stateChangeStartCallbacks.length; i++) {
					if(stateChangeStartCallbacks[i].callback()) {
						event.preventDefault();
						return;
					}
				}
				stateChangeStartCallbacks = [];
			}
			var failure = getFailure(event);
			checkDeleted(failure, toState);
			if(!checkAuthenticationFailure(failure, toState)) {
				checkPermissions(failure, toState);
			}
			$rootScope.$broadcast(events.CUSTOM_STATE_CHANGE_START, toState, toParams, fromState, fromParams);
		});
		
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			transitionState = undefined;
		});
		
		$rootScope.$on(events.LOGIN_CHANGE, function(event, authentication, forced) {
			var failure = getFailure();
			var state = $state.current;
			// this is super annoying, add a link on the alert instead to the logged out page
			/*if(forced) {
				// no need to check all permissions if it was a forced logout; instead, assume all failed and go to the forced logout page
				$state.go(states.LOGGED_OUT, undefined, {reload: true});
			} else {
			*/
			// handle the case where $state.current is still a previous state, but it was authenticated when it checked the state change start
			if(typeof(transitionState) !== 'undefined') {
				state = transitionState;
			}
			checkDeleted(failure, state);
			if(!checkAuthenticationFailure(failure, state)) {
				checkPermissions(failure, state);
			}
			//}
		});
		
		return {
			addToStateChangeStart: function(callback, id) {
				if(typeof(stateChangeStartCallbacks) === 'undefined') {
					stateChangeStartCallbacks = [];
				}
				if(typeof(callback) !== 'undefined') {
					var prevent = false;
					if(typeof(id) !== 'undefined') {
						for(var i = 0; i < stateChangeStartCallbacks.length; i++) {
							if(stateChangeStartCallbacks[i].id === id) {
								prevent = true;
							}
						}
					}
					if(!prevent) {
						stateChangeStartCallbacks.push({callback: callback, id: id});
					}
				}
			}
		};
	}]);
});