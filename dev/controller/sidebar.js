define(['./module', 'jquery', 'angular', 'js/constants/events'], function(controller, $, ng, events) {
	var loaded;
	controller.controller('SidebarController', ['$rootScope', '$scope', 'Authentication', 'Loaded',
		function($rootScope, $scope, Authentication, Loaded) {
			$scope.loaded = Loaded;
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());

			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			$scope.loaded.account = true;
		}]);
});