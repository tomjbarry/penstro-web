define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/util/validation-errors', 'js/constants/scope-variables',
        'js/constants/response-codes', 'js/constants/events'],
		function(controller, $, ng, utils, i18n, validation, scopeVars, responseCodes, events) {
	controller.controller('AdminPostingActionsController', ['$rootScope', '$scope', '$modal', '$parse', 'Alerts',
			'ModalInterface', 'Payment', 'pyaFinance', 'pyaPosting',
		function($rootScope, $scope, $modal, $parse, Alerts, ModalInterface, Payment, pyaFinance, pyaPosting) {
			$scope.status = {enable: true, remove: true, warning: true, flag: true};
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;

			var canAppreciate = function() {
				return ng.isDefined(pscope.posting) &&
							ng.isDefined(pscope.posting.author) &&
							ng.isDefined(pscope.posting.author.username) &&
							pscope.posting.canAppreciate;
			};
			
			var tallyData = {loading: false, open: false};
			var scope = $scope;
			var UpdateTallyModalCtrl = function($scope, $modalInstance) {
				$scope.tallyData = tallyData;
				$scope.scope = scope;
				tallyData.errors = {};
				tallyData.alert = undefined;
				tallyData.appreciation = 0;
				tallyData.promotion = 0;
				tallyData.cost = 0;
				$scope.optionalCollapsed = true;
				
				var success = function(code, dto, page) {
					tallyData.loading = false;
					$modalInstance.close(true);
					if(ng.isDefined(pscope.posting) && ng.isDefined(pscope.posting.tally)) {
						pscope.posting.tally.appreciation += tallyData.appreciation;
						pscope.posting.tally.cost += tallyData.cost;
						pscope.posting.tally.promotion += tallyData.promotion;
						pscope.posting.tally.value += tallyData.cost + tallyData.promotion;
					}
				};
				var error = function(code, dto) {
					i18n(function(t) {
						tallyData.loading = false;
						tallyData.alert = t('alerts:modPosting.updateTally');
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						tallyData.loading = false;
						tallyData.alert = t('alerts:apiError');
					});
				};
				
				$scope.submit = function() {
					tallyData.alert = undefined;
					tallyData.errors = {};
					tallyData.loading = true;
					pyaPosting.updateTally(success, error, apiError,
							pscope.postingId, tallyData.appreciation, tallyData.promotion, tallyData.cost);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
				
			};

			$scope.openUpdateTally = function() {
				var m = $modal.open({
					templateUrl: 'updateTallyModal',
					controller: ModalInterface.controller(UpdateTallyModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						tallyData.open = false;
					}, function() {
						tallyData.open = false;
				});
				m.opened.then(function() {
						tallyData.open = true;
					}, function() {
						tallyData.open = false;
				});
			};
			
			var getChangeSuccess = function(scopeStr, s, v) {
				return function(code, dto, page) {
					$scope.status[scopeStr] = true;
					pscope.posting[s] = v;
				};
			};
			
			var getChangeError = function(scopeStr, str) {
				return function(code, dto, page) {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.status[scopeStr] = true;
					});
				};
			};
			var appreciationData = {loading: false, open: false};
			$scope.appreciationData = appreciationData;
			var AppreciationModalCtrl = function($scope, $modalInstance) {
				$scope.appreciationData = appreciationData;
				appreciationData.errors = {};
				appreciationData.appreciation = undefined;
				appreciationData.target = '';
				appreciationData.appreciationAlt = undefined;
				appreciationData.warning = pscope.posting.warning || false;
				appreciationData.tags = undefined;
				appreciationData.alert = undefined;
				appreciationData.onAlt = undefined;
				$scope.optionalCollapsed = true;
				$scope.sinceAction = 0;
				$scope.amount = '0.00';
				$scope.fee = '0.00';
				$scope.tax = '0.00';
				$scope.author = '0.00';
				$scope.total = '0.00';
				$scope.result = {amount: 0, tax: 0, total: 0};
			
				var getAppreciationSuccess = function(amount, target) {
					return function(code, dto, page) {
						appreciationData.loading = false;
						$modalInstance.close(true);
						Payment.payment(dto.result, true, pscope.single, pscope.posting.author.username, amount, target);
					};
				};
				
				var appreciationError = function(code, dto) {
					i18n(function(t) {
						appreciationData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['appreciation','tags','warning'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									appreciationData.errors[field] = t(code, validation.getArguments(error));
								} else {
									appreciationData.errors[field] = undefined;
								}
							});
						} else if(code === responseCodes.NOT_ALLOWED) {
							appreciationData.alert = t('alerts:posting.appreciate.notAllowed');
						} else if(code === responseCodes.PAYMENT_TARGET) {
							Alerts.warning(t('alerts:posting.appreciate.paymentTarget'));
							$modalInstance.dismiss('cancel');
							//appreciationData.alert = t('alerts:posting.appreciate.paymentTarget');
						} else if(code === responseCodes.NOT_FOUND) {
							appreciationData.errors.target = t('validation:notFound.username');
						} else {
							appreciationData.alert = t('alerts:appreciation.error');
						}
					});
				};
				
				var appreciationApiError = function() {
					i18n(function(t) {
						appreciationData.loading = false;
						appreciationData.alert = t('alerts:appreciation.error');
					});
				};
				
				$scope.submit = function() {
					if(canAppreciate()) {
						appreciationData.errors = {};
						appreciationData.alert = undefined;
						appreciationData.loading = true;
						var parsedTags = utils.parseTags(appreciationData.tags);
						pyaFinance.appreciatePosting(getAppreciationSuccess(appreciationData.appreciation, appreciationData.target), appreciationError, appreciationApiError,
								pscope.postingId, appreciationData.target, appreciationData.appreciation, parsedTags, appreciationData.warning);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openAppreciation = function() {
				var m = $modal.open({
					templateUrl: 'adminPostingAppreciationModal',
					controller: ModalInterface.controller(AppreciationModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						appreciationData.open = false;
					}, function() {
						appreciationData.open = false;
				});
				m.opened.then(function() {
						appreciationData.open = true;
					}, function() {
						appreciationData.open = false;
				});
			};
			
			$scope.onEnable = function() {
				$scope.status.enable = false;
				pyaPosting.enable(getChangeSuccess('enable', 'disabled', false), getChangeError('enable', 'alerts:modPosting.enable'), getChangeError('enable', 'alerts:apiError'), pscope.posting.author.username, pscope.postingId);
			};
			
			$scope.onDisable = function() {
				$scope.status.enable = false;
				pyaPosting.disable(getChangeSuccess('enable', 'disabled', true), getChangeError('enable', 'alerts:modPosting.enable'), getChangeError('enable', 'alerts:apiError'), pscope.posting.author.username, pscope.postingId);
			};
			
			$scope.onRemove = function() {
				$scope.status.remove = false;
				pyaPosting.remove(getChangeSuccess('remove', 'removed', true), getChangeError('remove', 'alerts:modPosting.remove'), getChangeError('remove', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.onUnremove = function() {
				$scope.status.remove = false;
				pyaPosting.unremove(getChangeSuccess('remove', 'removed', false), getChangeError('remove', 'alerts:modPosting.remove'), getChangeError('remove', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.onWarning = function() {
				$scope.status.warning = false;
				pyaPosting.warning(getChangeSuccess('warning', 'warning', true), getChangeError('warning', 'alerts:modPosting.warning'), getChangeError('warning', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.onUnwarning = function() {
				$scope.status.warning = false;
				pyaPosting.unwarning(getChangeSuccess('warning', 'warning', false), getChangeError('warning', 'alerts:modPosting.warning'), getChangeError('warning', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.onFlag = function() {
				$scope.status.flag = false;
				pyaPosting.flag(getChangeSuccess('flag', 'flagged', true), getChangeError('flag', 'alerts:modPosting.flag'), getChangeError('flag', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.onUnflag = function() {
				$scope.status.flag = false;
				pyaPosting.unflag(getChangeSuccess('flag', 'flagged', false), getChangeError('flag', 'alerts:modPosting.flag'), getChangeError('flag', 'alerts:apiError'), pscope.postingId);
			};
			
			$scope.$on(events.APPRECIATION_SUCCESS, function(event, single, amount) {
				if(!event.defaultPrevented && ng.isDefined(single)) {
					var posting = single.getSingleMain();
					if(ng.isDefined(posting) && posting.id === pscope.postingId && ng.isDefined(pscope.posting.tally)) {
						event.preventDefault();
						var float = parseFloat(amount);
						if(float !== float) {
							// NaN check
							return;
						}
						var a = Math.floor(float);
						pscope.posting.tally.appreciation += a;
					}
				}
			});
		}
	]);
});