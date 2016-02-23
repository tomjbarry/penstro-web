define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/comment-types', 'js/constants/states', 'js/constants/events',
        'js/constants/scope-variables', 'js/constants/partials', 'js/constants/chained-keys'],
		function(controller, $, ng, i18n, utils, pathVars, commentTypes, states, events, scopeVars, partials, chainedKeys) {
	
	controller.controller('CommentController', ['$scope', '$state', '$parse', 'ApiData', 'SharedMethods', 'Options', 'pyComment',
		function($scope, $state, $parse, ApiData, SharedMethods, Options, pyComment) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = 'subData.pageable';

			var iconPlus = 'fa-plus';
			var iconMinus = 'fa-minus';

			var getCallback = function(c) {
				return function(code, dto, p) {
					$scope.showSubPageable = true;
					$scope.showSubPageableIcon = iconMinus;
					$scope.loadingComments = false;
					c(code, dto, p);
				};
			};
			
			var getCommentsError = function(e) {
				return function(code, dto) {
					i18n(function(t) {
						$scope.loadingComments = false;
						$scope.subPageableAlert = t('alerts:pageableErrors.comments');
						e(code, dto);
					});
				};
			};
			
			var method = function(number, callback, error, apiError) {
				pyComment.commentComments(getCallback(callback), getCommentsError(error), getCommentsError(apiError), number, $scope.commentId);
			};
			
			var loadComments = function() {
				$scope.subPageableAlert = undefined;
				$scope.subData = ApiData.getData(undefined,
					{
						scope: $scope,
						view: partials.COMMENT,
						method: method,
						number: 0,
						title: 'shared:comments',
						time: true,
						asReplies: true,
						scroll: false
					});
			};
			
			var getReply = function(success) {
				if(!ng.isDefined(success)) {
					success = function(){};
				}
				return function(code, dto, p) {
					if(ng.isDefined($scope.comment)) {
						i18n(function(t) {
							$scope.comment.replyCount = $scope.comment.replyCount + 1;
							$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.comment.replyCount});
							
							$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.title, $scope.tally, $scope.tallyLabel,
									$scope.replyTally, $scope.replyTallyLabel, [$scope.appreciationCountLabel, $scope.promotionCountLabel]);
							loadComments();
						});
					}
					return success(code, dto, p);
				};
			};
			
			$scope.reply = function(success, error, apiError, content, backer, warning, cost) {
				$scope.$broadcast(events.SET_EDITOR);
				pyComment.commentReply(getReply(success), error, apiError, $scope.commentId, content, backer, warning, cost);
			};
			
			$scope.contextOpen = false;
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.comment = s.getSingleMain();
					$scope.commentId = $scope.comment.id;
					$scope.hideExplicit = $scope.comment.warning && !Options.getWarning();
					
					i18n(function(t) {
						if(typeof($scope.comment.base) !== 'undefined') {
							var args = {};
							if($scope.comment.type === commentTypes.POSTING) {
								args[pathVars.POSTING] = $scope.comment.base;
								$scope.baseLink = $state.href(states.POSTINGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.posting');
							} else if($scope.comment.type === commentTypes.TAG) {
								args[pathVars.TAG] = $scope.comment.base;
								$scope.baseLink = $state.href(states.TAGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.tag');
							} else if($scope.comment.type === commentTypes.USER) {
								args[pathVars.USER] = $scope.comment.base;
								$scope.baseLink = $state.href(states.USERS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.user');
							}
						}
						
						if(typeof($scope.comment.parent) !== 'undefined') {
							$scope.parentTitle = t('shared:parent');
						}

						$scope.tally = $scope.comment.tally || {};
						$scope.replyTally = $scope.comment.replyTally || {};
						$scope.title = t('shared:commentUser', {user: $scope.comment.author.username});
						$scope.tallyLabel = t('shared:tallyTitle.comment');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.comment.replyCount});
						$scope.appreciationCountLabel = t('shared:appreciationsCount', {count: $scope.comment.appreciationCount});
						$scope.promotionCountLabel = t('shared:promotionsCount', {count: $scope.comment.promotionCount});
						$scope.timeSince = utils.getTimeSince($scope.comment.created);
						$scope.calendar = utils.getCalendarDate($scope.comment.created);
						
						$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.title, $scope.tally, $scope.tallyLabel,
								$scope.replyTally, $scope.replyTallyLabel, [$scope.appreciationCountLabel, $scope.promotionCountLabel]);

						$scope.showSubPageable = false;
						$scope.showSubPageableIcon = iconPlus;
						$scope.subPageableAlert = undefined;
						
						if(s.autoSub) {
							$scope.showSubPageable = true;
							$scope.showSubPageableIcon = iconMinus;
							loadComments();
						}
					});
					
					$scope.toggleSubPageable = function() {
						if($scope.showSubPageable) {
							$scope.showSubPageable = false;
							$scope.showSubPageableIcon = iconPlus;
						} else {
							loadComments();
						}
					};
					$scope.subData = {};
				}
			};
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			*/
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
			/*
			Payment.manageAppreciationEvent($scope, function(event) {
				Single.refresh();
			});
			
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
	controller.controller('CommentViewController', ['$scope', '$state', 'Options', 'Pageable',
		function($scope, $state, Options, Pageable) {
			$scope.init = function(i) {
				$scope.contextOpen = false;
				$scope.comment = Pageable.getPageItem(i);
				if(typeof($scope.comment) !== 'undefined') {
				$scope.hideExplicit = $scope.comment.warning && !Options.getWarning();
					
					i18n(function(t) {
						if(typeof($scope.comment.base) !== 'undefined') {
							var args = {};
							if($scope.comment.type === commentTypes.POSTING) {
								args[pathVars.POSTING] = $scope.comment.base;
								$scope.baseLink = $state.href(states.POSTINGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.posting');
							} else if($scope.comment.type === commentTypes.TAG) {
								args[pathVars.TAG] = $scope.comment.base;
								$scope.baseLink = $state.href(states.TAGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.tag');
							} else if($scope.comment.type === commentTypes.USER) {
								args[pathVars.USER] = $scope.comment.base;
								$scope.baseLink = $state.href(states.USERS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.user');
							}
						}
						
						if(typeof($scope.comment.parent) !== 'undefined') {
							$scope.parentTitle = t('shared:parent');
						}
						$scope.tally = $scope.comment.tally || {};
						$scope.replyTally = $scope.comment.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.comment');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.comment.replyCount});
						$scope.timeSince = utils.getTimeSince($scope.comment.created);
						$scope.calendar = utils.getCalendarDate($scope.comment.created);
						$scope.commentLabel = t('shared:commentPreviewLink');
					});
				}
			};
		}
	]);

	controller.controller('CommentPreviewController', ['$scope', '$state', 'Options', 'Pageable',
		function($scope, $state, Options, Pageable) {
			$scope.init = function(i) {
				$scope.contextOpen = false;
				$scope.comment = Pageable.getPageItem(i);
				if(typeof($scope.comment) !== 'undefined') {
				$scope.hideExplicit = $scope.comment.warning && !Options.getWarning();
					
					i18n(function(t) {
						if(typeof($scope.comment.base) !== 'undefined') {
							var args = {};
							if($scope.comment.type === commentTypes.POSTING) {
								args[pathVars.POSTING] = $scope.comment.base;
								$scope.baseLink = $state.href(states.POSTINGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.posting');
							} else if($scope.comment.type === commentTypes.TAG) {
								args[pathVars.TAG] = $scope.comment.base;
								$scope.baseLink = $state.href(states.TAGS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.tag');
							} else if($scope.comment.type === commentTypes.USER) {
								args[pathVars.USER] = $scope.comment.base;
								$scope.baseLink = $state.href(states.USERS_ID, args, {reload: true});
								$scope.baseTitle = t('shared:base.user');
							}
						}
						
						if(typeof($scope.comment.parent) !== 'undefined') {
							$scope.parentTitle = t('shared:parent');
						}
						$scope.tally = $scope.comment.tally || {};
						$scope.replyTally = $scope.comment.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.comment');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.comment.replyCount});
						$scope.timeSince = utils.getTimeSince($scope.comment.created);
						$scope.calendar = utils.getCalendarDate($scope.comment.created);
						$scope.commentLabel = t('shared:commentPreviewLink');
					});
				}
			};
		}
	]);
});