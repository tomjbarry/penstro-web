define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/roles', 'js/constants/events', 'js/constants/states',
        'js/constants/values', 'js/constants/path-variables'],
		function(controller, $, ng, i18n, validation, utils, viewUrls, responseCodes, roles, events, states, values, pathVars) {
	controller.controller('PostingActionsController', ['$rootScope', '$scope', '$state', '$modal', 'Authentication', 'Alerts',
			'Options', 'CurrentUser', 'Title', 'Payment', 'Social', 'ModalInterface', 'AutoRefresh', 'pyFinance', 'pyPosting', 'pyUser',
		function($rootScope, $scope, $state, $modal, Authentication, Alerts, Options, CurrentUser, Title, Payment,
				Social, ModalInterface, AutoRefresh, pyFinance, pyPosting, pyUser) {
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			$scope.loadedEnable = true;
			$scope.optionalOpen = false;

			$scope.hasAccepted = false;
			var currentUsername;
			var canAppreciate = function() {
				return ng.isDefined(pscope.posting) && ng.isDefined(currentUsername) &&
							ng.isDefined(pscope.posting.author) &&
							ng.isDefined(pscope.posting.author.username) &&
							currentUsername !== pscope.posting.author.username &&
							pscope.posting.canAppreciate;
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
					$scope.loadedCurrentUser = false;
					$scope.currentUser = undefined;
					$scope.currentUsername = undefined;
					$scope.hasAccepted = false;
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			$scope.openShare = function() {
				if(ng.isDefined(pscope.posting) && ng.isDefined(pscope.posting.tally) && ng.isDefined(pscope.posting.author)) {
					i18n(function(t) {
						var params = {};
						params[pathVars.POSTING] = pscope.postingId;
						var alt;
						if(ng.isDefined(pscope.posting.title)) {
							params[pathVars.TITLE] = utils.getEncodedTitle(pscope.posting.title);
							alt = $state.href(states.POSTINGS_ID_TITLE, params, {absolute: true});
						}
						Social.open(t('shared:socialOptions.posting.title', {author: pscope.posting.author.username, title: pscope.posting.title}),
								t('shared:socialOptions.posting.description', {value: pscope.posting.tally.appreciation, title: pscope.posting.title,
							author: pscope.posting.author.username, tags: utils.tagify(pscope.posting.tags), created: utils.getCalendarDate(pscope.posting.created)}),
							$state.href(states.POSTINGS_ID, params, {absolute: true}), alt);
					});
				}
			};
			
			/*
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
					$scope[scopeVars.SINGLE] = 'single';
					$scope.posting = Single.getSingleMain(s);
					$scope.postingId = $scope.posting.id;
					postingId = $scope.postingId;
					postingWarning = $scope.posting.warning;
					$scope.username = $scope.posting.author.username;
					author = $scope.username;
					$scope.enabled = !$scope.posting.disabled;
				}
			};
			*/
			
			var promotionData = {loading: false, open: false};
			$scope.promotionData = promotionData;
			var PromotionModalCtrl = function($scope, $modalInstance) {
				$scope.promotionData = promotionData;
				promotionData.errors = {};
				promotionData.promotion = undefined;
				promotionData.warning = pscope.posting.warning || false;
				promotionData.tags = undefined;
				promotionData.alert = undefined;
				promotionData.showPurchaseLink = false;
				$scope.optionalCollapsed = true;
				
				var getPromotionSuccess = function(amount) {
					return function(code, dto, page) {
						promotionData.loading = false;
						//Single.refresh();
						$rootScope.$broadcast(events.BALANCE_CHANGE);
						$modalInstance.close(true);
						i18n(function(t) {
							Alerts.info(t('alerts:promotion.success'));
						});
						if(ng.isDefined(pscope.posting.tally) && amount > 0) {
							pscope.posting.tally.promotion += amount;
							pscope.posting.tally.value += amount;
						}
						/*
						CacheDelay.posting(function() {
							single.refresh();
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
					var parsedTags = utils.parseTags(promotionData.tags);
					pyFinance.promotePosting(getPromotionSuccess(promotionData.promotion), promotionError, promotionApiError,
							pscope.postingId, promotionData.promotion, parsedTags, promotionData.warning);
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
				
			};

			$scope.openPromotion = function() {
				var m = $modal.open({
					templateUrl: 'postingPromotionModal',
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
				
				AutoRefresh.manageRefresh(function() {
					$scope.sinceAction++;
				}, 1, undefined, false, false, $scope);
				
				$scope.$on('$destroy', function(event) {
					$rootScope.$broadcast(events.destroy('AppreciationModalCtrl'));
				});
				
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
						pyFinance.calculateAppreciationTotals(dataChanged(false), function(){}, function(){}, appreciationData.appreciation);
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
						Payment.payment(dto.result, true, pscope.single, pscope.posting.author.username, amount);
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
						pyFinance.appreciatePosting(getAppreciationSuccess(appreciationData.appreciation), appreciationError, appreciationApiError,
								pscope.postingId, appreciationData.appreciation, parsedTags, appreciationData.warning);
					}
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openAppreciation = function() {
				if($scope.hasAccepted) {
					var m = $modal.open({
						templateUrl: 'postingAppreciationModal',
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
						Alerts.info(t('alerts:flagged.postingSuccess'));
					});
				};
				
				var error = function() {
					i18n(function(t) {
						flagData.loading = false;
						Alerts.warning(t('alerts:flagged.postingError'));
					});
				};
				
				$scope.submit = function(reason) {
					if(typeof(postingId) !== 'undefined') {
						flagData.loading = true;
						pyPosting.flag(success, error, error, pscope.postingId, reason);
					}
					$modalInstance.close(true);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openFlag = function() {
				var m = $modal.open({
					templateUrl: 'postingFlagModal',
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
				pscope.posting.disabled = false;
				$scope.loadedEnable = true;
				/*
				CacheDelay.posting(function() {
					single.refresh();
				}, true);
				*/
			};
			
			var disableSuccess = function(code, dto, page) {
				// let it refresh instead
				pscope.posting.disabled = true;
				$scope.loadedEnable = true;
				/*
				CacheDelay.posting(function() {
					single.refresh();
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
				pyPosting.enable(enableSuccess, enableError('alerts:posting.enable.error'), enableError('alerts:apiError'), pscope.postingId);
			};
			
			$scope.onDisable = function() {
				$scope.loadedEnable = false;
				pyPosting.disable(disableSuccess, enableError('alerts:posting.disable.error'), enableError('alerts:apiError'), pscope.postingId);
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