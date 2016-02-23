define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/roles', 'js/constants/events', 'js/constants/states',
        'js/constants/values', 'js/constants/path-variables'],
		function(controller, $, ng, i18n, validation, utils, viewUrls, responseCodes, roles, events, states, values, pathVars) {
	controller.controller('CommentActionsController', ['$rootScope', '$scope', '$state', '$modal', 'Authentication', 'Single', 'Alerts',
			'Options', 'CurrentUser', 'Title', 'Payment', 'CacheDelay', 'Social', 'ModalInterface', 'AutoRefresh', 'pyFinance', 'pyComment', 'pyUser',
		function($rootScope, $scope, $state, $modal, Authentication, Single, Alerts, Options, CurrentUser, Title,
				Payment, CacheDelay, Social, ModalInterface, AutoRefresh, pyFinance, pyComment, pyUser) {
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			$scope.loadedEnable = true;
			$scope.optionalOpen = false;

			$scope.hasAccepted = false;
			
			var currentUsername;
			var canAppreciate = function() {
				return ng.isDefined(pscope.comment) && ng.isDefined(currentUsername) &&
							ng.isDefined(pscope.comment.author) &&
							ng.isDefined(pscope.comment.author.username) &&
							currentUsername !== pscope.comment.author.username &&
							pscope.comment.canAppreciate;
			};
			
			var checkRoles = function() {
				CurrentUser.hasOverrideRole(roles.overrideRoles.UNACCEPTED, function(result) {
					if(result) {
						$scope.hasAccepted = false;
					} else {
						$scope.hasAccepted = true;
					}
				});
			};
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						$scope.loadedCurrentUser = true;
						$scope.currentUser = currentUser;
						$scope.currentUsername = currentUser.username.username;
						currentUsername = $scope.currentUsername;
					}, function() {
						$scope.loadedCurrentUser = undefined;
					});
					checkRoles();
					
				} else {
					$scope.loadedCurrentUser = undefined;
					$scope.currentUser = undefined;
					$scope.currentUsername = undefined;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			$scope.openShare = function() {
				if(typeof(pscope.comment) !== 'undefined' && typeof(pscope.comment.tally) !== 'undefined' &&
						typeof(pscope.comment.author) !== 'undefined') {
					i18n(function(t) {
						var params = {};
						params[pathVars.COMMENT] = pscope.commentId;
						Social.open(t('shared:socialOptions.comment.title', {author: pscope.comment.author.username}),
								t('shared:socialOptions.comment.description', {value: pscope.comment.tally.appreciation, author: pscope.comment.author.username, created: utils.getCalendarDate(pscope.comment.created)}),
								$state.href(states.COMMENTS_ID, params, {absolute: true}));
					});
				}
			};
			
			/*
			var commentId, commentWarning;
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.comment = Single.getSingleMain(s);
					$scope.commentId = $scope.comment.id;
					commentId = $scope.comment.id;
					commentWarning = $scope.comment.warning;
					$scope.username = $scope.comment.author.username;
					author = $scope.username;
					$scope.enabled = !$scope.comment.disabled;
				}
			};*/
			
			var promotionData = {loading: false, open: false};
			$scope.promotionData = promotionData;
			var PromotionModalCtrl = function($scope, $modalInstance) {
				$scope.promotionData = promotionData;
				promotionData.errors = {};
				promotionData.promotion = undefined;
				promotionData.warning = pscope.comment.warning || false;
				promotionData.alert = undefined;
				promotionData.showPurchaseLink = false;
				$scope.optionalCollapsed = true;
				
				var getPromotionSuccess = function(amount) {
					return function(code, dto, page) {
						promotionData.loading = false;
						$rootScope.$broadcast(events.BALANCE_CHANGE);
						$modalInstance.close(true);
						i18n(function(t) {
							Alerts.info(t('alerts:promotion.success'));
						});
						if(ng.isDefined(pscope.comment.tally) && amount > 0) {
							pscope.comment.tally.promotion += amount;
							pscope.comment.tally.value += amount;
						}
						/*
						CacheDelay.comment(function() {
							Single.refresh();
						}, true);
						*/
					};
				};

				var promotionError = function(code, dto) {
					i18n(function(t) {
						promotionData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['promotion','tags','warning'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									promotionData.errors[field] = t(code, validation.getArguments(error));
								} else {
									promotionData.errors[field] = undefined;
								}
							});
						} else if(code === responseCodes.BALANCE) {
							promotionData.alert = t('validation:balance');
							promotionData.showPurchaseLink = true;
						} else if(code === responseCodes.NOT_ALLOWED) {
							promotionData.alert = t('alerts:comment.promote.notAllowed');
						} else {
							promotionData.alert = t('alerts:promotion.error');
						}
					});
				};
				
				var promotionApiError = function() {
					i18n(function(t) {
						promotionData.loading = false;
						promotionData.alert = t('alerts:promotion.error');
					});
				};
				
				$scope.openPurchase = function() {
					$rootScope.$broadcast(events.PURCHASE_MODAL_OPEN);
				};
				
				$scope.submit = function() {
					promotionData.alert = undefined;
					promotionData.errors = {};
					promotionData.loading = true;
					promotionData.showPurchaseLink = false;
					pyFinance.promoteComment(getPromotionSuccess(promotionData.promotion), promotionError, promotionApiError,
							pscope.commentId, promotionData.promotion, promotionData.warning);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
				
			};

			$scope.openPromotion = function() {
				var m = $modal.open({
					templateUrl: 'commentPromotionModal',
					controller: ModalInterface.controller(PromotionModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						promotionData.open = false;
					}, function() {
						promotionData.open = false;
				});
				m.opened.then(function() {
						promotionData.open = true;
					}, function() {
						promotionData.open = false;
				});
			};
			
			var appreciationData = {loading: false, open: false};
			$scope.appreciationData = appreciationData;
			var AppreciationModalCtrl = function($scope, $modalInstance) {
				$scope.appreciationData = appreciationData;
				appreciationData.errors = {};
				appreciationData.appreciation = undefined;
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
				
				AutoRefresh.manageRefresh(function() {
					$scope.sinceAction++;
				}, 1, undefined, false, false, $scope);
				
				
				var dataChanged = function(onAlt) {
					return function(code, dto) {
						$scope.result = dto;
						$scope.amount = '0.00';
						$scope.fee = '0.00';
						$scope.tax = '0.00';
						$scope.author = '0.00';
						$scope.total = '0.00';
						if(typeof(dto) !== 'undefined') {
							if(typeof(dto.amount) !== 'undefined') {
								$scope.amount = dto.amount.toFixed(values.CURRENCY_PRECISION);
							}
							if(typeof(dto.fee) !== 'undefined') {
								$scope.fee = dto.fee.toFixed(values.CURRENCY_PRECISION);
							}
							if(typeof(dto.tax) !== 'undefined') {
								$scope.tax = dto.tax.toFixed(values.CURRENCY_PRECISION);
							}
							if(typeof(dto.author) !== 'undefined') {
								$scope.author = dto.author.toFixed(values.CURRENCY_PRECISION);
							}
							if(typeof(dto.total) !== 'undefined') {
								$scope.total = dto.total.toFixed(values.CURRENCY_PRECISION);
							}
						}
						appreciationData.onAlt = onAlt;
						if(onAlt) {
							if(appreciationData.appreciation === dto.amount) {
								appreciationData.onAlt = undefined;
							}
							appreciationData.appreciation = dto.amount;
						} else {
							if(appreciationData.appreciationAlt === dto.author) {
								appreciationData.onAlt = undefined;
							}
							appreciationData.appreciationAlt = dto.author;
						}
					};
				};
				
				$scope.$watch('appreciationData.appreciation', function(newValue, oldValue) {
					if(typeof(appreciationData.onAlt) !== 'undefined') {
						if(appreciationData.onAlt) {
							appreciationData.onAlt = undefined;
						}
						return;
					}
					if(newValue !== oldValue) {
						$scope.sinceAction = 0 - values.CURRENCY_TOTAL_CALCULATION_TIME;
						pyFinance.calculateAppreciationTotals(dataChanged(true), function(){}, function(){}, appreciationData.appreciation);
					}
				});
				
				$scope.$watch('appreciationData.appreciationAlt', function(newValue, oldValue) {
					if(typeof(appreciationData.onAlt) !== 'undefined') {
						if(!appreciationData.onAlt) {
							appreciationData.onAlt = undefined;
						}
						return;
					}
					if(newValue !== oldValue) {
						$scope.sinceAction = 0 - values.CURRENCY_TOTAL_CALCULATION_TIME;
						pyFinance.calculateAppreciationTotalsFromAppreciation(dataChanged(true), function(){}, function(){}, appreciationData.appreciationAlt);
					}
				});

				var getAppreciationSuccess = function(amount) {
					return function(code, dto, page) {
						appreciationData.loading = false;
						$modalInstance.close(true);
						Payment.payment(dto.result, true, pscope.single, pscope.comment.author.username, amount);
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
						pyFinance.appreciateComment(getAppreciationSuccess(appreciationData.appreciation), appreciationError, appreciationApiError,
								pscope.commentId, appreciationData.appreciation, appreciationData.warning);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openAppreciation = function() {
				if($scope.hasAccepted) {
					var m = $modal.open({
						templateUrl: 'commentAppreciationModal',
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
				} else {
					var link;
					if(!$scope.hasAccepted) {
						link = $state.href(states.TERMS);
						CurrentUser.alertOverrideRole(roles.overrideRoles.UNACCEPTED, link);
					}
					CurrentUser.refreshRoles();
					checkRoles();
				}
			};
			
			var flagData = {loading: false, open: false};
			$scope.flagData = flagData;
			var FlagModalCtrl = function($scope, $modalInstance) {
				$scope.flagData = flagData;
				var success = function(code, dto, page) {
					flagData.loading = false;
					i18n(function(t) {
						Alerts.info(t('alerts:flagged.commentSuccess'));
					});
				};
				
				var error = function() {
					i18n(function(t) {
						flagData.loading = false;
						Alerts.warning(t('alerts:flagged.commentError'));
					});
				};
				
				$scope.submit = function(reason) {
					if(typeof(commentId) !== 'undefined') {
						flagData.loading = true;
						pyComment.flag(success, error, error, pscope.commentId, reason);
					}
					$modalInstance.close(true);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openFlag = function() {
				var m = $modal.open({
					templateUrl: 'commentFlagModal',
					controller: ModalInterface.controller(FlagModalCtrl),
					backdrop: false
				});

				m.result.then(function() {
						flagData.open = false;
					}, function() {
						flagData.open = false;
				});
				m.opened.then(function() {
						flagData.open = true;
					}, function() {
						flagData.open = false;
				});
			};
			
			var enableSuccess = function(code, dto, page) {
				// let it refresh instead
				pscope.comment.disabled = false;
				$scope.loadedEnable = true;
				/*
				CacheDelay.comment(function() {
					Single.refresh();
				}, true);
				*/
			};
			
			var disableSuccess = function(code, dto, page) {
				// let it refresh instead
				pscope.comment.disabled = true;
				$scope.loadedEnable = true;
				/*
				CacheDelay.comment(function() {
					Single.refresh();
				}, true);
				*/
			};
			
			var enableError = function(str) {
				return function() {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.loadedEnable = true;
					});
				};
			};
			
			$scope.onEnable = function() {
				$scope.loadedEnable = false;
				pyComment.enable(enableSuccess, enableError('alerts:comment.enable.error'), enableError('alerts:apiError'), pscope.commentId);
			};
			
			$scope.onDisable = function() {
				$scope.loadedEnable = false;
				pyComment.disable(disableSuccess, enableError('alerts:comment.disable.error'), enableError('alerts:apiError'), pscope.commentId);
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
			
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
			*/
		}
	]);
});