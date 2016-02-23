define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils',
        'js/constants/path-variables', 'js/constants/states', 'js/constants/scope-variables', 'js/constants/partials',
        'js/constants/chained-keys', 'js/constants/events'],
		function(controller, $, ng, i18n, utils, pathVars, states, scopeVars, partials, chainedKeys, events) {
	
	controller.controller('TagController', ['$scope', '$parse', '$state', 'SharedMethods', 'ApiData', 'pyPosting', 'pyComment',
		function($scope, $parse, $state, SharedMethods, ApiData, pyPosting, pyComment) {
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
			
			var postingsMethod = function(number, callback, error, apiError) {
				$scope.loadingSubPageable = true;
				pyPosting.postingPreviews(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.postings'), getSubPageableError(apiError, 'alerts:pageableErrors.postings'), number, undefined, [$scope.tag.name]);
			};
			
			var commentsMethod = function(number, callback, error, apiError) {
				$scope.loadingSubPageable = true;
				pyComment.tagComments(getCallback(callback), getSubPageableError(error, 'alerts:pageableErrors.comments'), getSubPageableError(apiError, 'alerts:pageableErrors.comments'), number, $scope.tag.name);
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
						time: true,
						asReplies: true,
						autoSub: false,
						scroll: false
					});
			};
			
			$scope.subPageableDropdownOpen = false;
			
			var getReply = function(success) {
				if(!ng.isDefined(success)) {
					success = function(){};
				}
				return function(code, dto, p) {
					if(ng.isDefined($scope.tag)) {
						i18n(function(t) {
							$scope.tag.replyCount = $scope.tag.replyCount + 1;
							$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.tag.replyCount});
							
							$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.tag.name, $scope.tally, $scope.tallyLabel,
									$scope.replyTally, $scope.replyTallyLabel);

							for(var i = 0; i < $scope.subPageableOptions.length; i++) {
								if($scope.subPageableOptions[i].state === states.TAGS_ID_REPLIES) {
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
				pyComment.tagReply(getReply(success), error, apiError, $scope.tag.name, content, backer, warning, cost);
			};
		
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.tag = s.getSingleMain();
					
					i18n(function(t){
						$scope.tally = {
							value: $scope.tag.value,
							appreciation: $scope.tag.appreciation
						};
						$scope.replyTally = $scope.tag.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.tag');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.tag.replyCount});
						$scope.timeSince = utils.getTimeSince($scope.tag.lastPromotion);
						$scope.calendar = utils.getCalendarDate($scope.tag.lastPromotion);
						
						$scope.openStatistics = SharedMethods.getPromotionStatsModal($scope, $scope.tag.name, $scope.tally, $scope.tallyLabel,
								$scope.replyTally, $scope.replyTallyLabel);
						
						$scope.showSubPageable = false;
						$scope.showSubPageableIcon = iconPlus;
						$scope.subPageableAlert = undefined;
						
						$scope.subPageableOptions = [
							{
								label: t('shared:taggedPostings'),
								view: partials.POSTING,
								method: postingsMethod,
								state: states.TAGS_ID,
								icon: 'fa-newspaper-o'
							},
							{
								label: $scope.replyTallyLabel,
								view: partials.COMMENT,
								method: commentsMethod,
								state: states.TAGS_ID_REPLIES,
								icon: 'fa-at'
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
	controller.controller('TagPreviewController', ['$scope', 'Pageable',
		function($scope, Pageable) {
			$scope.init = function(i) {
				$scope.tag = Pageable.getPageItem(i);
				if(typeof($scope.tag) !== 'undefined') {
					
					i18n(function(t){
						$scope.tally = {
							value: $scope.tag.value,
							appreciation: $scope.tag.appreciation
						};
						$scope.replyTally = $scope.tag.replyTally || {};
						$scope.tallyLabel = t('shared:tallyTitle.tag');
						$scope.replyTallyLabel = t('shared:commentsCount', {count: $scope.tag.replyCount});
						$scope.timeSince = utils.getTimeSince($scope.tag.lastPromotion);
						$scope.calendar = utils.getCalendarDate($scope.tag.lastPromotion);
					});
				}
			};
		}
	]);
});