define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/model-attributes', 'js/constants/regexes'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, modelAttributes, regexes) {
	
	controller.controller('AdminOfferController', ['$scope', 'Single', 'Pageable',
		function($scope, Single, Pageable) {
			$scope.init = function(i) {
				$scope.offer = Pageable.getPageItem(i);
				if(typeof($scope.offer) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offer.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offer');
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
				}
			};
		}
	]);
	controller.controller('AdminOffeeController', ['$scope', 'Single', 'Pageable', 'Alerts', 'pyaBacker',
		function($scope, Single, Pageable, Alerts, pyaBacker) {
			$scope.init = function(i) {
				$scope.offee = Pageable.getPageItem(i);
				if(typeof($scope.offee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offee');
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
			
					$scope.withdraw = function($event) {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:offer.withdrawError'));
							});
						};
						var targetName = $scope.offee.target.username;
						if(typeof(username) !== 'undefined') {
							pyaBacker.withdrawOffee(success, error, error, username, targetName);
						}
					};
				}
			};
		}
	]);
	controller.controller('AdminOffeeEmailController', ['$scope', 'Single', 'Pageable', 'Alerts', 'pyaBacker',
		function($scope, Single, Pageable, Alerts, pyaBacker) {
			$scope.init = function(i) {
				$scope.offee = Pageable.getPageItem(i);
				if(typeof($scope.offee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offeeEmail');
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
			
					$scope.withdraw = function($event) {
						var success = function(code, dto, page) {
							$scope.disabled = true;
						};
						var error = function() {
							i18n(function(t) {
								Alerts.warning(t('alerts:offer.withdrawError'));
							});
						};
						var email = $scope.offee.target.username;
						if(typeof(username) !== 'undefined') {
							pyaBacker.withdrawEmailOffee(success, error, error, username, email);
						}
					};
				}
			};
		}
	]);
});