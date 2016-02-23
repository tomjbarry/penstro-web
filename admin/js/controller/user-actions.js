define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/chained-keys', 'js/constants/roles',
        'js/constants/events', 'js/constants/time-values'],
		function(controller, $, ng, i18n, validation, utils, pathVars, viewUrls, responseCodes, chainedKeys, roles, events, timeValues) {
	controller.controller('AdminUserActionsController', ['$rootScope', '$scope', '$modal', 'Alerts', 'CacheDelay',
			'MarkdownConverter', 'ModalInterface', 'pyaUser',
		function($rootScope, $scope, $modal, Alerts, CacheDelay, Converter, ModalInterface, pyaUser) {
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			
			$scope.status = {
				lock: true,
				emailRequest: true,
				paymentRequest: true,
				resetSettings: true,
				clearLoginFailures: true,
				actions: false,
				roles: false,
				pendingActions: false,
				description: false,
				appreciationResponse: false
			};
			$scope.showDescriptionPreview = false;
			$scope.showResponsePreview = false;
			/*
			var username;
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.user = Single.getSingleMain(s);
					$scope.username = $scope.user.username.username;
					username = $scope.username;
					var sB = s[chainedKeys.BALANCE];
					var sC = s[chainedKeys.CURRENT];
					var sR = s[chainedKeys.ROLES];
					
					if(typeof(sB) === 'undefined' || sB.code !== responseCodes.SUCCESS) {
						Single.fail();
						return;
					}
					if(typeof(sC) === 'undefined' || sC.code !== responseCodes.SUCCESS) {
						Single.fail();
						return;
					}
					if(typeof(sR) === 'undefined' || sR.code !== responseCodes.SUCCESS) {
						Single.fail();
						return;
					}
					$scope.balance = sB.dto;
					$scope.current = sC.dto;
					$scope.roles = sR.dto;
					
					$scope.pendingActions = $scope.current.pendingActions;
					$scope.description = $scope.user.description;
					$scope.warning = $scope.user.warning;
					$scope.appreciationResponse = $scope.user.appreciationResponse;
					$scope.appreciationResponseWarning = $scope.user.appreciationResponseWarning;
					$scope.email = $scope.current.email;
					$scope.paymentId = $scope.current.paymentId;
					$scope.notificationCount = $scope.current.notificationCount;
					$scope.feedCount = $scope.current.feedCount;
					$scope.loginFailureCount = $scope.current.loginFailureCount;
				}
			};
			*/
			
			var getBalance = function(v) {
				var s = pscope.single;
				if(ng.isDefined(s)) {
					var o = s.getChained(chainedKeys.BALANCE);
					if(ng.isDefined(o) && o.code === responseCodes.SUCCESS) {
						if(ng.isDefined(v)) {
							return o.dto[v];
						}
						return o.dto;
					}
				}
				return {};
			};
			$scope.getBalance = getBalance;
			
			var getCurrent = function(v) {
				var s = pscope.single;
				if(ng.isDefined(s)) {
					var o = s.getChained(chainedKeys.CURRENT);
					if(ng.isDefined(o) && o.code === responseCodes.SUCCESS) {
						if(ng.isDefined(v)) {
							return o.dto[v];
						}
						return o.dto;
					}
				}
				return {};
			};
			$scope.getCurrent = getCurrent;
			
			var getRoles = function(v) {
				var s = pscope.single;
				if(ng.isDefined(s)) {
					var o = s.getChained(chainedKeys.ROLES);
					if(ng.isDefined(o) && o.code === responseCodes.SUCCESS) {
						if(ng.isDefined(v)) {
							return o.dto[v];
						}
						return o.dto;
					}
				}
				return {};
			};
			$scope.getRoles = getRoles;
			
			var scope = $scope;
			
			var balanceData = {loading: false, open: false};
			var AddBalanceModalCtrl = function($scope, $modalInstance) {
				$scope.balanceData = balanceData;
				$scope.scope = scope;
				balanceData.errors = {};
				balanceData.alert = undefined;
				balanceData.amount = 0;
				balanceData.balance = getBalance().balance;
				
				var success = function(code, dto, page) {
					balanceData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						balanceData.loading = false;
						balanceData.alert = t('alerts:modUser.balanceError');
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						balanceData.loading = false;
						balanceData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					balanceData.alert = undefined;
					balanceData.errors = {};
					balanceData.loading = true;
					var amount = balanceData.amount;
					if(amount < 0) {
						pyaUser.removeBalance(success, error, apiError, pscope.username, 0 - amount);
					} else {
						pyaUser.addBalance(success, error, apiError, pscope.username, amount);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openAddBalance = function() {
				var m = $modal.open({
					templateUrl: 'addBalanceModal',
					controller: ModalInterface.controller(AddBalanceModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						balanceData.open = false;
					}, function() {
						balanceData.open = false;
				});
				m.opened.then(function() {
						balanceData.open = true;
					}, function() {
						balanceData.open = false;
				});
			};
			
			var usernameData = {loading: false, open: false};
			var ChangeUsernameModalCtrl = function($scope, $modalInstance) {
				$scope.usernameData = usernameData;
				$scope.scope = scope;
				usernameData.errors = {};
				usernameData.alert = undefined;
				usernameData.username = pscope.username;
				usernameData.newUsername = undefined;
				
				var success = function(code, dto, page) {
					usernameData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						usernameData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['username'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									usernameData.errors[field] = t(code, validation.getArguments(error));
								} else {
									usernameData.errors[field] = undefined;
								}
							});
						} else {
							usernameData.alert = t('alerts:modUser.usernameError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						usernameData.loading = false;
						usernameData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					usernameData.alert = undefined;
					usernameData.errors = {};
					usernameData.loading = true;
					pyaUser.rename(success, error, apiError, pscope.username, usernameData.newUsername);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openChangeUsername = function() {
				var m = $modal.open({
					templateUrl: 'changeUsernameModal',
					controller: ModalInterface.controller(ChangeUsernameModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						usernameData.open = false;
					}, function() {
						usernameData.open = false;
				});
				m.opened.then(function() {
						usernameData.open = true;
					}, function() {
						usernameData.open = false;
				});
			};
			
			var emailData = {loading: false, open: false};
			var ChangeEmailModalCtrl = function($scope, $modalInstance) {
				$scope.emailData = emailData;
				$scope.scope = scope;
				emailData.errors = {};
				emailData.alert = undefined;
				emailData.username = pscope.username;
				emailData.email = scope.email;
				emailData.newEmail = undefined;
				
				var success = function(code, dto, page) {
					emailData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						emailData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['email'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									emailData.errors[field] = t(code, validation.getArguments(error));
								} else {
									emailData.errors[field] = undefined;
								}
							});
						} else {
							emailData.alert = t('alerts:modUser.emailError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						emailData.loading = false;
						emailData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					emailData.alert = undefined;
					emailData.errors = {};
					emailData.loading = true;
					pyaUser.changeEmail(success, error, apiError, pscope.username, emailData.newEmail);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openChangeEmail = function() {
				var m = $modal.open({
					templateUrl: 'changeEmailModal',
					controller: ModalInterface.controller(ChangeEmailModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						emailData.open = false;
					}, function() {
						emailData.open = false;
				});
				m.opened.then(function() {
						emailData.open = true;
					}, function() {
						emailData.open = false;
				});
			};
			
			var passwordData = {loading: false, open: false};
			var ChangePasswordModalCtrl = function($scope, $modalInstance) {
				$scope.passwordData = passwordData;
				$scope.scope = scope;
				passwordData.errors = {};
				passwordData.alert = undefined;
				passwordData.username = pscope.username;
				passwordData.password = scope.password;
				
				var success = function(code, dto, page) {
					passwordData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						passwordData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['password'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									passwordData.errors[field] = t(code, validation.getArguments(error));
								} else {
									passwordData.errors[field] = undefined;
								}
							});
						} else {
							passwordData.alert = t('alerts:modUser.passwordError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						passwordData.loading = false;
						passwordData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					passwordData.alert = undefined;
					passwordData.errors = {};
					passwordData.loading = true;
					pyaUser.setPassword(success, error, apiError, pscope.username, passwordData.password);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openChangePassword = function() {
				var m = $modal.open({
					templateUrl: 'adminChangePasswordModal',
					controller: ModalInterface.controller(ChangePasswordModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						passwordData.open = false;
					}, function() {
						passwordData.open = false;
				});
				m.opened.then(function() {
						passwordData.open = true;
					}, function() {
						passwordData.open = false;
				});
			};
			
			var lockData = {loading: false, open: false};
			var LockUserModalCtrl = function($scope, $modalInstance) {
				$scope.lockData = lockData;
				$scope.scope = scope;
				lockData.errors = {};
				lockData.alert = undefined;
				lockData.suspensions = undefined;
				i18n(function(t) {
					lockData.durations = [t('shared:time.hour'),
																t('shared:time.day'),
																t('shared:time.week'),
																t('shared:time.month'),
																t('shared:time.year'),
																t('shared:time.decade')];
					lockData.lockDuration = t('shared:time.day');
				});
				
				var success = function(code, dto, page) {
					lockData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						lockData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['suspensions', 'lockedUntil'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									lockData.errors[field] = t(code, validation.getArguments(error));
								} else {
									lockData.errors[field] = undefined;
								}
							});
						} else {
							lockData.alert = t('alerts:modUser.lockError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						lockData.loading = false;
						lockData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					lockData.alert = undefined;
					lockData.errors = {};
					lockData.loading = true;
					i18n(function(t) {
						var duration = new Date().getTime();
						if(lockData.lockDuration === t('shared:time.hour')) {
							duration = duration + timeValues.HOUR;
						} else if(lockData.lockDuration === t('shared:time.day')) {
							duration = duration + timeValues.DAY;
						} else if(lockData.lockDuration === t('shared:time.week')) {
							duration = duration + timeValues.WEEK;
						} else if(lockData.lockDuration === t('shared:time.month')) {
							duration = duration + timeValues.MONTH;
						} else if(lockData.lockDuration === t('shared:time.year')) {
							duration = duration + timeValues.YEAR;
						} else if(lockData.lockDuration === t('shared:time.decade')) {
							duration = duration + timeValues.DECADE;
						} else {
							duration = duration + timeValues.DAY;
						}
						pyaUser.lock(success, error, apiError, pscope.username, duration, lockData.suspensions);
					});
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openLockUser = function() {
				var m = $modal.open({
					templateUrl: 'lockUserModal',
					controller: ModalInterface.controller(LockUserModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						lockData.open = false;
					}, function() {
						lockData.open = false;
				});
				m.opened.then(function() {
						lockData.open = true;
					}, function() {
						lockData.open = false;
				});
			};
			
			var rolesData = {loading: false, open: false};
			var ChangeRolesModalCtrl = function($scope, $modalInstance) {
				$scope.rolesData = rolesData;
				$scope.scope = scope;
				rolesData.errors = {};
				rolesData.alert = undefined;
				rolesData.roles = '';
				rolesData.overrideRoles = '';
				var i, d;
				d = '';
				var roles = getRoles();
				for(i = 0; i < roles.roles.length; i++) {
					rolesData.roles = rolesData.roles + d + roles.roles[i];
					d = ' ';
				}
				d = '';
				for(i = 0; i < roles.overrideRoles.length; i++) {
					rolesData.overrideRoles = rolesData.overrideRoles + d + roles.overrideRoles[i];
					d = ' ';
				}
				
				var success = function(code, dto, page) {
					rolesData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						rolesData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['roles', 'overrideRoles'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									rolesData.errors[field] = t(code, validation.getArguments(error));
								} else {
									rolesData.errors[field] = undefined;
								}
							});
						} else {
							rolesData.alert = t('alerts:modUser.rolesError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						rolesData.loading = false;
						rolesData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					rolesData.alert = undefined;
					rolesData.errors = {};
					rolesData.loading = true;
					var roles = utils.parseRoles(rolesData.roles);
					var overrideRoles = utils.parseRoles(rolesData.overrideRoles);
					
					pyaUser.updateRoles(success, error, apiError, pscope.username, roles, overrideRoles);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openChangeRoles = function() {
				var m = $modal.open({
					templateUrl: 'changeRolesModal',
					controller: ModalInterface.controller(ChangeRolesModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						rolesData.open = false;
					}, function() {
						rolesData.open = false;
				});
				m.opened.then(function() {
						rolesData.open = true;
					}, function() {
						rolesData.open = false;
				});
			};
			
			var pendingActionsData = {loading: false, open: false};
			var ChangePendingActionsModalCtrl = function($scope, $modalInstance) {
				$scope.pendingActionsData = pendingActionsData;
				$scope.scope = scope;
				pendingActionsData.errors = {};
				pendingActionsData.alert = undefined;
				pendingActionsData.pendingActions = '';
				var i, d;
				d = '';
				var current = getCurrent();
				if(ng.isDefined(current.pendingActions)) {
					for(i = 0; i < current.pendingActions.length; i++) {
						pendingActionsData.pendingActions = pendingActionsData.pendingActions + d + current.pendingActions[i];
						d = ' ';
					}
				}
				
				var success = function(code, dto, page) {
					pendingActionsData.loading = false;
					$modalInstance.close(true);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						pendingActionsData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['pendingActions'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									pendingActionsData.errors[field] = t(code, validation.getArguments(error));
								} else {
									pendingActionsData.errors[field] = undefined;
								}
							});
						} else {
							pendingActionsData.alert = t('alerts:modUser.pendingActionsError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						pendingActionsData.loading = false;
						pendingActionsData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					pendingActionsData.alert = undefined;
					pendingActionsData.errors = {};
					pendingActionsData.loading = true;
					var pendingActions = utils.parsePendingActions(pendingActionsData.pendingActions);
					
					pyaUser.updatePendingActions(success, error, apiError, pscope.username, pendingActions);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openChangePendingActions = function() {
				var m = $modal.open({
					templateUrl: 'changePendingActionsModal',
					controller: ModalInterface.controller(ChangePendingActionsModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						pendingActionsData.open = false;
					}, function() {
						pendingActionsData.open = false;
				});
				m.opened.then(function() {
						pendingActionsData.open = true;
					}, function() {
						pendingActionsData.open = false;
				});
			};
			
			var getChangeSuccess = function(scopeStr) {
				return function(code, dto, page) {
					$scope.status[scopeStr] = true;
				};
			};
			
			var getChangeError = function(scopeStr, str) {
				return function(code, dto, page) {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.status[scopeStr] = true;
					});
				};
			};
			
			$scope.onChangeEmailRequest = function() {
				$scope.status.emailRequest = false;
				pyaUser.requestEmailChange(getChangeSuccess('emailRequest'), getChangeError('emailRequest', 'alerts:modUser.emailRequest'), getChangeError('emailRequest', 'alerts:apiError'), pscope.username);
			};
			
			$scope.onChangePaymentRequest = function() {
				$scope.status.paymentRequest = false;
				pyaUser.requestPaymentChange(getChangeSuccess('paymentRequest'), getChangeError('paymentRequest', 'alerts:modUser.paymentRequest'), getChangeError('paymentRequest', 'alerts:apiError'), pscope.username);
			};
			
			$scope.onResetSettings = function() {
				$scope.status.resetSettings = false;
				pyaUser.requestPaymentChange(getChangeSuccess('resetSettings'), getChangeError('resetSettings', 'alerts:modUser.resetSettings'), getChangeError('resetSettings', 'alerts:apiError'), pscope.username);
			};
			
			$scope.onClearLoginFailures = function() {
				$scope.status.clearLoginFailures = false;
				pyaUser.clearLoginAttempts(getChangeSuccess('clearLoginFailures'), getChangeError('clearLoginFailures', 'alerts:modUser.clearLoginFailures'), getChangeError('clearLoginFailures', 'alerts:apiError'), pscope.username);
			};
			
			$scope.onUnlock = function() {
				$scope.status.lock = false;
				pyaUser.unlock(getChangeSuccess('lock'), getChangeError('lock', 'alerts:modUser.lock'), getChangeError('lock', 'alerts:apiError'), pscope.username);
			};
			
			$scope.refresh = function() {
				pscope.single.refresh(true);
			};
			
			var descriptionData = {loading: false, open: false, errors: {}};
			descriptionData.description = pscope.user.description;
			descriptionData.warning = pscope.user.warning;
			$scope.descriptionData = descriptionData;
			var descriptionSuccess = function(code, dto, page) {
				descriptionData.loading = false;
				descriptionData.open = false;
				pscope.user.description = descriptionData.description;
				pscope.user.warning = descriptionData.warning;
			};
			
			var descriptionError = function(code, dto) {
				i18n(function(t) {
					descriptionData.loading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['description'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								descriptionData.errors[field] = t(code, validation.getArguments(error));
							} else {
								descriptionData.errors[field] = undefined;
							}
						});
					} else {
						descriptionData.alert(t('alerts:description.descriptionError'));
					}
				});
			};
			
			var descriptionApiError = function() {
				i18n(function(t) {
					descriptionData.loading = false;
					descriptionData.alert = t('alerts:apiError');
				});
			};
			
			$scope.updateDescription = function() {
				descriptionData.loading = true;
				descriptionData.errors = {};
				descriptionData.alert = undefined;
				pyaUser.updateProfile(descriptionSuccess, descriptionError, descriptionApiError, pscope.username, descriptionData.description, descriptionData.warning);
			};
			
			$scope.cancelDescription = function() {
				descriptionData.open = false;
			};
			
			$scope.editDescription = function() {
				descriptionData.loading = false;
				descriptionData.open = true;
				descriptionData.alert = undefined;
				descriptionData.errors = {};
				descriptionData.description = pscope.user.description;
				descriptionData.warning = pscope.user.warning;
			};
			
			var appreciationResponseData = {loading: false, open: false, errors: {}};
			appreciationResponseData.appreciationResponse = pscope.user.appreciationResponse;
			appreciationResponseData.warning = pscope.user.appreciationResponseWarning;
			$scope.appreciationResponseData = appreciationResponseData;
			var appreciationResponseSuccess = function(code, dto, page) {
				appreciationResponseData.loading = false;
				appreciationResponseData.open = false;
				pscope.user.appreciationResponse = appreciationResponseData.appreciationResponse;
				pscope.user.appreciationResponseWarning = appreciationResponseData.warning;
			};
			
			var appreciationResponseError = function(code, dto) {
				i18n(function(t) {
					appreciationResponseData.loading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['appreciationResponse'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								appreciationResponseData.errors[field] = t(code, validation.getArguments(error));
							} else {
								appreciationResponseData.errors[field] = undefined;
							}
						});
					} else {
						appreciationResponseData.alert(t('alerts:appreciationResponse.updateError'));
					}
				});
			};
			
			var appreciationResponseApiError = function() {
				i18n(function(t) {
					appreciationResponseData.loading = false;
					appreciationResponseData.alert = t('alerts:apiError');
				});
			};
			
			$scope.updateAppreciationResponse = function() {
				appreciationResponseData.loading = true;
				appreciationResponseData.errors = {};
				appreciationResponseData.alert = undefined;
				pyaUser.updateAppreciationResponse(appreciationResponseSuccess, appreciationResponseError, appreciationResponseApiError,
						pscope.username, appreciationResponseData.appreciationResponse, appreciationResponseData.warning);
			};
			
			$scope.cancelAppreciationResponse = function() {
				appreciationResponseData.open = false;
			};
			
			$scope.editAppreciationResponse = function() {
				appreciationResponseData.loading = false;
				appreciationResponseData.open = true;
				appreciationResponseData.alert = undefined;
				appreciationResponseData.errors = {};
				appreciationResponseData.appreciationResponse = pscope.user.appreciationResponse;
				appreciationResponseData.warning = pscope.user.appreciationResponseWarning;
			};
			
			$scope.updateDescriptionPreview = function() {
				var content = descriptionData.description;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.descriptionPreview = content;
			};
			
			$scope.updateResponsePreview = function() {
				var content = appreciationResponseData.appreciationResponse;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.responsePreview = content;
			};
			
			Converter.manageEvent($scope, function() {
				$scope.updateDescriptionPreview();
				$scope.updateResponsePreview();
			});
			
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
			*/
		}
	]);
});