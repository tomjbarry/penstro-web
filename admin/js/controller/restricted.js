define(['./module', 'jquery', 'angular', 'js/util/i18n', 'admin-js/constants/admin-states',
        'admin-js/constants/admin-param-values', 'js/constants/scope-variables'],
		function(controller, $, ng, i18n, adminStates, adminParamValues, scopeVars) {
	controller.controller('AdminRestrictedController', ['$scope', '$state', '$parse', 'Alerts', 'pyaRestricted',
		function($scope, $state, $parse, Alerts, pyaRestricted) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					var word = $scope.info.word;
					var type = adminParamValues.RESTRICTED_USERNAME;
				
					if($state.is(adminStates.RESTRICTED_USERNAMES)) {
						type = adminParamValues.RESTRICTED_USERNAME;
						$scope.type = 'u';
					} else if($state.is(adminStates.RESTRICTED_PASSWORDS)) {
						type = adminParamValues.RESTRICTED_PASSWORD;
						$scope.type = 'p';
					} else if($state.is(adminStates.RESTRICTED_EMAILS)) {
						type = adminParamValues.RESTRICTED_EMAIL;
						$scope.type = 'e';
					}
					
					$scope.remove = function() {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:modRestricted.removeError'));
							});
						};
						if(typeof(word) !== 'undefined') {
							pyaRestricted.removeRestricted(success, error, error, type, word);
						}
					};
				}
			};
		}
	]);

});