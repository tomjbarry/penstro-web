define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/events',
        'js/constants/roles', 'js/constants/values', 'js/constants/states'],
		function(controller, $, ng, i18n, validation, utils, responseCodes, pathVars, viewUrls, events, roles, values, states) {
	controller.controller('MainController', ['$modal', '$rootScope', '$scope', '$state', 'Loaded', 'Title', 'Alerts', 'Authentication', 'AutoRefresh',
																					'CurrentUser', 'Payment', 'ModalInterface', 'pyFinance',
		function($modal, $rootScope, $scope, $state, Loaded, Title, Alerts, Authentication, AutoRefresh, CurrentUser, Payment, ModalInterface, pyFinance) {
			$scope.loaded = Loaded;
			$scope.title = Title;
			$scope.show = false;
			
			$scope.navbar = {
				navigationCollapsed: true,
				actionCollapsed: true,
				subnavNavigationCollapsed: true,
				subnavActionCollapsed: true
			};
			$scope.navbar.dismissAll = function() {
				// dont use dismiss, want to avoid side effects as one of these wont be dismissed usually
				$scope.navbar.navigationCollapsed = true;
				$scope.navbar.actionCollapsed = true;
				$scope.navbar.subnavNavigationCollapsed = true;
				$scope.navbar.subnavActionCollapsed = true;
			};
			$scope.navbar.toggleNavigation = function() {
				var collapsed = !$scope.navbar.navigationCollapsed;
				$scope.navbar.dismissAll();
				$scope.navbar.navigationCollapsed = collapsed;
			};
			$scope.navbar.toggleAction = function() {
				var collapsed = !$scope.navbar.actionCollapsed;
				$scope.navbar.dismissAll();
				$scope.navbar.actionCollapsed = collapsed;
			};
			$scope.navbar.dismissNavigation = function() {
				$scope.navbar.navigationCollapsed = true;
			};
			$scope.navbar.dismissAction = function() {
				$scope.navbar.actionCollapsed = true;
			};
			$scope.navbar.subnavToggleNavigation = function() {
				var collapsed = !$scope.navbar.subnavNavigationCollapsed;
				$scope.navbar.dismissAll();
				$scope.navbar.subnavNavigationCollapsed = collapsed;
			};
			$scope.navbar.subnavToggleAction = function() {
				var collapsed = !$scope.navbar.subnavActionCollapsed;
				$scope.navbar.dismissAll();
				$scope.navbar.subnavActionCollapsed = collapsed;
			};
			$scope.navbar.subnavDismissNavigation = function() {
				$scope.navbar.subnavNavigationCollapsed = true;
			};
			$scope.navbar.subnavDismissAction = function() {
				$scope.navbar.subnavActionCollapsed = true;
			};
			
			$rootScope.$on('$stateChangeStart', function(event) {
				$scope.navbar.dismissAll();
			});
			
			var purchaseData = {loading: false, open: false, hasAccepted: false};
			$scope.purchaseData = purchaseData;
			
			var currentSuccess = function(currentUser) {
				$scope.currentUser = currentUser;
				$scope.notificationCount = undefined;
				$scope.messageCount = undefined;
				$scope.feedCount = undefined;
				
				i18n(function(t) {
					$scope.show = true;
					
					if(currentUser.notificationCount > 0) {
						$scope.notificationCount = currentUser.notificationCount;
					}
					if(currentUser.messageCount > 0) {
						$scope.messageCount = currentUser.messageCount;
					}
					if(currentUser.feedCount > 0) {
						$scope.feedCount = currentUser.feedCount;
					}
				});
			};
			
			var currentError = function() {
				$scope.show = false;
			};
			
			var balanceSuccess = function(code, dto, page) {
				$scope.loadedBalance = true;
				i18n(function(t) {
					$scope.balance = dto.balance;
				});
			};
			
			var balanceError = function() {
				if($scope.authenticated) {
					$scope.loadedBalance = Loaded.FAILED;
					i18n(function(t) {
						Alerts.warning(t('alerts:user.balanceError'));
					});
				}
			};
			
			var getBalance = function(error) {
				pyFinance.balance(balanceSuccess, error, error);
			};
			
			var checkRoles = function() {
				CurrentUser.hasOverrideRole(roles.overrideRoles.UNACCEPTED, function(result) {
					if(result) {
						purchaseData.hasAccepted = false;
					} else {
						purchaseData.hasAccepted = true;
					}
				});
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.getFresh(currentSuccess, currentError);
					CurrentUser.refreshRoles();
					checkRoles();
					getBalance(balanceError);
				} else {
					$scope.show = true;
					purchaseData.hasAccepted = false;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			$rootScope.$on(events.PRE_LOGIN_CHANGE, function(event, authenticated) {
				$scope.show = false;
			});
			
			var refresh = function() {
				// do nothing if it fails
				if(Authentication.isAuthenticated()) {
					CurrentUser.getFresh(currentSuccess, function() {});
					getBalance(function() {});
				}
			};
			AutoRefresh.manageRefresh(refresh, values.USER_OPTIONS_REFRESH, undefined, true);
			/*
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				authentication(authenticated);
			});
			*/
			$rootScope.$on(events.BALANCE_CHANGE, function(event) {
				if($scope.authenticated) {
					getBalance(function() {});
				}
			});
			
			var PurchaseModalCtrl = function($scope, $modalInstance) {
				$scope.purchaseData = purchaseData;
				purchaseData.amount = undefined;
				purchaseData.errors = {};
				purchaseData.loading = false;
				purchaseData.alert = undefined;
				$scope.sinceAction = 0;
				$scope.amount = '0.00';
				$scope.tax = '0.00';
				$scope.total = '0.00';
				$scope.result = {amount: 0, tax: 0, total: 0};
				
				AutoRefresh.manageRefresh(function() {
					$scope.sinceAction++;
				}, 1, events.destroy('PurchaseModalCtrl'), false, false);
				
				$scope.$on('$destroy', function(event) {
					$rootScope.$broadcast(events.destroy('PurchaseModalCtrl'));
				});
				
				$scope.$watch('purchaseData.amount', function(newValue, oldValue) {
					if(newValue !== oldValue) {
						$scope.sinceAction = 0 - values.CURRENCY_TOTAL_CALCULATION_TIME;
						pyFinance.calculatePurchaseTotals(function(code, dto) {
							$scope.result = dto;
							$scope.amount = '0.00';
							$scope.tax = '0.00';
							$scope.total = '0.00';
							if(typeof(dto) !== 'undefined') {
								if(typeof(dto.amount) !== 'undefined') {
									$scope.amount = dto.amount.toFixed(values.CURRENCY_PRECISION);
								}
								if(typeof(dto.tax) !== 'undefined') {
									$scope.tax = dto.tax.toFixed(values.CURRENCY_PRECISION);
								}
								if(typeof(dto.total) !== 'undefined') {
									$scope.total = dto.total.toFixed(values.CURRENCY_PRECISION);
								}
							}
						}, function(){}, function(){}, purchaseData.amount);
					}
				});
				
				var error = function(code, dto) {
					i18n(function(t) {
						purchaseData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['amount'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									purchaseData.errors[field] = t(code, validation.getArguments(error));
								} else {
									purchaseData.errors[field] = undefined;
								}
							});
						} else {
							purchaseData.alert = t('alerts:purchaseCurrency.error');
						}
					});
				};
				
				var success = function(code, dto, page) {
					purchaseData.loading = false;
					$modalInstance.close(true);
					Payment.payment(dto.result, false);
				};
				
				var apiError = function() {
					i18n(function(t) {
						purchaseData.loading = false;
						purchaseData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					if(purchaseData.hasAccepted) {
						purchaseData.errors = {};
						purchaseData.alert = undefined;
						purchaseData.loading = true;
						pyFinance.purchaseCurrency(success, error, apiError, purchaseData.amount);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};
			
			var openPurchase = function() {
				if(purchaseData.hasAccepted) {
					var p = $modal.open({
						templateUrl: 'purchaseModal',
						controller: ModalInterface.controller(PurchaseModalCtrl),
						backdrop: false
					});
					p.result.then(function() {
							purchaseData.open = false;
						}, function() {
							purchaseData.open = false;
					});
					p.opened.then(function() {
							purchaseData.open = true;
						}, function() {
							purchaseData.open = false;
					});
				} else {
					var link;
					if(!purchaseData.hasAccepted) {
						link = $state.href(states.TERMS);
						CurrentUser.alertOverrideRole(roles.overrideRoles.UNACCEPTED, link);
					}
					CurrentUser.refreshRoles();
					checkRoles();
				}
			};
			
			$scope.openPurchase = function($event) {
				openPurchase();
			};
			
			$rootScope.$on(events.PURCHASE_MODAL_OPEN, function(event) {
				openPurchase();
			});
			
			Loaded.account = true;
		}]);
});