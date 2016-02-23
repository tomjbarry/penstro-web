define(['./module', 'jquery', 'angular', 'js/util/i18n',
        'js/constants/cookies', 'js/constants/events'],
		function(service, $, ng, i18n, cookies, events) {
	
	var initialObject = function() {
		return {
			result: undefined,
			waiting: false,
			successList: [],
			errorList: []
		};
	};
	
	var requests = {
			current: initialObject(),
			rolesSet: initialObject(),
			subscription: initialObject()
	};
	
	service.factory('CurrentUser', ['$rootScope', 'Alerts', 'Authentication', 'pyProfile', function($rootScope, Alerts, Authentication, pyProfile) {
		var resolveSuccessList = function(type, c) {
			var i;
			for(i = 0; i < requests[type].successList.length; i++) {
				requests[type].successList[i](c);
			}
			requests[type].successList = [];
		};
		var resolveErrorList = function(type, c) {
			var i;
			for(i = 0; i < requests[type].errorList.length; i++) {
				requests[type].errorList[i]();
			}
			requests[type].errorList = [];
		};
		
		var getSuccess = function(type) {
			return function(code, dto, page) {
				requests[type].result = dto;
				requests[type].waiting = false;
				resolveSuccessList(type, dto);
			};
		};
		
		var getError = function(type, alert) {
			return function(code, dto) {
				requests[type].result = undefined;
				requests[type].waiting = false;
				i18n(function(t) {
					Alerts.warning(t(alert));
				});
				resolveErrorList(type);
			};
		};
		
		var get = function(type, success, error, method) {
			if(Authentication.isAuthenticated()) {
				if(typeof(success) !== 'undefined' && typeof(method) !== 'undefined') {
					if(requests[type].waiting) {
						requests[type].successList.push(success);
						if(typeof(error) !== 'undefined') {
							requests[type].errorList.push(error);
						}
					} else if(typeof(requests[type].result) === 'undefined') {
						requests[type].waiting = true;
						requests[type].successList.push(success);
						if(typeof(error) !== 'undefined') {
							requests[type].errorList.push(error);
						}
						method();
					} else {
						success(requests[type].result);
					}
				}
			} else {
				if(typeof(error) !== 'undefined') {
					error();
				}
			}
		};
		
		var getCurrent = function(success, error) {
			get('current', success, error, function() {
				pyProfile.currentUser(getSuccess('current'), getError('current', 'alerts:user.currentError'), getError('current', 'alerts:user.currentError'));
			});
		};
		
		var getRoles = function(success, error) {
			get('rolesSet', success, error, function() {
				pyProfile.rolesSet(getSuccess('rolesSet'), getError('rolesSet', 'alerts:user.rolesSetError'), getError('rolesSet', 'alerts:user.rolesSetError'));
			});
		};
		
		var getSubscription = function(success, error) {
			get('subscription', success, error, function() {
				pyProfile.subscription(getSuccess('subscription'), getError('subscription', 'alerts:user.subscriptionError'), getError('subscription', 'alerts:user.subscriptionError'));
			});
		};
		
		var getFresh = function(success, error) {
			requests.current.result = undefined;
			requests.current.waiting = false;
			if(typeof(success) === 'undefined') {
				success = function(){};
			}
			if(typeof(error) === 'undefined') {
				error = function(){};
			}
			return getCurrent(success, error);
		};
		
		var refreshRoles = function(success, error) {
			requests.rolesSet.result = undefined;
			requests.rolesSet.waiting = false;
			if(typeof(success) === 'undefined') {
				success = function(){};
			}
			if(typeof(error) === 'undefined') {
				error = function(){};
			}
			getRoles(success, error);
		};
		
		var refreshSubscription = function(success, error) {
			requests.subscription.result = undefined;
			requests.subscription.waiting = false;
			if(typeof(success) === 'undefined') {
				success = function(){};
			}
			if(typeof(error) === 'undefined') {
				error = function(){};
			}
			return getSubscription(success, error);
		};
		
		var clear = function() {
			requests.current.result = undefined;
			requests.current.waiting = false;
			requests.rolesSet.result = undefined;
			requests.rolesSet.waiting = false;
			requests.subscription.result = undefined;
			requests.subscription.waiting = false;
		};
		
		$rootScope.$on(events.PRE_LOGIN_CHANGE, function(events, authenticated) {
			clear();
		});
		
		var alertOverrideRole = function(role, link) {
			if(typeof(role) !== 'undefined') {
				i18n(function(t) {
					Alerts.warning(t('alerts:overrideRole.' + role), link);
				});
			}
		};
		
		return {
			get: getCurrent,
			getFresh: getFresh,
			hasPendingAction: function(action, success, error) {
				getCurrent(function(currentUser) {
					var i;
					var result = false;
					var pendingActions = currentUser.pendingActions;
					if(typeof(pendingActions) !== 'undefined') {
						for(i = 0; i < pendingActions.length; i++) {
							if(pendingActions[i] === action) {
								result = true;
							}
						}
					}
					success(result);
				}, error);
			},
			hasRole: function(role, success, error) {
				getRoles(function(rolesSet) {
					var i;
					var result = false;
					var roles = rolesSet.roles;
					if(typeof(roles) !== 'undefined') {
						for(i = 0; i < roles.length; i++) {
							if(roles[i] === role) {
								result = true;
							}
						}
					}
					if(typeof(success) !== 'undefined') {
						success(result);
					}
				}, error);
			},
			hasOverrideRole: function(role, success, error) {
				getRoles(function(rolesSet) {
					var i;
					var result = false;
					var roles = rolesSet.overrideRoles;
					if(typeof(roles) !== 'undefined') {
						for(i = 0; i < roles.length; i++) {
							if(roles[i] === role) {
								result = true;
							}
						}
					}
					if(typeof(success) !== 'undefined') {
						success(result);
					}
				}, error);
			},
			checkAlertOverrideRole: function(role, link) {
				getRoles(function(rolesSet) {
					var i;
					var result = false;
					var roles = rolesSet.overrideRoles;
					if(typeof(roles) !== 'undefined') {
						for(i = 0; i < roles.length; i++) {
							if(roles[i] === role) {
								result = true;
							}
						}
					}
					if(result) {
						alertOverrideRole(role, link);
					}
				});
			},
			alertOverrideRole: alertOverrideRole,
			refreshRoles: refreshRoles,
			refreshSubscription: refreshSubscription,
			hasFollows: function(username, success, error) {
				getSubscription(function(subscription) {
					var i;
					var result = false;
					var follows = subscription.follows;
					if(typeof(follows) !== 'undefined') {
						for(i = 0; i < follows.length; i++) {
							if(follows[i].username.username === username) {
								result = true;
							}
						}
					}
					if(typeof(success) !== 'undefined') {
						success(result);
					}
				}, error);
			},
			hasBlocked: function(username, success, error) {
				getSubscription(function(subscription) {
					var i;
					var result = false;
					var blocked = subscription.blocked;
					if(typeof(blocked) !== 'undefined') {
						for(i = 0; i < blocked.length; i++) {
							if(blocked[i].username.username === username) {
								result = true;
							}
						}
					}
					if(typeof(success) !== 'undefined') {
						success(result);
					}
				}, error);
			}
		};
	}]);
});