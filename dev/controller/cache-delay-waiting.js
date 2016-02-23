define(['./module', 'jquery', 'angular', 'js/constants/events', 'js/constants/view-ids'],
		function(controller, $, ng, events, viewIds) {
	controller.controller('CacheDelayController', ['$rootScope', '$scope', 'Browser', 'CacheDelay', function($rootScope, $scope, Browser, CacheDelay) {
		$scope.show = false;
		$scope.waiting = CacheDelay.waiting;
		$scope.close = function() {
			$scope.show = false;
		};
		$rootScope.$on(events.CACHE_DELAY_SHOW_TOGGLE, function(event) {
			$scope.show = !$scope.show;
			Browser.scrollTo(viewIds.ALERTS);
		});
	}]);
	controller.controller('CacheDelayIconController', ['$rootScope', '$scope', 'CacheDelay', 'Tour', function($rootScope, $scope, CacheDelay, Tour) {
		$scope.waiting = CacheDelay.waiting;
		$scope.tour = Tour.tour;
		$scope.toggle = function() {
			$rootScope.$broadcast(events.CACHE_DELAY_SHOW_TOGGLE);
		};
	}]);
});