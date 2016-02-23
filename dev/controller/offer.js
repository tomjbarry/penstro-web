define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/model-attributes', 'js/constants/regexes'],
		function(controller, $, ng, i18n, utils, pathVars, viewUrls, modelAttributes, regexes) {
	
	controller.controller('OfferController', ['$scope', 'Pageable', 'Alerts', 'CurrentUser', 'pyOffer',
		function($scope, Pageable, Alerts, CurrentUser, pyOffer) {
			$scope.init = function(i) {
				$scope.offer = Pageable.getPageItem(i);
				if(typeof($scope.offer) !== 'undefined') {
					CurrentUser.get(function(current) {
						$scope.self = current.username;
					});
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offer.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offer');
					});
				}
			};
			$scope.accept = function() {
				var username = $scope.offer.source.username;
				var success = function(code, dto, page) {
					$scope.disabled = true;
				};
				var error = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:offer.acceptError'));
					});
				};
				if($scope.offer.email) {
					pyOffer.acceptEmailOffer(success, error, error, username);
				} else {
					pyOffer.acceptOffer(success, error, error, username);
				}
			};
			
			$scope.deny = function() {
				var success = function(code, dto, page) {
					$scope.disabled = true;
				};
				var error = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:offer.denyError'));
					});
				};
				var username = $scope.offer.source.username;
				if($scope.offer.email) {
					pyOffer.denyEmailOffer(success, error, error, username);
				} else {
					pyOffer.denyOffer(success, error, error, username);
				}
			};
		}
	]);
	controller.controller('OffeeController', ['$scope', 'Pageable', 'Alerts', 'pyOffer',
		function($scope, Pageable, Alerts, pyOffer) {
			$scope.init = function(i) {
				$scope.offee = Pageable.getPageItem(i);
				if(typeof($scope.offee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offee');
					});
				}
			};
			
			$scope.withdraw = function($event) {
				var success = function(code, dto, page) {
					$scope.disabled = true;
				};
				var error = function() {
					i18n(function(t) {
						Alerts.warning(t('alerts:offer.withdrawError'));
					});
				};
				var username = $scope.offee.target.username;
				pyOffer.withdrawOffer(success, error, error, username);
			};
		}
	]);
	controller.controller('OffeeEmailController', ['$scope', 'Pageable', 'Alerts', 'pyOffer',
		function($scope, Pageable, Alerts, pyOffer) {
			$scope.init = function(i) {
				$scope.offee = Pageable.getPageItem(i);
				if(typeof($scope.offee) !== 'undefined') {
					
					i18n(function(t) {
						$scope.tally = {
							value: $scope.offee.value
						};
						$scope.tallyLabel = t('shared:tallyTitle.offeeEmail');
					});
				}
			};
			
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
				pyOffer.withdrawEmailOffer(success, error, error, email);
			};
		}
	]);
});