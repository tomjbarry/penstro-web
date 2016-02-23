define(['./module', 'jquery', 'angular', 'js/constants/events', 'js/constants/view-ids'],
		function(controller, $, ng, events, viewIds) {
	controller.controller('TourAvailableController', ['$rootScope', '$scope', 'Browser', 'Tour', function($rootScope, $scope, Browser, Tour) {
		$scope.show = false;
		$scope.tour = Tour.tour;
		$scope.close = function() {
			$scope.show = false;
		};
		$scope.finish = function() {
			$scope.show = false;
			Tour.finish();
		};
		$scope.begin = function() {
			$scope.show = false;
			Tour.show();
		};
		$rootScope.$on(events.TOUR_SHOW_TOGGLE, function(event) {
			$scope.show = !$scope.show;
			Browser.scrollTo(viewIds.ALERTS);
		});
	}]);
	controller.controller('TourAvailableIconController', ['$rootScope', '$scope', 'Tour', function($rootScope, $scope, Tour) {
		$scope.tour = Tour.tour;
		$scope.toggle = function() {
			$rootScope.$broadcast(events.TOUR_SHOW_TOGGLE);
		};
	}]);
});