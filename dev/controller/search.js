define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/states', 'js/constants/path-variables', 'js/constants/response-codes'],
		function(controller, $, ng, i18n, states, pathVars, responseCodes) {
	controller.controller('SearchTagsController', ['$scope', '$state', 'Loaded', 'pyTag', function($scope, $state, Loaded, pyTag) {
		var tag;
		var success = function(code, dto, p) {
			var params = {};
			params[pathVars.TAG] = $scope.tag;
			$state.go(states.TAGS_ID, params, {reload: true});
		};
		
		var error = function(code, dto) {
			i18n(function(t) {
				if(code === responseCodes.NOT_FOUND) {
					$scope.alert = t('shared:tagSearch.notFoundTag', {tag: tag});
				} else {
					$scope.alert = t('alerts:apiError');
				}
			});
		};
		var api = function() {
			i18n(function(t) {
				$scope.alert = t('alerts:apiError');
			});
		};
		
		$scope.search = function() {
			tag = $scope.tag;
			$scope.alert = undefined;
			if(typeof($scope.tag) === 'undefined' || $scope.tag.length === 0) {
				return;
			}
			
			pyTag.tag(success, error, api, tag);
		};
		
		Loaded.resetInfo(true);
		Loaded.loadedInfo();
	}]);
	controller.controller('SearchUsersController', ['$scope', '$state', 'Loaded', 'pyUser', function($scope, $state, Loaded, pyUser) {
		var user;
		var success = function(code, dto, p) {
			var params = {};
			params[pathVars.USER] = $scope.user;
			$state.go(states.USERS_ID, params, {reload: true});
		};
		
		var error = function(code, dto) {
			i18n(function(t) {
				if(code === responseCodes.NOT_FOUND) {
					$scope.alert = t('shared:userSearch.notFoundUser', {user: user});
				} else {
					$scope.alert = t('alerts:apiError');
				}
			});
		};
		var api = function() {
			i18n(function(t) {
				$scope.alert = t('alerts:apiError');
			});
		};
		
		$scope.search = function() {
			user = $scope.user;
			$scope.alert = undefined;
			if(typeof($scope.user) === 'undefined' || $scope.user.length === 0) {
				return;
			}
			
			pyUser.user(success, error, api, user);
		};
		
		Loaded.resetInfo(true);
		Loaded.loadedInfo();
	}]);
	controller.controller('MessageUsersController', ['$scope', '$state', 'Loaded', 'pyUser', function($scope, $state, Loaded, pyUser) {
		var user;
		var success = function(code, dto, p) {
			var params = {};
			params[pathVars.USER] = $scope.user;
			$state.go(states.USERS_ID_MESSAGES, params, {reload: true});
		};
		
		var error = function(code, dto) {
			i18n(function(t) {
				if(code === responseCodes.NOT_FOUND) {
					$scope.alert = t('shared:userSearch.notFoundUser', {user: user});
				} else {
					$scope.alert = t('alerts:apiError');
				}
			});
		};
		var api = function() {
			i18n(function(t) {
				$scope.alert = t('alerts:apiError');
			});
		};
		
		$scope.search = function() {
			user = $scope.user;
			$scope.alert = undefined;
			if(typeof($scope.user) === 'undefined' || $scope.user.length === 0) {
				return;
			}
			
			pyUser.user(success, error, api, user);
		};
		
		Loaded.resetInfo(true);
		Loaded.loadedInfo();
	}]);
});