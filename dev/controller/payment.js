define(['./module', 'jquery', 'angular', 'payment', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/response-codes', 'js/constants/view-urls', 'js/constants/params', 'js/constants/roles',
				'js/constants/events', 'js/constants/values', 'js/constants/states'],
		function(controller, $, ng, payment, i18n, validation, utils, responseCodes, viewUrls, params, roles, events, values, states) {
	controller.controller('PaymentController', ['$rootScope', '$scope', '$window', '$modal', 'Loaded',
																							'Authentication', 'Alerts', 'Payment', 'Single', 'AutoRefresh', 'ModalInterface', 'pyFinance',
		function($rootScope, $scope, $window, $modal, Loaded, Authentication, Alerts, Payment, Single, AutoRefresh, ModalInterface, pyFinance) {

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});

			$scope.paymentUrl = undefined;
			$scope.paykey = undefined;
			$scope.appreciation = false;
			var paymentList = [];
			var end = function() {
				$scope.paymentUrl = undefined;
				$scope.paykey = undefined;
			};
			$rootScope.$on(events.PAYMENT_END, function(event) {
				end();
			});
			
			$rootScope.$on(events.PAYMENT, function(event, paymentUrl, paykey, isSingle, single, username, amount, altId) {
				$scope.isSingle = isSingle;
				
				
				if(!ng.isDefined(paymentUrl) || paymentUrl === '' || !ng.isDefined(paykey) || paykey === '') {
					end();
				} else {
					
					var expType = 'mini';
					var query = {
							paykey: paykey
					};
					query.expType = expType;
					var scopePaymentUrl = utils.constructPath(paymentUrl, undefined, query);

					var paymentData = {paymentUrl: scopePaymentUrl};
					var PaymentModalCtrl = function($scope, $modalInstance) {
						$scope.paymentData = paymentData;
						$scope.pay = function() {
							Payment.paymentStarted(paykey, isSingle, single, username, amount, altId);
							$modalInstance.close(true);
						};
						$scope.cancel = function() {
							$modalInstance.dismiss('cancel');
						};
					};
					
					var m = $modal.open({
						templateUrl: 'paymentModal',
						controller: ModalInterface.controller(PaymentModalCtrl),
						backdrop: false
					});
			
					var getReturned = function(p, i, s, u, a, aI) {
						// cant know for sure which was returned, so just mark all unmarked payments as finished
						paymentList.push({paykey: p, isSingle: i, single: single, username: u, amount: a, altId: aI});
						return function() {
							if(typeof(dgFlowMini) !== 'undefined' && typeof(dgFlowMini.closeFlow) !== 'undefined') {
								dgFlowMini.closeFlow();
							}
							var tempPayment;
							if(typeof(paymentList) === 'undefined') {
								Payment.paymentFinished(p, i, s, u, a, aI);
							} else {
								for(var j = 0; j < paymentList.length; j++) {
									tempPayment = paymentList[j];
									Payment.paymentFinished(tempPayment.paykey, tempPayment.isSingle, tempPayment.single, tempPayment.username, tempPayment.amount, tempPayment.altId);
								}
							}
							paymentList = [];
							end();
						};
					};
					
					var eventOff = $rootScope.$on(events.PAYMENT_MODAL_OPEN, function(event, element) {
						dgFlowMini = new PAYPAL.apps.DGFlowMini({trigger: element, expType: expType, callbackFunction: getReturned(paykey, isSingle, single, username, amount, altId)});
						//dgFlow = new PAYPAL.apps.DGFlow({trigger: element, expType: expType, callbackFunction: returned});
						//$('#paypalRedirect').click();
						eventOff();
					});
				}
			});
			
		}
	]);
});