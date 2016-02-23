define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/events', 'js/constants/params'],
		function(service, $, ng, apiUrls, events, params) {
	
	service.factory('pyProfile', ['$rootScope', 'pyApi', function($rootScope, pyApi) {
		return {
			currentUser: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.CURRENT, undefined, undefined, undefined, success, error, api);
			},
			acceptTermsOfService: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CURRENT_ACCEPT, undefined, undefined, undefined, success, error, api);
			},
			getSettings: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.SETTINGS, undefined, undefined, undefined, success, error, api);
			},
			setSettings: function(success, error, api, language, interfaceLanguage, options, hiddenNotificationEvents, hiddenFeedEvents, filters) {
				var body = {
						language: language,
						interfaceLanguage: interfaceLanguage,
						options: options,
						hiddenNotificationEvents: hiddenNotificationEvents,
						hiddenFeedEvents: hiddenFeedEvents,
						filters: filters
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.SETTINGS, undefined, undefined, body, success, error, api);
			},
			getProfile: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.PROFILE, undefined, undefined, undefined, success, error, api);
			},
			updateProfile: function(success, error, api, description, warning) {
				var body = {
						description: description,
						warning: warning
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.PROFILE, undefined, undefined, body, success, error, api);
			},
			getAppreciationResponse: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, apiUrls.RESPONSE, undefined, undefined, undefined, success, error, api);
			},
			updateAppreciationResponse: function(success, error, api, appreciationResponse, warning) {
				var body = {
						appreciationResponse: appreciationResponse,
						appreciationResponseWarning: warning
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.RESPONSE, undefined, undefined, body, success, error, api);
			},
			sendConfirmationToken: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CONFIRMATION_SEND, undefined, undefined, undefined, success, error, api);
			},
			sendEmailChangeToken: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.EMAIL, undefined, undefined, undefined, success, error, api);
			},
			sendPaymentIdChangeToken: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.PAYMENT_SEND, undefined, undefined, undefined, success, error, api);
			},
			sendDeleteToken: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CURRENT_DELETE_SEND, undefined, undefined, undefined, success, error, api);
			},
			sendPasswordResetToken: function(success, error, api, email) {
				var body = {
						email: email
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.PASSWORD_RESET, undefined, undefined, body, success, error, api);
			},
			resetSettings: function(success, error, api) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.SETTINGS, undefined, undefined, undefined, success, error, api);
			},
			confirmation: function(success, error, api, token) {
				var p = {};
				p[params.EMAIL_TOKEN] = token;
				pyApi.pyRequest(pyApi.POST, apiUrls.CONFIRMATION, undefined, p, undefined, success, error, api);
			},
			emailChange: function(success, error, api, token, email, password) {
				var body = {
						email: email,
						password: password
				};
				var p = {};
				p[params.EMAIL_TOKEN] = token;
				pyApi.pyRequest(pyApi.POST, apiUrls.EMAIL_CHANGE, undefined, p, body, success, error, api);
			},
			emailPendingActionChange: function(success, error, api, email, password) {
				var body = {
						email: email,
						password: password
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.EMAIL_PENDING_ACTION_CHANGE, undefined, undefined, body, success, error, api);
			},
			paymentChange: function(success, error, api, token, paymentId, password) {
				var body = {
						paymentId: paymentId,
						password: password
				};
				var p = {};
				p[params.EMAIL_TOKEN] = token;
				pyApi.pyRequest(pyApi.POST, apiUrls.PAYMENT_CHANGE, undefined, p, body, success, error, api);
			},
			passwordChange: function(success, error, api, oldPassword, newPassword, confirmNewPassword) {
				var body = {
						oldPassword: oldPassword,
						newPassword: newPassword,
						confirmNewPassword: confirmNewPassword
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.PASSWORD, undefined, undefined, body, success, error, api);
			},
			passwordChangeUnauthed: function(success, error, api, token, user, newPassword, confirmNewPassword) {
				var body = {
						newPassword: newPassword,
						confirmNewPassword: confirmNewPassword
				};
				var p = {};
				p[params.EMAIL_TOKEN] = token;
				pyApi.pyRequest(pyApi.POST, apiUrls.PASSWORD_USERS_ID, [user], p, body, success, error, api);
			},
			// not set roles, but set of roles! maybe we should find a better word for this...
			rolesSet: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.ROLES, undefined, undefined, undefined, success, error, api);
			},
			deletion: function(success, error, api, token) {
				var p = {};
				p[params.EMAIL_TOKEN] = token;
				pyApi.pyRequest(pyApi.DELETE, apiUrls.CURRENT_DELETE, undefined, p, undefined, success, error, api);
			},
			undelete: function(success, error, api) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CURRENT_DELETE, undefined, undefined, undefined, success, error, api);
			},
			subscription: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.SUBSCRIPTION, undefined, undefined, undefined, success, error, api);
			}
		};
	}]);
});