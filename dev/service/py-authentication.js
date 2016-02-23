define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/api-urls', 'js/constants/params',
        'js/constants/view-urls', 'js/constants/events', 'js/constants/settings-options'],
		function(service, $, ng, i18n, apiUrls, params, viewUrls, events, settingsOptions) {
	
	service.factory('pyAuthentication', ['$rootScope', 'Reloader', 'pyApi', 'pyProfile', 'Authentication', 'Alerts', 'Options',
																			function($rootScope, Reloader, pyApi, pyProfile, Authentication, Alerts, Options) {
		var settingsSuccess = function(code, dto, page) {
			Options.setLanguage(dto.language);
			Options.setWarning(dto.options[settingsOptions.ALLOW_WARNING_CONTENT]);
			if(dto.interfaceLanguage !== Options.getInterfaceLanguage()) {
				Options.setInterfaceLanguage(dto.interfaceLanguage);
				Reloader.fullRefresh();
			}
		};
		var settingsError = function() {
			i18n(function(t) {
				Alerts.error(t('alerts:user.settingsError'));
			});
		};
		
		$rootScope.$on(events.PRE_LOGIN_CHANGE, function(event, authenticated) {
			if(authenticated) {
				pyProfile.getSettings(settingsSuccess, settingsError, settingsError);
			}
		});
		
		var onLogin = function(success, code, dto, page) {
			Authentication.setToken(dto.result);
			if(typeof(success) !== 'undefined') {
				success(code, dto, page);
			}
		};
		var onLogout = function(success, code, dto, page) {
			Authentication.setToken();
			if(typeof(success) !== 'undefined') {
				success(code, dto, page);
			}
		};
		return {
			forceLogout: function() {
				Authentication.setToken(undefined, true);
			},
			login: function(success, error, api, username, password, rememberMe) {
				var data = {
						username: username,
						password: password,
						rememberMe: rememberMe
				};
				var login = function(code, dto, page) {
					onLogin(success, code, dto, page);
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.LOGIN, undefined, undefined, data, login, error, api, true);
			},
			register: function(success, error, api, username, email, password, confirmNewPassword, ageMinimum, rememberMe, recaptchaResponse) {
				var data = {
						username: username,
						password: password,
						confirmNewPassword: confirmNewPassword,
						email: email,
						ageMinimum: ageMinimum,
						rememberMe: rememberMe,
						recaptchaResponse: recaptchaResponse
				};
				var register = function(code, dto, page) {
					onLogin(success, code, dto, page);
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.REGISTER, undefined, undefined, data, register, error, api, true);
			},
			logout: function(success, error, api) {
				var logout = function(code, dto, page) {
					onLogout(success, code, dto, page);
				};
				var errorLogout = function(code, dto) {
					Authentication.setToken();
					error(code, dto);
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.LOGOUT, undefined, undefined, undefined, logout, errorLogout, api, true);
			}
		};
	}]);
});