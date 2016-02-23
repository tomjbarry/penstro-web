define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/events',
        'js/constants/scope-variables', 'js/constants/partials', 'js/constants/chained-keys'],
		function(controller, $, ng, i18n, utils, pathVars, events, scopeVars, partials, chainedKeys) {
	
	controller.controller('PostingController', ['$scope', '$parse', 'SharedMethods', 'ApiData', 'Options', 'pyComment',
		function($scope, $parse, SharedMethods, ApiData, Options, pyComment) {
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
				$scope.loadingComments = true;
				pyComment.postingComments(getCallback(callback), getCommentsError(error), getCommentsError(apiError), number, $scope.postingId);
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
					if(ng.isDefined($scope.posting)) {
						i18n(function(t) {
							$scope.posting.replyCount = $scope.posting.replyCount + 1;
							$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.posting.replyCount});
							
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
				pyComment.postingReply(getReply(success), error, apiError, $scope.postingId, content, backer, warning, cost);
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.posting = s.getSingleMain();
					$scope.postingId = $scope.posting.id;
					$scope.hideExplicit = $scope.posting.warning && !Options.getWarning();
					
					if(typeof($scope.posting.title) !== 'undefined') {
						$scope.title = $scope.posting.title;
					}
					
					i18n(function(t) {
						$scope.tally = $scope.posting.tally || {};
						$scope.replyTally = $scope.posting.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.posting');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.posting.replyCount});
						$scope.appreciationCountLabel = t('shared:appreciationsCount', {count: $scope.posting.appreciationCount});
						$scope.promotionCountLabel = t('shared:promotionsCount', {count: $scope.posting.promotionCount});
						$scope.timeSince = utils.getTimeSince($scope.posting.created);
						$scope.calendar = utils.getCalendarDate($scope.posting.created);
						
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
			$scope.$on(events.SINGLE_CHANGE, function(event, s) {
				if(!event.defaultPrevented) {
					event.preventDefault();
					updated(s);
				}
			});*/
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
			*/
			/*
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			Authentication.manageEvent($scope, function(event, authenticated) {
				single.refresh();
				setAuthenticated(authenticated);
			});
			setAuthenticated(Authentication.isAuthenticated());
			*/
		}
	]);
	controller.controller('PostingPreviewController', ['$scope', '$parse',
		function($scope, $parse) {
			$scope.init = function(i) {
				$scope.posting = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
				if(typeof($scope.posting) !== 'undefined') {
					i18n(function(t) {
						if(typeof($scope.posting.title) !== 'undefined') {
							$scope.title = $scope.posting.title;
							$scope.hrefTitle = utils.getEncodedTitle($scope.posting.title);
						}
						$scope.tally = $scope.posting.tally || {};
						$scope.replyTally = $scope.posting.replyTally || {};
						$scope.tallyLabel = t('shared:finance.summary');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.posting.replyCount});
						$scope.timeSince = utils.getTimeSince($scope.posting.created);
						$scope.calendar = utils.getCalendarDate($scope.posting.created);
					});
				}
			};
		}
	]);
});