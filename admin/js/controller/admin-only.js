define(['./module', 'jquery', 'angular', 'js/constants/roles', 'js/constants/events'],
		function(controller, $, ng, roles, events) {
	controller.controller('AdminOnlyController', ['$rootScope', '$scope', 'Authentication', 'CurrentUser',
		function($rootScope, $scope, Authentication, CurrentUser) {
		
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				$scope.isAdmin = false;
				if(authenticated) {
						CurrentUser.hasRole(roles.roles.ADMIN, function(result) {
							if(result) {
								$scope.isAdmin = true;
							}
						}, function() {
							$scope.isAdmin = false;
						});
				} else {
					$scope.isAdmin = false;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
		}
	]);
});