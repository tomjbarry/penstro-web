define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/roles',
        'js/constants/events', 'js/constants/states', 'js/constants/view-ids'],
		function(controller, $, ng, i18n, validation, utils, responseCodes, pathVars, viewUrls, roles, events, states, viewIds) {
	controller.controller('CreateMessageController', ['$rootScope', '$scope', '$stateParams', '$modal', 'Alerts', 'ModalInterface', 'Browser', 'MarkdownConverter',
																										'Authentication', 'pyMessage',
		function($rootScope, $scope, $stateParams, $modal, Alerts, ModalInterface, Browser, Converter, Authentication, pyMessage) {
			$scope.messageLoading = false;
			$scope.message = undefined;
			$scope.alert = undefined;
			$scope.errors = {};
			
			$scope.refresh = true;
			
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
					$scope.messageLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['message'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if(code === responseCodes.NOT_ALLOWED) {
						$scope.alert = t('alerts:message.notAllowed');
					} else {
						$scope.alert = t('alerts:message.error');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.messageLoading = false;
				$scope.message = undefined;
				$scope.preview = undefined;
				$rootScope.$broadcast(events.TOGGLE_AUTO_REFRESH, $scope.refresh);
				Browser.scrollTo(viewIds.PAGEABLE);
			};
			
			var apiError = function() {
				i18n(function(t) {
					Browser.scrollTo('form');
					$scope.messageLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			
			var flagData = {loading: false, open: false};
			$scope.flagData = flagData;
			var FlagModalCtrl = function($scope, $modalInstance) {
				$scope.flagData = flagData;
				var success = function(code, dto, page) {
					flagData.loading = false;
					i18n(function(t) {
						Alerts.info(t('alerts:flagged.messageSuccess'));
					});
				};
				
				var error = function() {
					i18n(function(t) {
						flagData.loading = false;
						Alerts.warning(t('alerts:flagged.messageError'));
					});
				};
				
				$scope.submit = function() {
					flagData.loading = true;
					pyMessage.flag(success, error, error, $stateParams[pathVars.USER]);
					$modalInstance.close(true);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openFlag = function() {
				var m = $modal.open({
					templateUrl: 'flagModal',
					controller: ModalInterface.controller(FlagModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						flagData.open = false;
					}, function() {
						flagData.open = false;
				});
				m.opened.then(function() {
						flagData.open = true;
					}, function() {
						flagData.open = false;
				});
			};
			
			$scope.toggleAutoRefresh = function() {
				$scope.refresh = !$scope.refresh;
				$rootScope.$broadcast(events.TOGGLE_AUTO_REFRESH, $scope.refresh);
			};
			
			$scope.createMessage = function() {
				$scope.alert = undefined;
				$scope.errors = {};
				$scope.messageLoading = true;
				pyMessage.send(success, error, apiError, $stateParams[pathVars.USER], $scope.message);
			};
			
			Converter.manageEvent($scope, function() {
				var content = $scope.message;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.preview = content;
			});
		}
	]);
});