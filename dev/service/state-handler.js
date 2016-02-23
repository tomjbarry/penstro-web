define(['./module', 'jquery', 'angular', 'js/constants/states', 'js/constants/events'],
		function(service, $, ng, states, events) {
	service.factory('StateHandler', ['$rootScope', '$state', 'Browser',
		function($rootScope, $state, Browser) {

			$rootScope.$on(events.CUSTOM_STATE_CHANGE_START, function(event, toState, toParams, fromState, fromParams) {
				//Browser.scrollTo('pageheader');
				Browser.scrollTop();
			});
			$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
				$state.go(states.DEFAULT, undefined, {reload: true});
			});
			
			return {};
	}]);
});