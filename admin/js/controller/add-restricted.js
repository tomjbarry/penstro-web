define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors',
        'js/constants/response-codes', 'admin-js/constants/admin-states', 'admin-js/constants/admin-param-values'],
		function(controller, $, ng, i18n, validation, responseCodes, adminStates, adminParamValues) {
	controller.controller('AddRestrictedController', ['$rootScope', '$scope', '$state', 'Pageable', 'Loaded', 'pyaRestricted',
		function($rootScope, $scope, $state, Pageable, Loaded, pyaRestricted) {
			$scope.loaded = Loaded;
			$scope.restrictedLoading = false;
			$scope.word = undefined;
			$scope.alert = undefined;
			$scope.errors = {};
			
			var error = function(code, dto) {
				i18n(function(t) {
					$scope.restrictedLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['word', 'type'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
							if(field === 'type') {
								$scope.alert = $scope.errors[field];
							}
						});
					} else {
						$scope.alert = t('alerts:modRestricted.createError');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.restrictedLoading = false;
				$scope.word = undefined;
			};
			
			var apiError = function() {
				i18n(function(t) {
					$scope.restrictedLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			
			var addRestricted = function(type) {
				pyaRestricted.addRestricted(success, error, apiError, type, $scope.word);
			};
			
			$scope.addRestricted = function() {
				$scope.restrictedLoading = true;
				$scope.errors = {};
				$scope.alert = undefined;
				
				if($state.is(adminStates.RESTRICTED_USERNAMES)) {
					addRestricted(adminParamValues.RESTRICTED_USERNAME);
				} else if($state.is(adminStates.RESTRICTED_PASSWORDS)) {
					addRestricted(adminParamValues.RESTRICTED_PASSWORD);
				} else if($state.is(adminStates.RESTRICTED_EMAILS)) {
					addRestricted(adminParamValues.RESTRICTED_EMAIL);
				}
			};
			
			$scope.refresh = function() {
				Pageable.refresh();
			};
		}
	]);
});