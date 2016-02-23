define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/util/validation-errors', 'js/constants/response-codes', 'js/constants/events'],
		function(controller, $, ng, utils, i18n, validation, responseCodes, events) {
	controller.controller('AdminCommentActionsController', ['$rootScope', '$scope', '$modal', 'Alerts',
			'ModalInterface', 'Payment', 'pyaFinance', 'pyaComment',
		function($rootScope, $scope, $modal, Alerts, ModalInterface, Payment, pyaFinance, pyaComment) {
			$scope.status = {enable: true, remove: true, warning: true, flag: true};
			var pscope = $scope.$parent;
			$scope.pscope = pscope;

			var canAppreciate = function() {
				return ng.isDefined(pscope.comment) &&
							ng.isDefined(pscope.comment.author) &&
							ng.isDefined(pscope.comment.author.username) &&
							pscope.comment.canAppreciate;
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
					if(ng.isDefined(pscope.comment) && ng.isDefined(pscope.comment.tally)) {
						pscope.comment.tally.appreciation += tallyData.appreciation;
						pscope.comment.tally.cost += tallyData.cost;
						pscope.comment.tally.promotion += tallyData.promotion;
						pscope.comment.tally.value += tallyData.cost + tallyData.promotion;
					}
				};
				var error = function(code, dto) {
					i18n(function(t) {
						tallyData.loading = false;
						tallyData.alert = t('alerts:modComment.updateTally');
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
					pyaComment.updateTally(success, error, apiError,
							pscope.commentId, tallyData.appreciation, tallyData.promotion, tallyData.cost);
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
			var appreciationData = {loading: false, open: false};
			$scope.appreciationData = appreciationData;
			var AppreciationModalCtrl = function($scope, $modalInstance) {
				$scope.appreciationData = appreciationData;
				appreciationData.errors = {};
				appreciationData.appreciation = undefined;
				appreciationData.target = '';
				appreciationData.appreciationAlt = undefined;
				appreciationData.warning = pscope.comment.warning || false;
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
						Payment.payment(dto.result, true, pscope.single, pscope.comment.author.username, amount, target);
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
							appreciationData.alert = t('alerts:comment.appreciate.notAllowed');
						} else if(code === responseCodes.PAYMENT_TARGET) {
							Alerts.warning(t('alerts:comment.appreciate.paymentTarget'));
							$modalInstance.dismiss('cancel');
							//appreciationData.alert = t('alerts:comment.appreciate.paymentTarget');
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
						pyaFinance.appreciateComment(getAppreciationSuccess(appreciationData.appreciation, appreciationData.target), appreciationError, appreciationApiError,
								pscope.commentId, appreciationData.target, appreciationData.appreciation, appreciationData.warning);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openAppreciation = function() {
				if($scope.hasAccepted) {
					var m = $modal.open({
						templateUrl: 'adminCommentAppreciationModal',
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
				}
			};
			
			var getChangeSuccess = function(scopeStr, s, v) {
				return function(code, dto, page) {
					$scope.status[scopeStr] = true;
					pscope.comment[s] = v;
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
			
			$scope.onEnable = function() {
				$scope.status.enable = false;
				pyaComment.enable(getChangeSuccess('enable', 'disabled', false), getChangeError('enable', 'alerts:modComment.enable'), getChangeError('enable', 'alerts:apiError'), pscope.comment.author.username, pscope.commentId);
			};
			
			$scope.onDisable = function() {
				$scope.status.enable = false;
				pyaComment.disable(getChangeSuccess('enable', 'disabled', true), getChangeError('enable', 'alerts:modComment.enable'), getChangeError('enable', 'alerts:apiError'), pscope.comment.author.username, pscope.commentId);
			};
			
			$scope.onRemove = function() {
				$scope.status.remove = false;
				pyaComment.remove(getChangeSuccess('remove', 'removed', true), getChangeError('remove', 'alerts:modComment.remove'), getChangeError('remove', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.onUnremove = function() {
				$scope.status.remove = false;
				pyaComment.unremove(getChangeSuccess('remove', 'removed', false), getChangeError('remove', 'alerts:modComment.remove'), getChangeError('remove', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.onWarning = function() {
				$scope.status.warning = false;
				pyaComment.warning(getChangeSuccess('warning', 'warning', true), getChangeError('warning', 'alerts:modComment.warning'), getChangeError('warning', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.onUnwarning = function() {
				$scope.status.warning = false;
				pyaComment.unwarning(getChangeSuccess('warning', 'warning', false), getChangeError('warning', 'alerts:modComment.warning'), getChangeError('warning', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.onFlag = function() {
				$scope.status.flag = false;
				pyaComment.flag(getChangeSuccess('flag', 'flagged', true), getChangeError('flag', 'alerts:modComment.flag'), getChangeError('flag', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.onUnflag = function() {
				$scope.status.flag = false;
				pyaComment.unflag(getChangeSuccess('flag', 'flagged', false), getChangeError('flag', 'alerts:modComment.flag'), getChangeError('flag', 'alerts:apiError'), pscope.commentId);
			};
			
			$scope.$on(events.APPRECIATION_SUCCESS, function(event, single, amount) {
				if(!event.defaultPrevented && ng.isDefined(single)) {
					var comment = single.getSingleMain();
					if(ng.isDefined(comment) && comment.id === pscope.commentId && ng.isDefined(pscope.comment.tally)) {
						event.preventDefault();
						var float = parseFloat(amount);
						if(float !== float) {
							// NaN check
							return;
						}
						var a = Math.floor(float);
						pscope.comment.tally.appreciation += a;
					}
				}
			});
		}
	]);
});