define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/constants/api',
        'js/constants/api-urls','js/constants/cookies', 'js/constants/response-codes', 'js/constants/states',
        'js/constants/events', 'js/constants/values'],
		function(controller, $, ng, i18n, validation, api, apiUrls, cookies, responseCodes, states, events, values) {
	
	var apiError = function(Loaded, obj) {
		return function(data, status) {
			i18n(function(t) {
				Loaded.account = true;
				if(typeof(obj) !== 'undefined') {
					obj.loading = false;
					obj.alert = t('alerts:apiError');
				}
			});
		};
	};
	
	controller.controller('RegisterController', ['$modal', '$rootScope', '$scope', '$state', '$timeout', 'Loaded', 'pyAuthentication',
																							'Alerts', 'Tour', 'ModalInterface', 'GRecaptcha',
		function($modal, $rootScope, $scope, $state, $timeout, Loaded, pyAuthentication, Alerts, Tour, ModalInterface, GRecaptcha) {
			var registerData = {open: false, loading: false};
			$scope.registerData = registerData;
			var RegisterModalCtrl = function($scope, $modalInstance) {
				$scope.registerData = registerData;
				registerData.loading = false;
				registerData.username = '';
				registerData.password = '';
				registerData.confirmNewPassword = '';
				registerData.email = '';
				registerData.confirmAge = false;
				registerData.rememberMe = false;
				registerData.errors = {};
				registerData.alert = undefined;
				
				$scope.zxcvbnResult = {};
				$scope.zxcvbnLoaded = false;
				
				var success = function(code, dto, page) {
					Loaded.account = true;
					// setting token handled by pyAuthentication already
					$modalInstance.close(true);
					registerData.loading = false;
					Tour.start();
					$state.go(states.TERMS);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						GRecaptcha.reset();
						Loaded.account = true;
						registerData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['username','password','email','confirmNewPassword', 'recaptchaResponse'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									registerData.errors[field] = t(code, validation.getArguments(error));
								} else {
									registerData.errors[field] = undefined;
								}
								if(error && field === 'recaptchaResponse') {
									registerData.errors.recaptchaResponse = t('validation:recaptcha.required');
								} else {
									if(error && field === 'password' &&
										(validation.getValidCode(error) === 'py.validation.error.length.short.generic' ||
												validation.getValidCode(error) === 'py.validation.error.length.short.default')) {
										registerData.errors.password = t('validation:register.password', validation.getArguments(error));
									}
									if(error && field === 'confirmNewPassword' &&
											(validation.getValidCode(error) === 'py.validation.error.length.short.generic' ||
													validation.getValidCode(error) === 'py.validation.error.length.short.default')) {
											registerData.errors.confirmNewPassword = t('validation:register.password', validation.getArguments(error));
									}
								}
							});
						} else if(code === responseCodes.EXISTS) {
							registerData.errors.username = t('validation:exists.usernameOrEmail');
						} else if(code === responseCodes.EXISTS_USERNAME) {
							registerData.errors.username = t('validation:exists.username');
						} else if(code === responseCodes.EXISTS_EMAIL) {
							registerData.errors.email = t('validation:exists.email');
						} else if(code === responseCodes.RESTRICTED_USERNAME) {
							registerData.errors.username = t('validation:restricted.username');
						} else if(code === responseCodes.RESTRICTED_PASSWORD) {
							registerData.errors.password = t('validation:restricted.password');
						} else if(code === responseCodes.RESTRICTED_EMAIL) {
							registerData.errors.email = t('validation:restricted.email');
						} else if(code === responseCodes.EXTERNAL_SERVICE) {
							registerData.errors.recaptchaResponse = t('validation:recaptcha.externalService');
						} else if(code === responseCodes.NOT_ALLOWED) {
							registerData.errors.recaptchaResponse = t('validation:recaptcha.invalid');
						} else {
							registerData.alert = t('alerts:register.error');
						}
					});
				};
				
				var registerApiError = function(data, status) {
					apiError(Loaded, registerData)(data, status);
					GRecaptcha.reset();
				};
				
				$scope.submit = function() {
					if(registerData.confirmAge) {
						Loaded.account = false;
						registerData.errors = {};
						registerData.alert = undefined;
						registerData.loading = true;
						var recaptchaResponse = GRecaptcha.getResponse();
						// manually remove token in case of odd errors
						pyAuthentication.forceLogout();
						pyAuthentication.register(success, error, registerApiError, registerData.username, registerData.email, registerData.password, registerData.confirmNewPassword, registerData.confirmAge, registerData.rememberMe, recaptchaResponse);
					} else {
						i18n(function(t) {
							registerData.errors.confirmAge = t('validation:register.confirmAge');
						});
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
				
				var passwordKeypress = function() {};
				require(['zxcvbn'], function(zxcvbn) {
					$scope.zxcvbnLoaded = true;
					passwordKeypress = function() {
						/*
						if(!throttle) {
							throttle = true;
							$timeout(function() {
								throttle = false;
								if(typeof(registerData.password) !== 'undefined') {
									// zxcvbn advises only first 100 characters to prevent long calculations
									$scope.zxcvbnResult = zxcvbn(registerData.password.substring(0,100));
									if(typeof($scope.zxcvbnResult) !== 'undefined') {
										if(typeof($scope.zxcvbnResult.feedback) !== 'undefined') {
											$scope.passwordAdvice = $scope.zxcvbnResult.feedback.suggestions;
										}
										$scope.passwordScore = $scope.zxcvbnResult.score;
									}
								}
							}, values.PASSWORD_STRENGTH_THROTTLE_MILLISECONDS);
						}
						*/
						if(typeof(registerData.password) !== 'undefined') {
							// zxcvbn advises only first 100 characters to prevent long calculations
							$scope.zxcvbnResult = zxcvbn(registerData.password.substring(0,100));
							if(typeof($scope.zxcvbnResult) !== 'undefined') {
								if(typeof($scope.zxcvbnResult.feedback) !== 'undefined') {
									$scope.passwordAdvice = $scope.zxcvbnResult.feedback.suggestions;
								}
								$scope.passwordScore = $scope.zxcvbnResult.score;
							}
						}
					};
				});
				

				$scope.$watch('registerData.password', function(newValue, oldValue) {
					if(newValue !== oldValue) {
						passwordKeypress();
					}
				});
			};
			
			$scope.openRegister = function() {
				var r = $modal.open({
					templateUrl: 'registerModal',
					controller: ModalInterface.controller(RegisterModalCtrl),
					backdrop: false
				});

				r.result.then(function() {
						registerData.open = false;
					}, function() {
						registerData.open = false;
				});
				r.opened.then(function() {
						registerData.open = true;
					}, function() {
						registerData.open = false;
				});
			};
			
			$rootScope.$on(events.REGISTER_OPEN, function(event) {
				$scope.openRegister();
			});
			
		}]);
	controller.controller('LoginController', ['$modal', '$rootScope', '$scope', 'Loaded', 'pyAuthentication', 'Alerts', 'ModalInterface',
		function($modal, $rootScope, $scope, Loaded, pyAuthentication, Alerts, ModalInterface) {
			var loginData = {open: false, loading: false};
			$scope.loginData = loginData;
			var LoginModalCtrl = function($scope, $modalInstance) {
				$scope.loginData = loginData;
				loginData.loading = false;
				loginData.username = '';
				loginData.password = '';
				loginData.rememberMe = false;
				loginData.alert = undefined;
				
				var success = function(code, dto, page) {
					Loaded.account = true;
					$modalInstance.close(true);
					loginData.loading = false;
					// setting token handled by pyAuthentication already
				};
				var error = function(code, dto) {
					Loaded.account = true;
					i18n(function(t) {
						loginData.loading = false;
						if(code === responseCodes.LOGIN_LOCKED) {
							loginData.alert = t('alerts:login.locked');
						} else {
							loginData.alert = t('alerts:login.invalid');
						}
					});
				};
				$scope.submit = function() {
					Loaded.account = false;
					loginData.loading = true;
					// manually remove token in case of odd errors
					pyAuthentication.forceLogout();
					pyAuthentication.login(success, error, apiError(Loaded, loginData), loginData.username, loginData.password, loginData.rememberMe);
					// just reset password?
					//loginData.username = '';
					loginData.password = '';
					loginData.alert = undefined;
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};
			
			$scope.openLogin = function() {
				var l = $modal.open({
					templateUrl: 'loginModal',
					controller: ModalInterface.controller(LoginModalCtrl),
					backdrop: false
				});
				l.result.then(function() {
						loginData.open = false;
					}, function() {
						loginData.open = false;
				});
				l.opened.then(function() {
						loginData.open = true;
					}, function() {
						loginData.open = false;
				});
			};
			
			$rootScope.$on(events.LOGIN_OPEN, function(event) {
				$scope.openLogin();
			});
		}]);
	controller.controller('LogoutController', ['$scope', 'Loaded', 'Options', 'pyAuthentication', 'Alerts',
		function($scope, Loaded, Options, pyAuthentication, Alerts) {
			var success = function(code, dto, page) {
				Loaded.account = true;
				Options.resetWarning();
				// setting token handled by pyAuthentication already
				/*i18n(function(t) {
					Alerts.success(t('alerts:logout.success'));
				});*/
			};
			var error = function(code, dto) {
				Loaded.account = true;
				i18n(function(t) {
					Alerts.error(t('alerts:logout.error'));
				});
			};
			$scope.logout = function($event) {
				Loaded.account = false;
				pyAuthentication.logout(success, error, apiError(Loaded));
			};
		}]);
});