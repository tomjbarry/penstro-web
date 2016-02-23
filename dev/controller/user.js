define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/scope-variables', 'js/constants/chained-keys',
        'js/constants/states', 'js/constants/partials', 'js/constants/response-codes', 'js/constants/events'],
		function(controller, $, ng, i18n, utils, pathVars, scopeVars, chainedKeys, states, partials, responseCodes, events) {
	
	controller.controller('UserController', ['$scope', '$parse', '$state', '$stateParams', 'SharedMethods', 'AutoRefresh', 'ApiData', 'Authentication', 'CurrentUser',
	                                         'Options', 'pyFollow', 'pyEvent', 'pyPosting', 'pyComment',
		function($scope, $parse, $state, $stateParams, SharedMethods, AutoRefresh, ApiData, Authentication, CurrentUser, Options, pyFollow, pyEvent, pyPosting, pyComment) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = 'subData.pageable';
	
			var iconPlus = 'fa-plus';
			var iconMinus = 'fa-minus';
	
			var getCallback = function(c) {
				return function(code, dto, p) {
					$scope.showSubPageable = true;
					$scope.showSubPageableIcon = iconMinus;
					$scope.loadingSubPageable = false;
					c(code, dto, p);
				};
			};
			
			var getSubPageableError = function(e, a) {
				return function(code, dto) {
					i18n(function(t) {
						$scope.loadingSubPageable = false;
						$scope.subPageableAlert = t('alerts:pageableErrors.sub');
						if(ng.isDefined(a)) {
							$scope.subPageableAlert = t(a);
						}
						e(code, dto);
					});
				};
			};
			
			$scope.loadSubPageable = function(active) {
				$scope.subPageableAlert = undefined;
				$scope.activeSubPageable = active;
				$scope.subData = ApiData.getData(undefined,
					{
						scope: $scope,
						view: active.view,
						method: active.method,
						number: 0,
						title: active.label,
						time: active.time,
						asReplies: active.asReplies,
						scroll: false,
						autoLoad: true,
						autoSub: false
					});
			};
			
			$scope.subPageableDropdownOpen = false;
			
			var checkFollows = function(username) {
				CurrentUser.hasFollows(username, function(result){
					if(result) {
						$scope.follows = true;
					} else {
						$scope.follows = false;
					}
				}, function() {
					$scope.follows = undefined;
				});
			};
			
			var checkBlocked = function(username) {
				CurrentUser.hasBlocked(username, function(result){
					if(result) {
						$scope.blocked = true;
					} else {
						$scope.blocked = false;
					}
				}, function() {
					$scope.blocked = undefined;
				});
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated && ng.isDefined($scope.username)) {
					checkFollows($scope.username);
					checkBlocked($scope.username);
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var getReply = function(success) {
				if(!ng.isDefined(success)) {
					success = function(){};
				}
				return function(code, dto, p) {
					if(ng.isDefined($scope.user)) {
						i18n(function(t) {
							$scope.user.replyCount = $scope.user.replyCount + 1;
							$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.user.replyCount});

							$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.username, $scope.tally, $scope.tallyLabel,
									$scope.replyTally, $scope.replyTallyLabel,
									[$scope.appreciationCountLabel,
									 $scope.promotionCountLabel,
									 $scope.postingCountLabel,
									 $scope.commentCountLabel,
									 $scope.followerCountLabel,
									 $scope.followeeCountLabel]);

							for(var i = 0; i < $scope.subPageableOptions.length; i++) {
								if($scope.subPageableOptions[i].state === states.USERS_ID_REPLIES) {
									$scope.activeSubPageable = $scope.subPageableOptions[i];
									$scope.activeSubPageable.label = $scope.replyTallyLabel;
									$scope.loadSubPageable($scope.activeSubPageable);
								}
							}
						});
					}
					return success(code, dto, p);
				};
			};
			
			$scope.reply = function(success, error, apiError, content, backer, warning, cost) {
				$scope.$broadcast(events.SET_EDITOR);
				pyComment.userReply(getReply(success), error, apiError, $scope.username, content, backer, warning, cost);
			};
		
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.user = s.getSingleMain();
					$scope.username = $scope.user.username.username;
					$scope.hideExplicit = $scope.user.warning && !Options.getWarning();
					$scope.follows = false;
					$scope.blocked = false;
					checkFollows($scope.username);
					checkBlocked($scope.username);
					
					i18n(function(t) {
						$scope.tally = {
							appreciation: $scope.user.appreciation,
							value: $scope.user.promotion
						};
						$scope.replyTally = $scope.user.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.user');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.user.replyCount});
						$scope.appreciationCountLabel = t('shared:appreciationsCount', {count: $scope.user.appreciationCount});
						$scope.promotionCountLabel = t('shared:promotionsCount', {count: $scope.user.promotionCount});
						$scope.followerCountLabel = t('shared:followersCount', {count: $scope.user.followerCount});
						$scope.followeeCountLabel = t('shared:followeesCount', {count: $scope.user.followeeCount});
						$scope.postingCountLabel = t('shared:postingsCount', {count: $scope.user.contributedPostings});
						$scope.commentCountLabel = t('shared:commentsCount', {count: $scope.user.contributedComments});

						$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.username, $scope.tally, $scope.tallyLabel,
								$scope.replyTally, $scope.replyTallyLabel,
								[$scope.appreciationCountLabel,
								 $scope.promotionCountLabel,
								 $scope.postingCountLabel,
								 $scope.commentCountLabel,
								 $scope.followerCountLabel,
								 $scope.followeeCountLabel]);

						$scope.showSubPageable = false;
						$scope.showSubPageableIcon = iconPlus;
						$scope.subPageableAlert = undefined;
						
						$scope.subPageableOptions = [
				 			{
				 				label: t('shared:activity'),
				 				state: states.USERS_ID,
				 				icon: 'fa-star',
				 				view: partials.ACTIVITY,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					var events;
				 					pyEvent.userFeed(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.feed'), getSubPageableError(apiError, 'alerts:pageableErrors.feed'), $scope.username, number, events);
				 				}
				 			},
				 			{
				 				label: $scope.replyTallyLabel,
				 				state: states.USERS_ID_REPLIES,
				 				icon: 'fa-at',
				 				view: partials.COMMENT,
				 				time: true,
				 				asReplies: true,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyComment.userComments(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.comments'), getSubPageableError(apiError, 'alerts:pageableErrors.comments'), number, $scope.username);
				 				}
				 			},
				 			{
				 				label: t('shared:followees'),
				 				state: states.USERS_ID_FOLLOWEES,
				 				icon: 'fa-binoculars',
				 				view: partials.FOLLOWER,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyFollow.userFollowees(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.users'), getSubPageableError(apiError, 'alerts:pageableErrors.users'), $scope.username, number);
				 				}
				 			},
				 			{
				 				label: t('shared:followers'),
				 				state: states.USERS_ID_FOLLOWERS,
				 				icon: 'fa-child',
				 				view: partials.FOLLOWER,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyFollow.userFollowers(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.users'), getSubPageableError(apiError, 'alerts:pageableErrors.users'), $scope.username, number);
				 				}
				 			},
				 			{
				 				label: t('shared:authoredPostings'),
				 				state: states.USERS_ID_POSTINGS,
				 				icon: 'fa-newspaper-o',
				 				view: partials.POSTING,
				 				time: true,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					var tags;
				 					
				 					pyPosting.postingPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.postings'), getSubPageableError(apiError, 'alerts:pageableErrors.postings'), number, $scope.username, tags);
				 				}
				 			},
				 			{
				 				label: t('shared:authoredComments'),
				 				state: states.USERS_ID_COMMENTS,
				 				icon: 'fa-comments',
				 				view: partials.COMMENT,
				 				time: true,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					var commentTypes;
				 					
				 					pyComment.commentPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.comments'), getSubPageableError(apiError, 'alerts:pageableErrors.comments'), number, $scope.username, commentTypes);
				 				}
				 			}
				 		];
						
						$scope.activeSubPageable = $scope.subPageableOptions[0];
						var state = s.getArg('state');
						if(ng.isDefined(state)) {
							for(var i = 0; i < $scope.subPageableOptions.length; i++) {
								if($scope.subPageableOptions[i].state === state) {
									$scope.activeSubPageable = $scope.subPageableOptions[i];
								}
							}
						}
						if(s.autoSub) {
							$scope.showSubPageable = true;
							$scope.showSubPageableIcon = iconMinus;
							$scope.loadSubPageable($scope.activeSubPageable);
						}
						
						$scope.appreciationResponseHideExplicit = $scope.appreciationResponseWarning && !Options.getWarning();
						/*
						var ar = s.getChained(chainedKeys.APPRECIATION_RESPONSE);
						$scope.aR = undefined;
						$scope.appreciationResponse = undefined;
						$scope.appreciationResponseWarning = undefined;
						$scope.appreciationResponseHideExplicit = undefined;
						if(typeof(ar) !== 'undefined' && ar.code === responseCodes.SUCCESS) {
							$scope.aR = ar.dto;
							$scope.appreciationResponse = $scope.aR.appreciationResponse;
							$scope.appreciationResponseWarning = $scope.aR.appreciationResponseWarning;
							$scope.appreciationResponseHideExplicit = $scope.appreciationResponseWarning && !Options.getWarning();
						}
						*/
					});
					
					$scope.toggleSubPageable = function() {
						if($scope.showSubPageable) {
							$scope.showSubPageable = false;
							$scope.showSubPageableIcon = iconPlus;
						} else {
							$scope.loadSubPageable($scope.activeSubPageable);
						}
					};
					$scope.subData = {};
				}
			};
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
			
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			Authentication.manageEvent($scope, function(event, authenticated) {
				Single.refresh();
				setAuthenticated(authenticated);
			});
			setAuthenticated(Authentication.isAuthenticated());
			*/
		}
	]);
	controller.controller('UserAppreciationResponseController', ['$scope', '$parse', '$stateParams', 'Options',
		function($scope, $parse, $stateParams, Options) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
		
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.user = s.getSingleMain();
					var ar = s.getChained(chainedKeys.APPRECIATION_RESPONSE);
					if(typeof(ar) === 'undefined' || ar.code !== responseCodes.SUCCESS) {
						return;
					}
					$scope.aR = ar.dto;
					$scope.response = $scope.aR.appreciationResponse;
					$scope.appreciationResponseWarning = $scope.aR.appreciationResponseWarning;
					$scope.hideExplicit = $scope.appreciationResponseWarning && !Options.getWarning();
					
					i18n(function(t) {
						$scope.tally = {
							appreciation: $scope.user.appreciation,
							value: $scope.user.promotion
						};
						$scope.replyTally = $scope.user.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.user');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.user.replyCount});
					});
				}
			};
			
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
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
	controller.controller('UserPreviewController', ['$scope', 'Pageable',
		function($scope, Pageable) {
			$scope.init = function(i) {
				$scope.user = Pageable.getPageItem(i);
				if(typeof($scope.user) !== 'undefined') {
					
					i18n(function(t){
						$scope.tally = {
							appreciation: $scope.user.appreciation,
							value: $scope.user.promotion
						};
						$scope.replyTally = $scope.user.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.user');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.user.replyCount});
					});
				}
			};
		}
	]);
});