define(['./module', 'jquery', 'angular', 'js/constants/states', 'js/constants/events'],
		function(service, $, ng, states, events) {
	
	service.factory('CustomEvents', ['$rootScope', '$state', '$location', function($rootScope, $state, $location) {
		var lastPath, lastState, lastParams;
		// adds an event that fires when location change success changes and state has also changed (eliminating parameter changes etc)
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if(typeof(fromState) !== 'undefined' && (typeof(fromState.skipBack) === 'undefined' || !fromState.skipBack)) {
				lastState = fromState;
				lastParams = fromParams;
			}
			$rootScope.$broadcast(events.CUSTOM_STATE_CHANGE_SUCCESS, toState, toParams, fromState, fromParams);
		});
		$rootScope.$on('$locationChangeSuccess', function(event, to, from) {
			var path = $location.path();
			if(path !== lastPath) {
				$rootScope.$broadcast(events.CUSTOM_LOCATION_CHANGE_SUCCESS);
			}
			lastPath = path;
		});
		$rootScope.$on(events.BACK, function(event) {
			if(typeof(lastState) === undefined || typeof(lastState.name) === 'undefined' || lastState.name.length === 0 || $state.current.name === lastState.name) {
				$state.go(states.DEFAULT, undefined, {reload: true});
			} else {
				$state.go(lastState.name, lastParams, {reload: true});
			}
		});
		
		return {};
	}]);
});