define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/roles', 'js/constants/events', 'js/constants/path-variables', 'js/constants/states'],
		function(controller, $, ng, i18n, validation, utils, viewUrls, responseCodes, roles, events, pathVars, states) {
	controller.controller('CurrentActionsController', ['$rootScope', '$scope', '$state', '$modal', 'Authentication', 'ModalInterface', 'Social', 'Title',
		function($rootScope, $scope, $state, $modal, Authentication, ModalInterface, Social, Title) {
			//pyOffer service removed temporarily. add this back in when reenabling
			$scope.optionalOpen = false;
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			$scope.openShare = function() {
				if(typeof($scope.current) !== 'undefined') {
					i18n(function(t) {
						var p = {};
						p[pathVars.USER] = pscope.username;
						Social.open(Title.title, t('shared:socialOptions.user.description', {value: pscope.current.appreciation, postingsCount: pscope.current.contributedPostings}),
								$state.href(states.USERS_ID, p, {absolute: true}));
					});
				}
			};

			//pyOffer service removed temporarily. add this back in when reenabling
			/*
			var offerData = {loading: false, open: false};
			$scope.offerData = offerData;
			var OfferModalCtrl = function($scope, $modalInstance) {
				$scope.offerData = offerData;
				offerData.errors = {};
				offerData.username = undefined;
				offerData.amount = undefined;
				offerData.alert = undefined;
				
				var error = function(code, dto) {
					i18n(function(t) {
						offerData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['username','amount'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									offerData.errors[field] = t(code, validation.getArguments(error));
								} else {
									offerData.errors[field] = undefined;
								}
							});
						} else if(code === responseCodes.BALANCE) {
							offerData.errors.amount = t('validation.balance');
						} else if(code === responseCodes.NOT_FOUND) {
							offerData.errors.username = t('validation:notFound.username');
						} else {
							offerData.alert = t('alerts:offer.createError');
						}
					});
				};
				
				var success = function(code, dto, page) {
					offerData.loading = false;
					$rootScope.$broadcast(events.BALANCE_CHANGE);
					$modalInstance.close(true);
				};
				
				
				var apiError = function() {
					i18n(function(t) {
						offerData.loading = false;
						offerData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					offerData.loading = true;
					offerData.errors = {};
					offerData.alert = undefined;
					pyOffer.offer(success, error, apiError, offerData.username, offerData.amount);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openOffer = function() {
				var m = $modal.open({
					templateUrl: 'offerModal',
					controller: ModalInterface.controller(OfferModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						offerData.open = false;
					}, function() {
						offerData.open = false;
				});
				m.opened.then(function() {
						offerData.open = true;
					}, function() {
						offerData.open = false;
				});
			};

			var emailOfferData = {loading: false, open: false};
			$scope.emailOfferData = emailOfferData;
			var EmailOfferModalCtrl = function($scope, $modalInstance) {
				$scope.emailOfferData = emailOfferData;
				emailOfferData.errors = {};
				emailOfferData.email = undefined;
				emailOfferData.amount = undefined;
				emailOfferData.alert = undefined;
				
				var error = function(code, dto) {
					i18n(function(t) {
						emailOfferData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['email','amount'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									emailOfferData.errors[field] = t(code, validation.getArguments(error));
								} else {
									emailOfferData.errors[field] = undefined;
								}
							});
						} else if(code === responseCodes.BALANCE) {
							emailOfferData.errors.amount = t('validation.balance');
						} else if(code === responseCodes.NOT_FOUND) {
							emailOfferData.errors.email = t('validation:notFound.email');
						} else {
							emailOfferData.alert = t('alerts:offer.createError');
						}
					});
				};
				
				var success = function(code, dto, page) {
					emailOfferData.loading = false;
					$rootScope.$broadcast(events.BALANCE_CHANGE);
					$modalInstance.close(true);
				};
				
				
				var apiError = function() {
					i18n(function(t) {
						emailOfferData.loading = false;
						emailOfferData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					emailOfferData.loading = true;
					emailOfferData.errors = {};
					emailOfferData.alert = undefined;
					pyOffer.emailOffer(success, error, apiError, emailOfferData.email, emailOfferData.amount);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openEmailOffer = function() {
				var m = $modal.open({
					templateUrl: 'emailOfferModal',
					controller: ModalInterface.controller(EmailOfferModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						emailOfferData.open = false;
					}, function() {
						emailOfferData.open = false;
				});
				m.opened.then(function() {
						emailOfferData.open = true;
					}, function() {
						emailOfferData.open = false;
				});
			};
			*/
			
		}
	]);
});