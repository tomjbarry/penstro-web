define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/events', 'js/constants/roles', 'js/constants/values'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, events, roles, values) {
	controller.controller('UserOptionsController', ['$rootScope', '$scope', '$location', 'Loaded', 'Alerts', 'Authentication', 'AutoRefresh',
																									'CurrentUser', 'pyFinance',
		function($rootScope, $scope, $location, Loaded, Alerts, Authentication, AutoRefresh, CurrentUser, pyFinance) {
			$scope.loaded = Loaded;
			$scope.show = false;
			var currentSuccess = function(currentUser) {
				$scope.show = true;
				$scope.currentUser = currentUser;
				var args = {};
				args[pathVars.USER] = currentUser.username.username;
				$scope.userLink = utils.format(viewUrls.USERS_ID, args);
				$scope.activityLink = utils.format(viewUrls.USERS_ID_ACTIVITY, args);
				$scope.followersLink = utils.format(viewUrls.USERS_ID_FOLLOWERS, args);
				$scope.followeesLink = utils.format(viewUrls.USERS_ID_FOLLOWEES, args);
			};
			
			var currentError = function() {
				$scope.show = Loaded.FAILED;
			};
			
			var balanceSuccess = function(code, dto, page) {
				$scope.loadedBalance = true;
				i18n(function(t) {
					$scope.balance = t('shared:balanceCount', {count: dto.balance});
				});
			};
			
			var balanceError = function() {
				if($scope.authenticated) {
					$scope.loadedBalance = Loaded.FAILED;
					i18n(function(t) {
						Alerts.warning(t('alerts:user.balanceError'));
					});
				}
			};
			
			var hasDeleted = function(result) {
				if(result) {
					$location.url(viewUrls.DELETED);
				}
			};
			
			var getBalance = function(error) {
				pyFinance.balance(balanceSuccess, error, error);
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.getFresh(currentSuccess, currentError);
					CurrentUser.hasOverrideRole(roles.overrideRoles.DELETED, hasDeleted);
					getBalance(balanceError);
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			$rootScope.$on(events.PRE_LOGIN_CHANGE, function(event, authenticated) {
				$scope.show = false;
			});
			
			var refresh = function() {
				// do nothing if it fails
				if(Authentication.isAuthenticated()) {
					CurrentUser.getFresh(currentSuccess, function() {});
					getBalance(function() {});
				}
			};
			AutoRefresh.manageRefresh(refresh, values.USER_OPTIONS_REFRESH, undefined, true, undefined, $scope);
			/*
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				authentication(authenticated);
			});
			*/
			$rootScope.$on(events.BALANCE_CHANGE, function(event) {
				if($scope.authenticated) {
					getBalance(function() {});
				}
			});
		}]);
});