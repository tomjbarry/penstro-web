define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/model-attributes'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, modelAttributes) {
	controller.controller('BackerController', ['$scope', 'Pageable', 'Alerts', 'pyBacker',
		function($scope, Pageable, Alerts, pyBacker) {
			$scope.init = function(i) {
				$scope.backer = Pageable.getPageItem(i);
				if(typeof($scope.backer) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.backer.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.backer');
					});
				}
			};
			$scope.cancel = function() {
				
				var success = function(code, dto, page) {
					$scope.disabled = true;
				};
				var error = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:backer.cancelError'));
					});
				};
				var username = $scope.backer.source.username;
				pyBacker.cancelBacker(success, error, error, username);
			};
		}
	]);
	controller.controller('BackeeController', ['$scope', 'Pageable', 'Alerts', 'pyBacker',
		function($scope, Pageable, Alerts, pyBacker) {
			$scope.init = function(i) {
				$scope.backee = Pageable.getPageItem(i);
				if(typeof($scope.backee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.backee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.backee');
					});
				}
			};
			$scope.withdraw = function() {
				
				var success = function(code, dto, page) {
					$scope.disabled = true;
				};
				var error = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:backer.withdrawError'));
					});
				};
				var username = $scope.backee.target.username;
				pyBacker.withdrawBackee(success, error, error, username);
			};
		}
	]);
});