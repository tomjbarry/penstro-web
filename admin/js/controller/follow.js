define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/chained-keys', 'js/constants/scope-variables'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, chainedKeys, scopeVars) {
	controller.controller('AdminFollowerController', ['$scope', '$parse',
		function($scope, $parse) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					$scope.timeSince = utils.getTimeSince($scope.info.added);
					$scope.calendar = utils.getCalendarDate($scope.info.added);
				}
			};
			
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);
	controller.controller('AdminFolloweeController', ['$scope', '$parse', 'Alerts', 'pyaFollow',
		function($scope, $parse, Alerts, pyaFollow) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var getUsername = function() {
				return $parse($scope.$parent.$parent.$parent[scopeVars.SINGLE])($scope.$parent.$parent.$parent);
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					
					$scope.timeSince = utils.getTimeSince($scope.info.added);
					$scope.calendar = utils.getCalendarDate($scope.info.added);
			
					$scope.unfollow = function() {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:follow.unfollowError'));
							});
						};
						var username = getUsername();
						if(ng.isDefined(username)) {
							pyaFollow.unfollow(success, error, error, username, $scope.info.username.username);
						}
					};
				}
			};
			
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);
	controller.controller('AdminBlockedController', ['$scope', '$parse', 'Alerts', 'pyaFollow',
		function($scope, $parse, Alerts, pyaFollow) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';

			var getUsername = function() {
				return $parse($scope.$parent.$parent.$parent[scopeVars.SINGLE])($scope.$parent.$parent.$parent);
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					$scope.timeSince = utils.getTimeSince($scope.info.added);
					$scope.calendar = utils.getCalendarDate($scope.info.added);
					
					$scope.unblock = function() {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:block.unblockError'));
							});
						};
						var username = getUsername();
						if(ng.isDefined(username)) {
							pyaFollow.unblock(success, error, error, username, $scope.info.username.username);
						}
					};
				}
			};
			
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);

});