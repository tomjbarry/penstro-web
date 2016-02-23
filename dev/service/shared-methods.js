define(['./module', 'jquery', 'angular'],
		function(service, $, ng) {
	
	service.factory('SharedMethods', ['$modal', 'ModalInterface', function($modal, ModalInterface) {
		return {
			getPromotionStatsModal: function(scope, title, tally, tallyLabel, replyTally, replyTallyLabel, labels) {
				var controller = function($scope, $modalInstance) {
					$scope.scope = scope;
					
					$scope.title = title;
					$scope.tally = tally;
					$scope.tallyLabel = tallyLabel;
					$scope.replyTally = replyTally;
					$scope.replyTallyLabel = replyTallyLabel;
					$scope.labels = labels;
					
					$scope.close = function() {
						$modalInstance.dismiss('cancel');
					};
				};
				return function($event) {
					var p = $modal.open({
						templateUrl: 'promotionStatsModal',
						controller: ModalInterface.controller(controller),
						backdrop: false
					});
				};
			}
		};
	}]);
});