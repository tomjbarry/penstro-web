define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/events'],
		function(controller, $, ng, i18n, events) {
	
	controller.controller('ListSelectController', ['$rootScope', '$scope', '$modal', 'ModalInterface', 'pyBacker',
		function($rootScope, $scope, $modal, ModalInterface, pyBacker) {
			var selectData = {loading: false, open: false};
			$scope.selectData = selectData;
			var SelectModalCtrl = function($scope, $modalInstance) {
				$scope.selectData = selectData;
				$scope.alert = undefined;
				selectData.loading = false;
				$scope.page = [];
				
				var pageNumber = 0;
				var allowPrevious = false;
				var allowNext = false;
				
				var success = function(code, dto, page) {
					selectData.loading = false;
					if(typeof(page) !== 'undefined') {
						$scope.page = page.content;
						pageNumber = page.number;
						allowNext = !page.last;
						allowPrevious = !page.first;
					}
				};
				
				var error = function() {
					i18n(function(t) {
						selectData.loading = false;
						$scope.alert = t('alerts:apiError');
					});
				};
				
				var method = function(number) {
					selectData.loading = true;
					pyBacker.backers(success, error, error, number);
				};
				
				$scope.onPrevious = function() {
					if(allowPrevious) {
						method(pageNumber - 1);
					}
				};
				$scope.onNext = function() {
					if(allowNext) {
						method(pageNumber + 1);
					}
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
				
				$scope.select = function(pageItem) {
					if(typeof(pageItem) !== 'undefined') {
						$rootScope.$broadcast(events.LIST_SELECT_ITEM, pageItem);
						$modalInstance.close(true);
					}
				};
				
				method(0);
			};

			$scope.open = function() {
				var m = $modal.open({
					templateUrl: 'listSelectModal',
					controller: ModalInterface.controller(SelectModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						selectData.open = false;
					}, function() {
						selectData.open = false;
				});
				m.opened.then(function() {
						selectData.open = true;
					}, function() {
						selectData.open = false;
				});
			};
		}]);
});