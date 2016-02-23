define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/constants/states', 'js/constants/path-variables',
        'admin-js/constants/admin-states', 'admin-js/constants/admin-param-values', 'js/constants/scope-variables'],
		function(controller, $, ng, utils, i18n, states, pathVars, adminStates, adminParamValues, scopeVars) {
	controller.controller('AdminFlaggedController', ['$scope', '$state', '$parse', 'Alerts', 'pyaFlagged',
		function($scope, $state, $parse, Alerts, pyaFlagged) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
		
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					
					var id = $scope.info.referenceId;
					$scope.target = $scope.info.target;
					$scope.reason = utils.getHighestKeyValue($scope.info.reasons);
					
					var args = {};
					if($state.is(adminStates.FLAGGED_USERS)) {
						$scope.type = 'u';
						args[pathVars.USER] = $scope.target;
						$scope.targetLink = $state.href(states.USERS_ID, args, {reload: true});
					} else if($state.is(adminStates.FLAGGED_POSTINGS)) {
						$scope.type = 'p';
						args[pathVars.POSTING] = id;
						$scope.targetLink = $state.href(states.POSTINGS_ID, args, {reload: true});
					} else if($state.is(adminStates.FLAGGED_COMMENTS)) {
						$scope.type = 'c';
						args[pathVars.COMMENT] = id;
						$scope.targetLink = $state.href(states.COMMENTS_ID, args, {reload: true});
					}
					
					$scope.remove = function() {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:modFlagged.removeError'));
							});
						};
						if(typeof(id) !== 'undefined') {
							if($state.is(adminStates.FLAGGED_USERS)) {
								// the username is the target
								pyaFlagged.clearUser(success, error, error, $scope.target);
							} else if($state.is(adminStates.FLAGGED_POSTINGS)) {
								pyaFlagged.clearPosting(success, error, error, id);
							} else if($state.is(adminStates.FLAGGED_COMMENTS)) {
								pyaFlagged.clearComment(success, error, error, id);
							}
						}
					};
				}
			};
		}
	]);

});