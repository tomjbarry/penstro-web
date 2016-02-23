define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/util/validation-errors', 'js/constants/events',
        'js/constants/language-settings', 'js/constants/settings-options', 'js/constants/response-codes',
        'js/constants/forms', 'js/constants/roles', 'js/constants/pending-actions'],
		function(controller, $, ng, utils, i18n, validation, events, languageSettings, settingsOptions, responseCodes, forms, roles, pendingActions) {
	var loaded;
	controller.controller('SettingsController', ['$rootScope', '$scope', 'Alerts', 'Authentication', 'Loaded', 'Browser',
																								'CurrentUser', 'Reloader', 'Options', 'pyProfile',
		function($rootScope, $scope, Alerts, Authentication, Loaded, Browser, CurrentUser, Reloader, Options, pyProfile) {
			$scope.loaded = Loaded;
			
			var languages = languageSettings.LANGUAGES;
			var interfaceLanguages = languageSettings.INTERFACE_LANGUAGES;
			var inverseLanguages = utils.invertObject(languages);
			var inverseInterfaceLanguages = utils.invertObject(interfaceLanguages);
			
			var getValues = function(map) {
				var list = [];
				if(typeof(map) !== 'undefined') {
					for(var key in map) {
						if(map.hasOwnProperty(key)) {
							list.push(map[key]);
						}
					}
				}
				return list;
			};
			
			$scope.languages = getValues(languages);
			$scope.interfaceLanguages = getValues(interfaceLanguages);
			
			$scope.email = '';
			$scope.paymentId = '';

			var reloadOptions = function() {
				$scope.language = languages[Options.getLanguage()];
				$scope.interfaceLanguage = interfaceLanguages[Options.getInterfaceLanguage()];
				$scope.warning = Options.getWarning();
			};
			
			var settingsSuccess = function(code, dto, page) {
				Options.setLanguage(dto.language);
				Options.setInterfaceLanguage(dto.interfaceLanguage);
				if(typeof(dto.options) !== 'undefined') {
					if(typeof(dto.options[settingsOptions.ALLOW_WARNING_CONTENT]) !== 'undefined') {
						Options.setWarning(dto.options[settingsOptions.ALLOW_WARNING_CONTENT]);
						$scope.warning = dto.options[settingsOptions.ALLOW_WARNING_CONTENT];
					}
					if(typeof(dto.options[settingsOptions.ALLOW_PROFILE_COMMENTS]) !== 'undefined') {
						$scope.allowProfileComments = dto.options[settingsOptions.ALLOW_PROFILE_COMMENTS];
					}
					if(typeof(dto.options[settingsOptions.HIDE_USER_PROFILE]) !== 'undefined') {
						$scope.hideUserProfile = dto.options[settingsOptions.HIDE_USER_PROFILE];
					}
				}
				$scope.email = dto.email;
				$scope.paymentId = dto.paymentId;
				reloadOptions(true);
			};
			
			var settingsError = function() {
				i18n(function(t) {
					Browser.scrollTo('content');
					Alerts.warning(t('alerts:user.settingsError'));
				});
			};
			
			var getSettings = function() {
				if($scope.authenticated) {
					pyProfile.getSettings(settingsSuccess, settingsError, settingsError);
				}
			};
			

			var emailCheckPendingActions = function() {
				CurrentUser.hasPendingAction(pendingActions.UNCONFIRMED_EMAIL, function(result){
					if(result) {
						$scope.emailInvalid = true;
						i18n(function(t) {
							Browser.scrollTo('content');
							Alerts.error(t('alerts:settingsEmail.required'));
						});
					}
				}, function() {
					i18n(function(t) {
						Browser.scrollTo('content');
						Alerts.warning(t('alerts:user.settingsError'));
					});
				});
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				reloadOptions();
				if(authenticated) {
					getSettings();
					CurrentUser.getFresh(emailCheckPendingActions, emailCheckPendingActions);
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var clearChangePassword = function() {
				$scope.changePassword = {
						oldPassword: '',
						newPassword: '',
						confirmNewPassword: ''
				};
				$scope.changePasswordErrors = {};
			};
			clearChangePassword();
			
			var changePasswordSuccess = function(code, dto, page) {
				i18n(function(t) {
					Browser.scrollTo('content');
					Alerts.success(t('alerts:user.passwordChangeSuccess'));
				});
			};
			
			var changePasswordError = function(code, dto) {
				i18n(function(t) {
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['oldPassword','newPassword','confirmNewPassword'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.changePasswordErrors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.changePasswordErrors[field] = undefined;
							}
						});
					} else if(code === responseCodes.LOGIN_LOCKED) {
						$scope.changePasswordErrors.oldPassword = t('alerts:password.locked');
					} else if(code === responseCodes.INVALID) {
						$scope.changePasswordErrors.oldPassword = t('validation:py.validation.error.format.password');
					} else if (code === responseCodes.RESTRICTED_PASSWORD) {
						$scope.changePasswordErrors.newPassword = t('validation:restricted.password');
					} else if(code === responseCodes.NOT_ALLOWED) {
						$scope.changePasswordErrors.oldPassword = t('validation:notAllowed.password');
					} else {
						Browser.scrollTo('content');
						Alerts.error(t('alerts:password.change.error'));
						$scope.changePasswordErrors = {};
					}
				});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('content');
					Alerts.error(t('alerts:apiError'));
				});
			};
			
			$scope.submitPasswordChange = function() {
				$scope.changePasswordErrors = {};
				pyProfile.passwordChange(changePasswordSuccess, changePasswordError, apiError, $scope.changePassword.oldPassword,
						$scope.changePassword.newPassword, $scope.changePassword.confirmNewPassword);
				clearChangePassword();
			};
			
			$scope.zxcvbnResult = {};
			$scope.zxcvbnLoaded = false;
			
			var passwordKeypress = function() {};
			require(['zxcvbn'], function(zxcvbn) {
				$scope.zxcvbnLoaded = true;
				passwordKeypress = function() {
					if(typeof($scope.changePassword.newPassword) !== 'undefined') {
						// zxcvbn advises only first 100 characters to prevent long calculations
						$scope.zxcvbnResult = zxcvbn($scope.changePassword.newPassword.substring(0,100));
						if(typeof($scope.zxcvbnResult) !== 'undefined') {
							if(typeof($scope.zxcvbnResult.feedback) !== 'undefined') {
								$scope.passwordAdvice = $scope.zxcvbnResult.feedback.suggestions;
							}
							$scope.passwordScore = $scope.zxcvbnResult.score;
						}
					}
				};
			});
			

			$scope.$watch('changePassword.newPassword', function(newValue, oldValue) {
				if(newValue !== oldValue) {
					passwordKeypress();
				}
			});
			
			var sendEmailTokenSuccess = function(str) {
				return function(code, dto, page) {
					i18n(function(t) {
						Browser.scrollTo('content');
						Alerts.success(t(str));
					});
				};
			};
			
			var sendEmailTokenError = function(str) {
				return function() {
					i18n(function(t) {
						Browser.scrollTo('content');
						Alerts.warning(t(str));
					});
				};
			};
			
			var sendConfirmationTokenError = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('content');
					Alerts.warning(t('emailToken.confirmationError'));
				});
			};
			
			$scope.sendEmailChangeToken = function() {
				pyProfile.sendEmailChangeToken(sendEmailTokenSuccess('alerts:emailToken.emailChange'), sendEmailTokenError('alerts:emailToken.error'), sendEmailTokenError('alerts:emailToken.error'));
			};
			
			$scope.sendConfirmationToken = function() {
				pyProfile.sendConfirmationToken(sendEmailTokenSuccess('alerts:emailToken.confirmation'), sendConfirmationTokenError, sendEmailTokenError('alerts:emailToken.error'));
			};
			
			$scope.sendPaymentIdChangeToken = function() {
				pyProfile.sendPaymentIdChangeToken(sendEmailTokenSuccess('alerts:emailToken.paymentIdChange'), sendEmailTokenError('alerts:emailToken.error'), sendEmailTokenError('alerts:emailToken.error'));
			};
			
			$scope.sendDeleteToken = function() {
				pyProfile.sendDeleteToken(sendEmailTokenSuccess('alerts:emailToken.delete'), sendEmailTokenError('alerts:emailToken.error'), sendEmailTokenError('alerts:emailToken.error'));
			};
			
			var resetSettingsSuccess = function(code, dto, page) {
				Reloader.fullRefresh();
			};
			
			var resetSettingsError = function(code, dto, page) {
				i18n(function(t) {
					Alerts.warning(t('alerts:user.settingsResetError'));
				});
			};
			
			$scope.resetSettings = function() {
				pyProfile.resetSettings(resetSettingsSuccess, resetSettingsError, resetSettingsError);
			};
			
			/*
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				$scope.authenticated = authenticated;
				reloadOptions(authenticated);
			});
			*/
			
			$scope.changeEmailData = {loading: false, errors: {}};
			$scope.changeEmailToggle = false;
			$scope.emailInvalid = false;
			$scope.toggleChangeEmail = function() {
				$scope.changeEmailToggle = !$scope.changeEmailToggle;
				$scope.changeEmailData = {loading: false, errors: {}};
			};
			
			var changeEmailError = function(code, dto) {
				i18n(function(t) {
					$scope.changeEmailData.loading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['email', 'password'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.changeEmailData.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.changeEmailData.errors[field] = undefined;
							}
						});
					} else if (code === responseCodes.RESTRICTED_EMAIL) {
						$scope.changeEmailData.errors.email = t('validation:restricted.email');
					} else if(code === responseCodes.LOGIN_LOCKED) {
						$scope.changeEmailData.errors.password = t('alerts:password.locked');
					} else if (code === responseCodes.NOT_ALLOWED) {
						$scope.changeEmailData.errors.password = t('validation:notAllowed.password');
					} else if (code === responseCodes.EXISTS) {
						$scope.changeEmailData.errors.email = t('validation:exists.selfEmail');
					} else if (code === responseCodes.EXISTS_EMAIL) {
						$scope.changeEmailData.errors.email = t('validation:exists.email');
					} else {
						$scope.changeEmailData.alert = t('alerts:settingsEmail.error');
					}
				});
			};
			
			var changeEmailSuccess = function(code, dto, page) {
				i18n(function(t) {
					$scope.email = $scope.changeEmailData.email;
					$scope.changeEmailData.loading = false;
					$scope.changeEmailToggle = false;
					Browser.scrollTo('content');
					Alerts.success(t('alerts:settingsEmail.success'));
				});
			};
			
			var changeEmailApiError = function() {
				i18n(function(t) {
					$scope.changeEmailData.loading = false;
					$scope.changeEmailData.alert = t('alerts:apiError');
				});
			};
			
			$scope.changeEmail = function() {
				$scope.changeEmailData.alert = undefined;
				$scope.changeEmailData.loading = true;
				$scope.changeEmailData.errors = {};
				pyProfile.emailPendingActionChange(changeEmailSuccess, changeEmailError, changeEmailApiError, $scope.changeEmailData.email, $scope.changeEmailData.password);
				$scope.changeEmailData.password = undefined;
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
			
			$scope.submitSessionSettings = function() {
				var language = inverseLanguages[$scope.language];
				var interfaceLanguage = inverseInterfaceLanguages[$scope.interfaceLanguage];
				var warning = $scope.warning;

				if(typeof(warning) !== 'undefined') {
					Options.setWarning(warning);
				}
				if(typeof(language) !== 'undefined') {
					Options.setLanguage(language);
				}
				if(typeof(interfaceLanguage) !== 'undefined') {
					Options.setInterfaceLanguage(interfaceLanguage);
				}
				i18n(function(t) {
					Browser.scrollTo('content');
					Alerts.success(t('alerts:user.settingsSuccess'));
				});
			};
			
			$scope.submitSettings = function() {
				var language = inverseLanguages[$scope.language];
				var interfaceLanguage = inverseInterfaceLanguages[$scope.interfaceLanguage];
				var warning = $scope.warning;
				
				var onSuccess = function(code, dto, page) {
					if(typeof(warning) !== 'undefined') {
						Options.setWarning(warning);
					}
					if(typeof(language) !== 'undefined') {
						Options.setLanguage(language);
					}
					if(typeof(interfaceLanguage) !== 'undefined') {
						Options.setInterfaceLanguage(interfaceLanguage);
					}
					i18n(function(t) {
						Browser.scrollTo('content');
						Alerts.success(t('alerts:user.settingsSuccess'));
					});
				};
				
				var onError = function() {
					i18n(function(t) {
						Browser.scrollTo('content');
						Alerts.warning(t('alerts:user.settingsChangeError'));
					});
				};
				
				var options = {};
				options[settingsOptions.ALLOW_WARNING_CONTENT] = warning;
				options[settingsOptions.ALLOW_PROFILE_COMMENTS] = $scope.allowProfileComments;
				options[settingsOptions.HIDE_USER_PROFILE] = $scope.hideUserProfile;
				
				// TODO: add filters, hidden notifications and feed settings
				pyProfile.setSettings(onSuccess, onError, onError, language, interfaceLanguage, options, undefined, undefined, undefined);
			};
		}]);
});