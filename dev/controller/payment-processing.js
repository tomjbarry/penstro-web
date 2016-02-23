define(['./module', 'jquery', 'angular', 'js/constants/events', 'js/constants/view-ids'],
		function(controller, $, ng, events, viewIds) {
	controller.controller('PaymentProcessingController', ['$rootScope', '$scope', 'Browser', 'Payment', function($rootScope, $scope, Browser, Payment) {
		$scope.show = true;
		$scope.processing = Payment.processing;
		$scope.close = function() {
			$scope.show = false;
		};
		$rootScope.$on(events.PAYMENT_PROCESSING_SHOW_TOGGLE, function(event) {
			$scope.show = !$scope.show;
			Browser.scrollTo(viewIds.ALERTS);
		});
	}]);
	controller.controller('PaymentProcessingIconController', ['$rootScope', '$scope', 'Payment', 'Tour', function($rootScope, $scope, Payment, Tour) {
		$scope.processing = Payment.processing;
		$scope.tour = Tour.tour;
		$scope.toggle = function() {
			$rootScope.$broadcast(events.PAYMENT_PROCESSING_SHOW_TOGGLE);
		};
	}]);
});