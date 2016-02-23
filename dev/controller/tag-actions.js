define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils', 'js/constants/events', 'js/constants/path-variables', 'js/constants/states'],
		function(controller, $, ng, i18n, utils, events, pathVars, states) {
	controller.controller('TagActionsController', ['$state', '$scope', 'Authentication', 'Single', 'CurrentUser', 'Title', 'Social',
		function($state, $scope, Authentication, Single, CurrentUser, Title, Social) {

		var pscope = $scope.$parent;
		$scope.pscope = pscope;
			
			$scope.openShare = function() {
				if(ng.isDefined($scope.tag)) {
					i18n(function(t) {
						var p = {};
						p[pathVars.TAG] = pscope.tag.name;
						Social.open(t('shared:socialOptions.tag.title', {tag: pscope.tag.name}),
								t('shared:socialOptions.tag.description', {value: pscope.tag.appreciation, tag: pscope.tag.name}),
								$state.href(states.TAGS_ID, p, {absolute: true}));
					});
				}
			};
			
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
			*/
			
			/*
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						$scope.loadedCurrentUser = true;
						$scope.currentUser = currentUser;
						$scope.currentUsername = currentUser.username.username;
					}, function() {
						$scope.loadedCurrentUser = Loaded.FAILED;
					});
				} else {
					$scope.loadedCurrentUser = false;
					$scope.currentUser = undefined;
					$scope.currentUsername = undefined;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});*/
		}
	]);
});