define(['./module', 'jquery', 'angular'],
		function(controller, $, ng) {
	controller.controller('AlertsController', ['$scope', 'Alerts', function($scope, Alerts) {
		$scope.alerts = Alerts.getAlerts();
		$scope.clear = function() {
			Alerts.clear();
			$scope.notifications = Alerts.getAlerts();
		};
		$scope.close = function($index) {
			Alerts.remove($index);
		};
	}]);
});