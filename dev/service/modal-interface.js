define(['./module', 'jquery', 'angular', 'js/constants/events'],
		function(service, $, ng, events) {
	service.factory('ModalInterface', ['$modal', function($modal) {
		return {
			controller: function(c) {
				var controller = ['$scope', '$modalInstance', function($scope, $modalInstance) {
					$scope.$on(events.CUSTOM_STATE_CHANGE_START, function(event) {
						$modalInstance.dismiss('close');
					});
					if(typeof(c) !== 'undefined') {
						c($scope, $modalInstance);
					}
				}];
				return controller;
			}
		};
	}]);
});