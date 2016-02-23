define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaUser', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			currentUser: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_CURRENT, [user], undefined, undefined, success, error, api);
			},
			getProfile: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_PROFILE, [user], undefined, undefined, success, error, api);
			},
			getAppreciationResponse: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_APPRECIATION_RESPONSE, [user], undefined, undefined, success, error, api);
			},
			updateProfile: function(success, error, api, user, description, warning) {
				var body = {
						description: description,
						warning: warning
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_PROFILE, [user], undefined, body, success, error, api);
			},
			updateAppreciationResponse: function(success, error, api, user, appreciationResponse, warning) {
				var body = {
						appreciationResponse: appreciationResponse,
						appreciationResponseWarning: warning
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_APPRECIATION_RESPONSE, [user], undefined, body, success, error, api);
			},
			undeleteUser: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_DELETE, [user], undefined, undefined, success, error, api);
			},
			rename: function(success, error, api, user, username) {
				var body = {
						username: username
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_RENAME, [user], undefined, body, success, error, api);
			},
			lock: function(success, error, api, user, until, suspensions) {
				/*
				var body = {
						lockReason: 'SECURITY',
						suspensions: suspensions,
						lockedUntil: until
				};*/
				var body = {
						suspensions: suspensions,
						lockedUntil: until
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_LOCK, [user], undefined, body, success, error, api);
			},
			unlock: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_UNLOCK, [user], undefined, undefined, success, error, api);
			},
			requestEmailChange: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_EMAIL_CHANGE_REQUEST, [user], undefined, undefined, success, error, api);
			},
			requestPaymentChange: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_PAYMENT_CHANGE_REQUEST, [user], undefined, undefined, success, error, api);
			},
			setPassword: function(success, error, api, user, password) {
				var body = {
						password: password
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_PASSWORD, [user], undefined, body, success, error, api);
			},
			changeEmail: function(success, error, api, user, email) {
				var body = {
						email: email
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_EMAIL_CHANGE, [user], undefined, body, success, error, api);
			},
			clearLoginAttempts: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_LOGIN_ATTEMPTS, [user], undefined, undefined, success, error, api);
			},
			getRoles: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_CURRENT_ROLES, [user], undefined, undefined, success, error, api);
			},
			updateRoles: function(success, error, api, user, roles, overrideRoles) {
				var body = {
					roles: roles,
					overrideRoles: overrideRoles
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_ROLES, [user], undefined, body, success, error, api);
			},
			updatePendingActions: function(success, error, api, user, pendingActions) {
				var body = {
						pendingActions: pendingActions
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_PENDING_ACTIONS, [user], undefined, body, success, error, api);
			},
			getSettings: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_SETTINGS, [user], undefined, undefined, success, error, api);
			},
			resetSettings: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_SETTINGS, [user], undefined, undefined, success, error, api);
			},
			getBalance: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_FINANCES, [user], undefined, undefined, success, error, api);
			},
			addBalance: function(success, error, api, user, amount) {
				var body = {
						amount: amount
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_FINANCES_ADD, [user], undefined, body, success, error, api);
			},
			removeBalance: function(success, error, api, user, amount) {
				var body = {
						amount: amount
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_FINANCES_REMOVE, [user], undefined, body, success, error, api);
			},
			notifications: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_NOTIFICATIONS, [user], p, undefined, success, error, api);
			},
			feed: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_FEED, [user], p, undefined, success, error, api);
			}
		};
	}]);
	
});