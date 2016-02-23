define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/chained-keys',
        'js/constants/roles', 'js/constants/events', 'js/constants/states'],
		function(controller, $, ng, i18n, validation, utils, pathVars, viewUrls, responseCodes, chainedKeys, roles, events, states) {
	controller.controller('UserActionsController', ['$scope', '$parse', '$modal', '$state', 'Authentication', 'Alerts', 'CurrentUser',
			'Title', 'Social', 'ModalInterface', 'pyFollow', 'pyUser', 'pyMessage', 'pyBlock',
		function($scope, $parse, $modal, $state, Authentication, Alerts, CurrentUser, Title, Social, ModalInterface, pyFollow, pyUser, pyMessage, pyBlock) {
			//pyOffer service removed temporarily. add this back in when reenabling

			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			$scope.loadedFollowing = true;
			$scope.loadedBlocking = true;
			$scope.optionalOpen = false;
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						$scope.loadedCurrentUser = true;
						$scope.currentUser = currentUser;
						$scope.currentUsername = currentUser.username.username;
					}, function() {
						$scope.loadedCurrentUser = false;
					});
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
				if(typeof($scope.user) !== 'undefined') {
					i18n(function(t) {
						var p = {};
						p[pathVars.USER] = pscope.username;
						Social.open(t('shared:socialOptions.user.title', {author: pscope.username}),
								t('shared:socialOptions.user.description', {value: pscope.user.appreciation, postingsCount: pscope.user.contributedPostings}),
								$state.href(states.USERS_ID, p, {absolute: true}));
					});
				}
			};
			/*
			var username;
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.user = s.getSingleMain();
					$scope.username = $scope.user.username.username;
					username = $scope.username;
					var sF = s.getChained(chainedKeys.FOLLOW);
					var sB = s.getChained(chainedKeys.BLOCK);
					var sAR = s.getChained(chainedKeys.APPRECIATION_RESPONSE);
					$scope.isFollowing = (typeof(sF) !== 'undefined' && sF.code === responseCodes.SUCCESS);
					$scope.isBlocking = (typeof(sB) !== 'undefined' && sB.code === responseCodes.SUCCESS);
					$scope.loadedFollowing = true;
					$scope.loadedBlocking = true;
					
					$scope.showAppreciationResponse = (typeof(sAR) !== 'undefined' && sAR.code === responseCodes.SUCCESS && sAR.dto.appreciationResponse !== 'undefined');
				}
			};
			*/
			
			var isFollowing;
			$scope.isFollowing = function() {
				if(ng.isDefined(isFollowing)) {
					return isFollowing;
				}
				if(ng.isDefined(pscope.single) && pscope.follows) {
					return true;
				}
				return false;
			};
			
			var error = function(str) {
				return function() {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.loadedFollowing = true;
					});
				};
			};
			
			var followSuccess = function(code, dto, page) {
				isFollowing = true;
				$scope.loadedFollowing = true;
				CurrentUser.refreshSubscription();
			};
			var unfollowSuccess = function(code, dto, page) {
				isFollowing = false;
				$scope.loadedFollowing = true;
				CurrentUser.refreshSubscription();
			};
			
			$scope.onFollow = function() {
				$scope.loadedFollowing = false;
				pyFollow.follow(followSuccess, function(code, dto) {
					i18n(function(t) {
						if(code === responseCodes.LIMIT) {
							Alerts.warning(t('alerts:follow.followLimit'));
						} else {
							Alerts.warning(t('alerts:follow.followError'));
						}
						$scope.loadedFollowing = true;
					});
				}, error('alerts:apiError'), pscope.username);
			};
			$scope.onUnfollow = function() {
				$scope.loadedFollowing = false;
				pyFollow.unfollow(unfollowSuccess, error('alerts:follow.unfollowError'), error('alerts:apiError'), pscope.username);
			};

			var isBlocking;
			$scope.isBlocking = function() {
				if(ng.isDefined(isBlocking)) {
					return isBlocking;
				}
				if(ng.isDefined(pscope.single) && pscope.blocked) {
					return true;
				}
				return false;
			};
			
			var blockSuccess = function(code, dto, page) {
				isBlocking = true;
				$scope.loadedBlocking = true;
				CurrentUser.refreshSubscription();
			};
			
			var unblockSuccess = function(code, dto, page) {
				isBlocking = false;
				$scope.loadedBlocking = true;
				CurrentUser.refreshSubscription();
			};
			
			var blockError = function(str) {
				return function() {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.loadedBlocking = true;
					});
				};
			};
			
			$scope.onBlock = function($event) {
				$scope.loadedBlocking = false;
				pyBlock.block(blockSuccess, function(code, dto) {
					i18n(function(t) {
						if(code === responseCodes.LIMIT) {
							Alerts.warning(t('alerts:block.blockLimit'));
						} else {
							Alerts.warning(t('alerts:block.blockError'));
						}
						$scope.loadedBlocking = true;
					});
				}, blockError('alerts:apiError'), pscope.username);
			};
			
			$scope.onUnblock = function($event) {
				$scope.loadedBlocking = false;
				pyBlock.unblock(unblockSuccess, blockError('alerts:block.unblockError'), blockError('alerts:apiError'), pscope.username);
			};
			
			//pyOffer service removed temporarily. add this back in when reenabling
			/*
			var offerData = {loading: false, open: false};
			$scope.offerData = offerData;
			var OfferModalCtrl = function($scope, $modalInstance) {
				$scope.offerData = offerData;
				offerData.errors = {};
				offerData.amount = 0;
				offerData.alert = undefined;
				
				var success = function(code, dto, page) {
					$modalInstance.close(true);
					offerData.loading = false;
					$rootScope.$broadcast(events.BALANCE_CHANGE);
				};
				var error = function(code, dto) {
					i18n(function(t) {
						offerData.loading = false;
						if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
							validation.handleErrorsInOrder(dto, ['amount'], function(field, error) {
								if(error) {
									var code = 'validation:' + validation.getValidCode(error);
									offerData.errors[field] = t(code, validation.getArguments(error));
								} else {
									offerData.errors[field] = undefined;
								}
							});
						} else if(code === responseCodes.BALANCE) {
							offerData.alert = t('alerts:errors.balance');
						} else if(code === responseCodes.FINANCE) {
							offerData.alert = t('alerts:errors.finance');
						} else {
							offerData.alert = t('alerts:offer.createError');
						}
					});
				};
				
				var apiError = function() {
					i18n(function(t) {
						offerData.loading = false;
						offerData.alert = t('alerts:offer.createError');
					});
				};
				
				$scope.submit = function() {
					if(typeof(username) !== 'undefined') {
						offerData.errors = {};
						offerData.alert = undefined;
						offerData.loading = false;
						pyOffer.offer(success, error, apiError, username, offerData.amount);
					}
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
			*/
			var flagData = {loading: false, open: false};
			$scope.flagData = flagData;
			var FlagModalCtrl = function($scope, $modalInstance) {
				$scope.flagData = flagData;
				var success = function(code, dto, page) {
					flagData.loading = false;
					i18n(function(t) {
						Alerts.info(t('alerts:flagged.userSuccess'));
					});
				};
				
				var error = function() {
					i18n(function(t) {
						flagData.loading = false;
						Alerts.warning(t('alerts:flagged.userError'));
					});
				};
				
				$scope.submit = function(reason) {
					flagData.loading = true;
					pyUser.flag(success, error, error, pscope.username, reason);
					$modalInstance.close(true);
				};
				
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			};

			$scope.openFlag = function() {
				var m = $modal.open({
					templateUrl: 'flagModal',
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