define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/model-attributes'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, modelAttributes) {
	controller.controller('AdminBackerController', ['$scope', 'Single', 'Pageable', 'Alerts', 'pyaBacker',
		function($scope, Single, Pageable, Alerts, pyaBacker) {
			$scope.init = function(i) {
				$scope.backer = Pageable.getPageItem(i);
				if(typeof($scope.backer) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.backer.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.backer');
					});
	
					var username;
					var updated = function(s) {
						if(typeof(s) !== 'undefined') {
							$scope.user = Single.getSingleMain(s);
							username = $scope.user.username.username;
						}
					};
					Single.manageEvent($scope, function(event, single) {
						updated(single);
					});
					var single = Single.getSingle();
					updated(single);
				
					$scope.cancel = function() {
						
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:backer.cancelError'));
							});
						};
						var backerName = $scope.backer.source.username;
						if(typeof(username) !== 'undefined') {
							pyaBacker.cancelBacker(success, error, error, username, backerName);
						}
					};
				}
			};
		}
	]);
	controller.controller('AdminBackeeController', ['$scope', 'Single', 'Pageable', 'Alerts', 'pyaBacker',
		function($scope, Single, Pageable, Alerts, pyaBacker) {
			$scope.init = function(i) {
				$scope.backee = Pageable.getPageItem(i);
				if(typeof($scope.backee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.backee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.backee');
					});
	
					var username;
					var updated = function(s) {
						if(typeof(s) !== 'undefined') {
							$scope.user = Single.getSingleMain(s);
							username = $scope.user.username.username;
						}
					};
					Single.manageEvent($scope, function(event, single) {
						updated(single);
					});
					var single = Single.getSingle();
					updated(single);
					
					$scope.withdraw = function() {
						
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:backer.withdrawError'));
							});
						};
						var backerName = $scope.backee.target.username;
						if(typeof(username) !== 'undefined') {
							pyaBacker.withdrawBackee(success, error, error, username, backerName);
						}
					};
				}
			};
		}
	]);
});