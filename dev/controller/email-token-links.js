define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/constants/states', 'js/constants/params', 'js/constants/response-codes'],
		function(controller, $, ng, i18n, validation, states, params, responseCodes) {
	controller.controller('EmailChangeController', ['$scope', '$state', '$location', 'Browser', 'Loaded', 'Authentication', 'pyProfile',
		function($scope, $state, $location, Browser, Loaded, Authentication, pyProfile) {
			$scope.loaded = Loaded;
			$scope.errors = {};
			$scope.alert = undefined;
			$scope.emailLoading = false;
			var token = $location.search()[params.EMAIL_TOKEN];
			
			$scope.email = undefined;
			$scope.password = undefined;

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.emailLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['email', 'password'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if (code === responseCodes.EXISTS || code === responseCodes.EXISTS_EMAIL) {
						$scope.errors.email = t('validation:exists.email');
					} else if (code === responseCodes.RESTRICTED_EMAIL) {
						$scope.errors.email = t('validation:restricted.email');
					} else if (code === responseCodes.NOT_ALLOWED) {
						$scope.errors.password = t('validation:notAllowed.password');
					} else if (code === responseCodes.LOGIN_LOCKED) {
						$scope.errors.password = t('alerts:password.locked');
					} else if (code === responseCodes.INVALID) {
						$scope.alert = t('alerts:emailToken.link.invalid');
					} else {
						$scope.alert = t('alerts:emailToken.link.error');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.emailLoading = false;
				$state.go(states.SETTINGS, undefined, {reload: true});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.emailLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
				
			$scope.changeEmail = function() {
				if($scope.authenticated) {
					$scope.emailLoading = true;
					$scope.errors = {};
					$scope.alert = undefined;
					pyProfile.emailChange(success, error, apiError, token, $scope.email, $scope.password);
					$scope.password = undefined;
				}
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('PaymentChangeController', ['$scope', '$state', '$location', 'Browser', 'Loaded', 'Authentication', 'pyProfile',
		function($scope, $state, $location, Browser, Loaded, Authentication, pyProfile) {
			$scope.loaded = Loaded;
			$scope.errors = {};
			$scope.alert = undefined;
			$scope.paymentLoading = false;
			var token = $location.search()[params.EMAIL_TOKEN];
			
			$scope.paymentId = undefined;
			$scope.password = undefined;

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.paymentLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['paymentId', 'password'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if (code === responseCodes.RESTRICTED_EMAIL) {
						$scope.errors.paymentId = t('validation:restricted.email');
					} else if (code === responseCodes.NOT_ALLOWED) {
						$scope.errors.password = t('validation:notAllowed.password');
					} else if(code === responseCodes.LOGIN_LOCKED) {
						$scope.errors.password = t('alerts:password.locked');
					} else if (code === responseCodes.INVALID) {
						$scope.alert = t('alerts:emailToken.link.invalid');
					} else {
						$scope.alert = t('alerts:emailToken.link.error');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.paymentLoading = false;
				$state.go(states.SETTINGS, undefined, {reload: true});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.paymentLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
				
			$scope.changePayment = function() {
				if($scope.authenticated) {
					$scope.paymentLoading = true;
					$scope.errors = {};
					$scope.alert = undefined;
					pyProfile.paymentChange(success, error, apiError, token, $scope.paymentId, $scope.password);
					$scope.password = undefined;
				}
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('ResetPasswordController', ['$scope', '$state', 'Browser', 'Loaded', 'Authentication', 'Alerts', 'pyProfile',
		function($scope, $state, Browser, Loaded, Authentication, Alerts, pyProfile) {
			$scope.loaded = Loaded;
			$scope.errors = {};
			$scope.alert = undefined;
			$scope.resetLoading = false;
			
			$scope.email = undefined;

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.resetLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['email'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else {
						$scope.alert = t('alerts:emailToken.error');
					}
				});
			};
			
			var success = function(code, dto, page) {
				i18n(function(t) {
					$scope.resetLoading = false;
					Alerts.success(t('alerts:emailToken.resetPassword'));
					$state.go(states.DEFAULT, undefined, {reload: true});
				});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.resetLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
				
			$scope.resetPassword = function() {
				if(!$scope.authenticated) {
					$scope.resetLoading = true;
					$scope.errors = {};
					$scope.alert = undefined;
					pyProfile.sendPasswordResetToken(success, error, apiError, $scope.email);
				}
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('PasswordChangeUnauthedController', ['$scope', '$state', '$location', 'Browser', 'Loaded', 'Authentication', 'pyProfile',
		function($scope, $state, $location, Browser, Loaded, Authentication, pyProfile) {
			$scope.loaded = Loaded;
			$scope.errors = {};
			$scope.alert = undefined;
			$scope.passwordLoading = false;
			var token = $location.search()[params.EMAIL_TOKEN];
			$scope.username = $location.search()[params.USER];
			
			$scope.newPassword = undefined;
			$scope.confirmNewPassword = undefined;
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.passwordLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['newPassword', 'confirmNewPassword'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if (code === responseCodes.RESTRICTED_PASSWORD) {
						$scope.errors.newPassword = t('validation:restricted.password');
					} else if (code === responseCodes.INVALID) {
						$scope.alert = t('alerts:emailToken.link.invalid');
					} else {
						$scope.alert = t('alerts:emailToken.link.error');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.passwordLoading = false;
				$state.go(states.DEFAULT, undefined, {reload: true});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.passwordLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
				
			$scope.changePassword = function() {
				if(!$scope.authenticated) {
					$scope.passwordLoading = true;
					$scope.errors = {};
					$scope.alert = undefined;
					pyProfile.passwordChangeUnauthed(success, error, apiError, token, $scope.username, $scope.newPassword, $scope.confirmNewPassword);
					$scope.newPassword = undefined;
					$scope.confirmNewPassword = undefined;
				}
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('ConfirmationController', ['$scope', '$state', '$location', 'Loaded', 'Authentication', 'Alerts', 'pyProfile',
		function($scope, $state, $location, Loaded, Authentication, Alerts, pyProfile) {
			$scope.loaded = Loaded;
			var token = $location.search()[params.EMAIL_TOKEN];
			
			var error = function(code, dto) {
				i18n(function(t) {
					if (code === responseCodes.INVALID) {
						Alerts.warning(t('alerts:emailToken.link.invalid'));
						$state.go(states.SETTINGS, undefined, {reload: true});
					} else {
						Alerts.warning(t('alerts:emailToken.link.error'));
						$state.go(states.SETTINGS, undefined, {reload: true});
					}
				});
			};
			
			var success = function(code, dto, page) {
				i18n(function(t) {
					Alerts.success(t('alerts:emailToken.link.confirmation'));
					$state.go(states.SETTINGS, undefined, {reload: true});
				});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Alerts.warning(t('alerts:apiError'));
					$state.go(states.SETTINGS, undefined, {reload: true});
				});
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				
				if(authenticated) {
					pyProfile.confirmation(success, error, apiError, token);
				} else {
					i18n(function(t) {
						Alerts.error(t('alerts:emailToken.login'));
					});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('DeletionController', ['$scope', '$state', '$location', 'Reloader', 'Loaded', 'Authentication', 'Alerts', 'pyProfile',
		function($scope, $state, $location, Reloader, Loaded, Authentication, Alerts, pyProfile) {
			$scope.loaded = Loaded;
			var token = $location.search()[params.EMAIL_TOKEN];
			
			var error = function(code, dto) {
				i18n(function(t) {
					if (code === responseCodes.INVALID) {
						Alerts.warning(t('alerts:emailToken.link.invalid'));
						$state.go(states.SETTINGS, undefined, {reload: true});
					} else {
						Alerts.warning(t('alerts:emailToken.link.error'));
						$state.go(states.SETTINGS, undefined, {reload: true});
					}
				});
			};
			
			var success = function(code, dto, page) {
				i18n(function(t) {
					Alerts.success(t('alerts:emailToken.link.delete'));
					$state.go(states.SETTINGS, undefined, {reload: true});
				});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Alerts.warning(t('alerts:apiError'));
					$state.go(states.SETTINGS, undefined, {reload: true});
				});
			};

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				
				if($scope.authenticated) {
					pyProfile.deletion(success, error, apiError, token);
				} else {
					i18n(function(t) {
						Alerts.error(t('alerts:emailToken.login'));
					});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	
});