define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/events', 'js/constants/states', 'js/constants/params'],
		function(controller, $, ng, i18n, events, states, params) {
	controller.controller('TermsController', ['$rootScope', '$scope', '$state', '$location', '$timeout',
	'Loaded', 'Browser', 'Authentication', 'Alerts', 'CacheDelay', 'pyProfile',
		function($rootScope, $scope, $state, $location, $timeout, Loaded, Browser, Authentication, Alerts, CacheDelay, pyProfile) {
			$scope.loaded = Loaded;
			$scope.allowAccept = false;
			// wait for username to be able to be cached before letting them do much
			//nah, nvm. too annoying
			$scope.allowAccept = true;
			/*CacheDelay.user(function() {
				$scope.allowAccept = true;
			});*/
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var success = function(code, dto, page) {
				//$rootScope.$broadcast(events.BACK);
				$state.go(states.DEFAULT, undefined, {reload: true});
			};
			
			var error = function(code, dto) {
				i18n(function(t) {
					Alerts.error(t('alerts:terms.error'));
				});
			};
			
			var apiError = function() {
				i18n(function(t) {
					Alerts.error(t('alerts:apiError'));
				});
			};
			
			$scope.accept = function() {
				if($scope.authenticated && $scope.allowAccept) {
					pyProfile.acceptTermsOfService(success, error, apiError);
				}
			};
			
			$scope.decline = function() {
				$rootScope.$broadcast(events.BACK);
			};
			
			$scope.$watch('loaded.content', function(newValue, oldValue) {
				var scrollTo = $location.search()[params.SCROLL_TO];
				if(newValue === true && typeof(scrollTo) !== 'undefined' && scrollTo !== '') {
					$scope.$evalAsync(function() {
						$timeout(function() {
							Browser.scrollTo(scrollTo);
						}, 1);
					});
				}
			});
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	
});