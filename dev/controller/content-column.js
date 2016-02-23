define(['./module', 'jquery', 'angular', 'js/constants/events'], function(controller, $, ng, events) {
	var loaded;
	// mecessary services that arent used elsewhere are instantiated here to ensure they execute
	controller.controller('ContentColumnController', ['$scope', 'Loaded', 'CustomEvents', 'StateHandler', 'RouteCheck',
		function($scope, Loaded, CustomEvents, StateChange, RouteCheck) {
			$scope.loaded = Loaded;
			var update = function() {
				$scope.loaded.content = false;
			};
			$scope.$on(events.CUSTOM_STATE_CHANGE_START, update);
		}]);
});