define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/events'],
		function(controller, $, ng, i18n, events) {

	controller.controller('AppreciationResponseController', ['$rootScope', '$scope', '$modal', 'Options', 'Alerts', 'pyUser', 'Payment', 'ModalInterface',
		function($rootScope, $scope, $modal, Options, Alerts, pyUser, Payment, ModalInterface) {
			var modalData = {open: false};
			
			var AppreciationResponseModalCtrl = function($scope, $modalInstance) {
				$scope.dto = modalData.dto;
				$scope.response = $scope.dto.appreciationResponse;
				$scope.appreciationResponseWarning = $scope.dto.appreciationResponseWarning;
				$scope.hideExplicit = $scope.appreciationResponseWarning && !Options.getWarning();
				if(typeof($scope.dto.username) !== 'undefined') {
					$scope.username = $scope.dto.username.username;
				} else {
					$scope.username = modalData.username;
				}
				i18n(function(t) {
					$scope.title = t('shared:appreciationResponseUser', {user: $scope.username});
				});
				
				$scope.close = function() {
					$modalInstance.close(true);
				};
			};
			
			$rootScope.$on(events.APPRECIATION_SHOW_RESPONSE, function(event, username) {
				if(typeof(username) !== 'undefined') {
					$scope.username = username;
					var success = function(code, dto, page) {
						if(typeof(dto) !== 'undefined' && typeof(dto.appreciationResponse) !== 'undefined') {
							modalData.dto = dto;
							$scope.dto = dto;
							$scope.response = dto.appreciationResponse;
							$scope.appreciationResponseWarning = dto.appreciationResponseWarning;
							if(typeof(dto.username) !== 'undefined') {
								$scope.username = dto.username.username;
							} else {
								$scope.username = username;
							}
							modalData.username = username;

							
							var modalReference = $modal.open({
								templateUrl: 'appreciationResponseModal',
								controller: ModalInterface.controller(AppreciationResponseModalCtrl),
								backdrop: false
							});
							modalReference.result.then(function() {
									modalData.open = false;
								}, function() {
									modalData.open = false;
							});
							modalReference.opened.then(function() {
									modalData.open = true;
								}, function() {
									modalData.open = false;
							});
						}
					};
					
					var error = function() {
						i18n(function(t) {
							Alerts.warning(t('alerts:appreciationResponse.getError'));
						});
					};
					
					pyUser.appreciationResponse(success, error, error, username, true);
				}
			});
		}
	]);
});