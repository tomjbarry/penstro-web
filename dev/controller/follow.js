define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/scope-variables', 'js/constants/chained-keys', 'js/constants/partials'],
		function(controller, $, ng, i18n, utils, pathVars, scopeVars, chainedKeys, partials) {
	
	var getSuccess = function($scope) {
		return function(callback) {
			return function(code, dto, p) {
				$scope.loadingSubSingle = false;
				return callback(code, dto, p);
			};
		};
	};
	
	var getError = function($scope) {
		return function(error) {
			return function(code, dto) {
				i18n(function(t) {
					$scope.loadingSubSingle = false;
					$scope.subSingleAlert = t('alerts:single.errors.user');
				});
				$scope.subData = {};
				error(code, dto);
			};
		};
	};
	
	var getLoadUser = function($scope, User, user) {
		return User.user($scope, user, getSuccess($scope), getError($scope), getError($scope));
	};
	
	
	controller.controller('FollowInfoController', ['$scope', '$parse', 'User',
		function($scope, $parse, User) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var getData = function() {
				$scope.subSingleAlert = undefined;
				if((ng.isDefined($scope.subData) && ng.isDefined($scope.subData.single)) || !ng.isDefined($scope.info)) {
					$scope.subData = {};
				} else {
					$scope.loadingSubSingle = true;
					$scope.subData = getLoadUser($scope, User, $scope.info.username.username);
				}
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.info = s.getSingleMain();
					$scope.timeSince = utils.getTimeSince($scope.info.added);
					$scope.calendar = utils.getCalendarDate($scope.info.added);
					
					$scope.clickUser = getData;
					
					if($scope.single.autoLoad) {
						$scope.clickUser();
					}
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
	controller.controller('FolloweeController', ['$scope', '$parse', 'CurrentUser', 'User', 'pyFollow',
		function($scope, $parse, CurrentUser, User, pyFollow) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';

			var getData = function() {
				$scope.subSingleAlert = undefined;
				if((ng.isDefined($scope.subData) && ng.isDefined($scope.subData.single)) || !ng.isDefined($scope.info)) {
					$scope.subData = {};
				} else {
					$scope.loadingSubSingle = true;
					$scope.subData = getLoadUser($scope, User, $scope.info.username.username);
				}
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
							$scope.subData = {};
							CurrentUser.refreshSubscription();
						};
						var error = function() {
							i18n(function(t) {
								$scope.subAlert = t('alerts:follow.unfollowError');
							});
						};
						$scope.subAlert = undefined;
						pyFollow.unfollow(success, error, error, $scope.info.username.username);
					};
					
					$scope.clickUser = getData;
					
					if($scope.single.autoLoad) {
						$scope.clickUser();
					}
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
	controller.controller('BlockedInfoController', ['$scope', '$parse', 'User', 'pyBlock',
		function($scope, $parse, User, pyBlock) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';

			var getData = function() {
				$scope.subSingleAlert = undefined;
				if((ng.isDefined($scope.subData) && ng.isDefined($scope.subData.single)) || !ng.isDefined($scope.info)) {
					$scope.subData = {};
				} else {
					$scope.loadingSubSingle = true;
					$scope.subData = getLoadUser($scope, User, $scope.info.username.username);
				}
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
							$scope.subData = {};
						};
						var error = function() {
							i18n(function(t) {
								$scope.subAlert = t('alerts:block.unblockError');
							});
						};
						pyBlock.unblock(success, error, error, $scope.info.username.username);
					};
					
					$scope.clickUser = getData;
					
					if($scope.single.autoLoad) {
						$scope.clickUser();
					}
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