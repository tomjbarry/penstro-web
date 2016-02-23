define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/forms',
        'js/constants/events', 'js/constants/values', 'js/constants/chained-keys', 'js/constants/scope-variables', 'js/constants/partials', 'js/constants/states'],
		function(controller, $, ng, i18n, validation, utils, pathVars, viewUrls, responseCodes, forms, events, values, chainedKeys, scopeVars, partials, states) {
	controller.controller('CurrentController', ['$rootScope', '$scope', '$parse', 'SharedMethods', 'Browser', 'ApiData', 'Authentication', 'AutoRefresh', 'Options',
																							'Alerts', 'User', 'Utils', 'MarkdownConverter', 'pyProfile', 'pyPosting', 'pyComment', 'pyFollow', 'pyBlock', 'pyEvent',
		function($rootScope, $scope, $parse, SharedMethods, Browser, ApiData, Authentication, AutoRefresh, Options, Alerts, User, Utils, Converter, pyProfile,
							pyPosting, pyComment, pyFollow, pyBlock, pyEvent) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
	
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
				$scope.data = ApiData.getData(undefined,
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
			
			$scope.descriptionWarning = false;
			$scope.appreciationResponseWarning = false;
			$scope.showDescriptionPreview = false;
			$scope.showResponsePreview = false;
			var username;
			
			var descriptionData = {loading: false, open: false, errors: {}};
			$scope.descriptionData = descriptionData;
			
			var appreciationResponseData = {loading: false, open: false, errors: {}};
			$scope.appreciationResponseData = appreciationResponseData;
			
			var getReply = function(success) {
				if(!ng.isDefined(success)) {
					success = function(){};
				}
				return function(code, dto, p) {
					if(ng.isDefined($scope.current)) {
						i18n(function(t) {
							$scope.current.replyCount = $scope.current.replyCount + 1;
							$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.current.replyCount});
							
							$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.username, $scope.tally, $scope.tallyLabel,
									$scope.replyTally, $scope.replyTallyLabel,
									[$scope.appreciationCountLabel,
									 $scope.promotionCountLabel,
									 $scope.postingCountLabel,
									 $scope.commentCountLabel,
									 $scope.followerCountLabel,
									 $scope.followeeCountLabel]);

							for(var i = 0; i < $scope.subPageableOptions.length; i++) {
								if($scope.subPageableOptions[i].state === states.CURRENT_REPLIES) {
									$scope.activeSubPageable = $scope.subPageableOptions[i];
									$scope.loadSubPageable($scope.activeSubPageable);
								}
							}
						});
					}
					return success(code, dto, p);
				};
			};

			$scope.reply = function(success, error, apiError, content, backer, warning, cost) {
				pyComment.userReply(getReply(success), error, apiError, $scope.username, content, backer, warning, cost);
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.current = s.getSingleMain();
					username = $scope.current.username.username;
					$scope.username = username;
					$scope.tally = $scope.current.tally || {};
					$scope.replyTally = $scope.current.replyTally || {};
					$scope.description = $scope.current.description;
					$scope.appreciationResponse = $scope.current.appreciationResponse;
					if(typeof($scope.descriptionData) !== 'undefined') {
						$scope.descriptionData.description = $scope.description;
					}
					if(typeof($scope.appreciationResponse) !== 'undefined') {
						$scope.appreciationResponseData.appreciationResponse = $scope.appreciationResponse;
					}
					$scope.descriptionWarning = $scope.current.warning;
					$scope.appreciationResponseWarning = $scope.current.appreciationResponseWarning;
					
					i18n(function(t){
						$scope.tally = {
							appreciation: $scope.current.appreciation,
							value: $scope.current.promotion
						};
						$scope.tallyLabel = t('shared:tallyTitle.current');
						$scope.replyTally = $scope.current.replyTally || {};
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.current.replyCount});
						$scope.appreciationCountLabel = t('shared:appreciationsCount', {count: $scope.current.appreciationCount});
						$scope.promotionCountLabel = t('shared:promotionsCount', {count: $scope.current.promotionCount});
						$scope.followerCountLabel = t('shared:followersCount', {count: $scope.current.followerCount});
						$scope.followeeCountLabel = t('shared:followeesCount', {count: $scope.current.followeeCount});
						$scope.postingCountLabel = t('shared:postingsCount', {count: $scope.current.contributedPostings});
						$scope.commentCountLabel = t('shared:commentsCount', {count: $scope.current.contributedComments});
						
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
				 				state: states.CURRENT,
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
				 				state: states.CURRENT_REPLIES,
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
				 				state: states.FOLLOWEES,
				 				icon: 'fa-binoculars',
				 				view: partials.FOLLOWEE,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyFollow.followees(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.users'), getSubPageableError(apiError, 'alerts:pageableErrors.users'), number);
				 				}
				 			},
				 			{
				 				label: t('shared:followers'),
				 				state: states.FOLLOWERS,
				 				icon: 'fa-child',
				 				view: partials.FOLLOWER,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyFollow.followers(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.users'), getSubPageableError(apiError, 'alerts:pageableErrors.users'), number);
				 				}
				 			},
				 			{
				 				label: t('shared:blocked'),
				 				state: states.BLOCKED,
				 				icon: 'fa-child',
				 				view: partials.BLOCKED,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					
				 					pyBlock.blocked(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.users'), getSubPageableError(apiError, 'alerts:pageableErrors.users'), number);
				 				}
				 			},
				 			{
				 				label: t('shared:authoredPostings'),
				 				state: states.CURRENT_POSTINGS,
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
				 				state: states.CURRENT_COMMENTS,
				 				icon: 'fa-comments',
				 				view: partials.COMMENT,
				 				time: true,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					var commentTypes;
				 					
				 					pyComment.commentPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.comments'), getSubPageableError(apiError, 'alerts:pageableErrors.comments'), number, $scope.username, commentTypes);
				 				}
				 			},
				 			{
				 				label: t('shared:yourPostings'),
				 				state: states.CURRENT_SELF_POSTINGS,
				 				icon: 'fa-newspaper-o',
				 				view: partials.POSTING,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					var tags;
				 					
				 					pyPosting.currentPostingPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.postings'), getSubPageableError(apiError, 'alerts:pageableErrors.postings'), number, tags);
				 				}
				 			},
				 			{
				 				label: t('shared:yourComments'),
				 				state: states.CURRENT_SELF_COMMENTS,
				 				icon: 'fa-comments',
				 				view: partials.COMMENT,
				 				time: false,
				 				asReplies: false,
				 				method: function(number, callback, error, apiError) {
				 					pyComment.currentCommentPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.comments'), getSubPageableError(apiError, 'alerts:pageableErrors.comments'), number);
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
					});
					
					$scope.toggleSubPageable = function() {
						if($scope.showSubPageable) {
							$scope.showSubPageable = false;
							$scope.showSubPageableIcon = iconPlus;
						} else {
							$scope.loadSubPageable($scope.activeSubPageable);
						}
					};
					$scope.data = {};
				}
			};
			
			var descriptionSuccess = function(code, dto, page) {
				descriptionData.loading = false;
				descriptionData.open = false;
				$scope.description = descriptionData.description;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
			};
			
			var descriptionError = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('descriptionForm');
					descriptionData.loading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['description'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								descriptionData.errors[field] = t(code, validation.getArguments(error));
							} else {
								descriptionData.errors[field] = undefined;
							}
						});
					} else {
						descriptionData.alert(t('alerts:description.descriptionError'));
					}
				});
			};
			
			var descriptionApiError = function() {
				i18n(function(t) {
					Browser.scrollTo('descriptionForm');
					descriptionData.loading = false;
					descriptionData.alert = t('alerts:apiError');
				});
			};
			
			$scope.updateDescription = function() {
				descriptionData.loading = true;
				descriptionData.errors = {};
				descriptionData.alert = undefined;
				pyProfile.updateProfile(descriptionSuccess, descriptionError, descriptionApiError, descriptionData.description, descriptionData.warning);
			};
			
			$scope.cancelDescription = function() {
				descriptionData.open = false;
				$scope.descriptionData.description = $scope.description;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
			};
			
			$scope.editDescription = function() {
				descriptionData.loading = false;
				descriptionData.open = true;
				descriptionData.alert = undefined;
				descriptionData.errors = {};
				descriptionData.description = $scope.description;
				descriptionData.warning = $scope.descriptionWarning;
				Utils.unsavedChanges($scope, forms.EDIT_PROFILE);
			};
			
			var appreciationResponseSuccess = function(code, dto, page) {
				appreciationResponseData.loading = false;
				appreciationResponseData.open = false;
				$scope.appreciationResponse = appreciationResponseData.appreciationResponse;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
			};
			
			var appreciationResponseError = function(code, dto) {
				i18n(function(t) {
					Browser.scrollTo('appreciationResponseForm');
					appreciationResponseData.loading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['appreciationResponse'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								appreciationResponseData.errors[field] = t(code, validation.getArguments(error));
							} else {
								appreciationResponseData.errors[field] = undefined;
							}
						});
					} else {
						appreciationResponseData.alert(t('alerts:appreciationResponse.updateError'));
					}
				});
			};
			
			var appreciationResponseApiError = function() {
				i18n(function(t) {
					Browser.scrollTo('appreciationResponseForm');
					appreciationResponseData.loading = false;
					appreciationResponseData.alert = t('alerts:apiError');
				});
			};
			
			$scope.updateAppreciationResponse = function() {
				appreciationResponseData.loading = true;
				appreciationResponseData.errors = {};
				appreciationResponseData.alert = undefined;
				pyProfile.updateAppreciationResponse(appreciationResponseSuccess, appreciationResponseError, appreciationResponseApiError,
						appreciationResponseData.appreciationResponse, appreciationResponseData.warning);
			};
			
			$scope.cancelAppreciationResponse = function() {
				appreciationResponseData.open = false;
				appreciationResponseData.appreciationResponse = $scope.appreciationResponse;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
			};
			
			$scope.editAppreciationResponse = function() {
				appreciationResponseData.loading = false;
				appreciationResponseData.open = true;
				appreciationResponseData.alert = undefined;
				appreciationResponseData.errors = {};
				appreciationResponseData.appreciationResponse = $scope.appreciationResponse;
				appreciationResponseData.warning = $scope.appreciationResponseWarning;
				Utils.unsavedChanges($scope, forms.EDIT_APPRECIATION_RESPONSE);
			};
			
			$scope.updateDescriptionPreview = function() {
				var content = $scope.descriptionData.description;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.descriptionPreview = content;
			};
			
			$scope.updateResponsePreview = function() {
				var content = $scope.appreciationResponseData.appreciationResponse;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.responsePreview = content;
			};
			
			Converter.manageEvent($scope, function() {
				$scope.updateDescriptionPreview();
				$scope.updateResponsePreview();
			});
			
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			setAuthenticated(Authentication.isAuthenticated());
		}
	]);
});