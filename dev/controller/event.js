define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils', 'js/constants/states', 'js/constants/path-variables',
        'js/constants/scope-variables', 'js/constants/partials', 'js/constants/chained-keys', 'js/constants/values'],
		function(controller, $, ng, i18n, utils, states, pathVars, scopeVars, partials, chainedKeys, values) {
	
	/*
	var getLink = function($state, link, ids) {
		if(typeof(link) === 'undefined') {
			return link;
		}
		var l = link;
		var i = ids;
		if(typeof(link) !== typeof('')) {
			l = link.link;
			for(var key in ids) {
				if(ids.hasOwnProperty(key)) {
					i[key] = ids[key];
				}
			}
			for(key in link) {
				if(link.hasOwnProperty(key) && key !== 'link') {
					i[key] = ids[link[key]];
				}
			}
		}
		
		return $state.href(l, i);
	};
	
	// if it is undefined, any, or message, it is definitely erroneous!
	var activityLinks = {
			ANY: states.INDEX,
			POSTING: states.POSTINGS_ID,
			COMMENT: states.COMMENTS_ID,
			COMMENT_SUB: states.COMMENTS_ID,
			MESSAGE: states.CONVERSATION,
			APPRECIATION_POSTING: states.POSTINGS_ID,
			APPRECIATION_COMMENT: states.COMMENTS_ID,
			APPRECIATION_ATTEMPT: states.SETTINGS,
			PROMOTION_POSTING: states.POSTINGS_ID,
			PROMOTION_COMMENT: states.COMMENTS_ID,
			OFFER: {link: states.USERS_ID},
			OFFER_ACCEPT: {link: states.USERS_ID},
			OFFER_WITHDRAW: {link: states.USERS_ID},
			OFFER_DENY: {link: states.USERS_ID},
			BACKING_CANCEL: {link: states.USERS_ID},
			BACKING_WITHDRAW: {link: states.USERS_ID},
			FOLLOW_ADD: {link: states.USERS_ID},
			FOLLOW_REMOVE: {link: states.USERS_ID}
	};
	
	var notificationLinks = {
			ANY: states.INDEX,
			POSTING: states.POSTINGS_ID,
			COMMENT: states.COMMENTS_ID,
			COMMENT_SUB: states.COMMENTS_ID,
			MESSAGE: states.CONVERSATION,
			APPRECIATION_POSTING: states.POSTINGS_ID,
			APPRECIATION_COMMENT: states.COMMENTS_ID,
			APPRECIATION_ATTEMPT: states.SETTINGS,
			PROMOTION_POSTING: states.POSTINGS_ID,
			PROMOTION_COMMENT: states.COMMENTS_ID,
			OFFER: {link: states.USERS_ID},
			OFFER_ACCEPT: {link: states.USERS_ID},
			OFFER_WITHDRAW: {link: states.USERS_ID},
			OFFER_DENY: {link: states.USERS_ID},
			BACKING_CANCEL: {link: states.USERS_ID},
			BACKING_WITHDRAW: {link: states.USERS_ID},
			FOLLOW_ADD: {link: states.USERS_ID},
			FOLLOW_REMOVE: {link: states.USERS_ID}
	};*/
	
	var links = {
			ANY: states.INDEX,
			POSTING: states.POSTINGS_ID,
			COMMENT: states.COMMENTS_ID,
			COMMENT_SUB: states.COMMENTS_ID,
			MESSAGE: states.CONVERSATION,
			APPRECIATION_POSTING: states.POSTINGS_ID,
			APPRECIATION_COMMENT: states.COMMENTS_ID,
			APPRECIATION_ATTEMPT: states.SETTINGS,
			PROMOTION_POSTING: states.POSTINGS_ID,
			PROMOTION_COMMENT: states.COMMENTS_ID,
			OFFER: states.OFFERS,
			OFFER_ACCEPT: states.USERS_ID,
			OFFER_WITHDRAW: states.USERS_ID,
			OFFER_DENY: states.USERS_ID,
			BACKING_CANCEL: states.USERS_ID,
			BACKING_WITHDRAW: states.USERS_ID,
			FOLLOW_ADD: states.USERS_ID,
			FOLLOW_REMOVE: states.USERS_ID,
			POSTING_INFRINGEMENT: states.POSTINGS_ID,
			COMMENT_INFRINGEMENT: states.COMMENTS_ID
	};
	
	controller.controller('ActivityController', ['$scope', '$state', '$parse', '$timeout', 'ApiData', 'pyPosting', 'pyComment', 'User',
		function($scope, $state, $parse, $timeout, ApiData, pyPosting, pyComment, User) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var getSuccess = function(callback) {
				return function(code, dto, p) {
					$scope.loadingSubSingle = false;
					return callback(code, dto, p);
				};
			};
			
			var getError = function(error, a) {
				return function(code, dto) {
					i18n(function(t) {
						$scope.loadingSubSingle = false;
						$scope.subSingleAlert = t('alerts:pageableErrors.sub');
						if(ng.isDefined(a)) {
							$scope.subSingleAlert = t(a);
						}
					});
					$scope.subData = {};
					error(code, dto);
				};
			};
			
			var getData = function(activity) {
				if(ng.isDefined(activity) && ng.isDefined(activity.view) && (ng.isDefined(activity.method) || ng.isDefined(activity.getData))) {
					return function() {
						$scope.subSingleAlert = undefined;
						if(ng.isDefined($scope.subData) && ng.isDefined($scope.subData.single)) {
							$scope.subData = {};
						} else {
							$scope.loadingSubSingle = true;
							if(ng.isDefined(activity.getData)) {
								$scope.subData = activity.getData($scope.targetIds, $scope.targets);
							} else {
								$scope.subData = ApiData.getData({
									scope: $scope,
									view: activity.view,
									method: activity.method($scope.targetIds, $scope.targets)
								});
							}
						}
					};
				} else {
					return function() {};
				}
			};
			
			var activities = {
				ANY: {
					state: states.INDEX,
				},
				POSTING: {
					state: states.POSTINGS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
				},
				COMMENT: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				COMMENT_SUB: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				MESSAGE: {
					state: states.CONVERSATION
				},
				APPRECIATION_POSTING: {
					state: states.POSTINGS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
				},
				APPRECIATION_COMMENT: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				APPRECIATION_ATTEMPT: {
					state: states.SETTINGS
				},
				PROMOTION_POSTING: {
					state: states.POSTINGS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
				},
				PROMOTION_COMMENT: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				OFFER: {
					state: states.OFFERS
				},
				OFFER_ACCEPT: {
					state: states.USERS_ID
				},
				OFFER_WITHDRAW: {
					state: states.USERS_ID
				},
				OFFER_DENY: {
					state: states.USERS_ID
				},
				BACKING_CANCEL: {
					state: states.USERS_ID
				},
				BACKING_WITHDRAW: {
					state: states.USERS_ID
				},
				FOLLOW_ADD: {
					state: states.USERS_ID,
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyUser.user(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.TARGET]);
						};
					},*/
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.TARGET], getSuccess, getError, getError);
					},
					view: partials.USER
				},
				FOLLOW_REMOVE: {
					state: states.USERS_ID,
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyUser.user(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.TARGET]);
						};
					},*/
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.TARGET], getSuccess, getError, getError);
					},
					view: partials.USER
				},
				POSTING_INFRINGEMENT: {
					state: states.POSTINGS_ID
				},
				COMMENT_INFRINGEMENT: {
					state: states.COMMENTS_ID
				}
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.event = s.getSingleMain();
					$scope.subData = {};
					if(!ng.isDefined($scope.event.type)) {
						return;
					}
					i18n(function(t) {
						$scope.targets = $scope.event.targets;
						
						if($scope.targets.type === 'POSTING') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.posting');
						} else if($scope.targets.type === 'USER') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.user');
						} else if($scope.targets.type === 'TAG') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.tag');
						}
						
						$scope.targetIds = $scope.event.targetIds;
						if(typeof($scope.targetIds[pathVars.USER]) === 'undefined') {
							$scope.targetIds[pathVars.USER] = $scope.targetIds[pathVars.TARGET];
						}

						$scope.title = t('shared:activityTypes.' + $scope.event.type, $scope.targets);
						$scope.timeSince = utils.getTimeSince($scope.event.occurred);
						$scope.calendar = utils.getCalendarDate($scope.event.occurred);
						
						var activity = activities[$scope.event.type];
						$scope.click = undefined;
						if(ng.isDefined(activity)) {
							$scope.link = $state.href(activity.state, $scope.targetIds);
							if((ng.isDefined(activity.method) || ng.isDefined(activity.getData)) && ng.isDefined(activity.view)) {
								$scope.click = getData(activity);
								if($scope.single.autoLoad) {
									var timeout = 0;
									var index = $scope.$parent[scopeVars.INDEX];
									if(ng.isDefined(index) && index > 0) {
										timeout = index * values.AUTOLOAD_TIMEOUT_MULTIPLIER;
									}
									$timeout(function() {
										$scope.click();
									}, timeout);
								}
							}
						} else {
							$scope.link = $state.href(states.INDEX, $scope.targetIds);
						}
						
					});
				}
			};
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
			
		}
	]);
	controller.controller('NotificationController', ['$scope', '$state', '$parse', '$timeout', 'ApiData', 'pyPosting', 'pyComment', 'User',
		function($scope, $state, $parse, $timeout, ApiData, pyPosting, pyComment, User) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope[scopeVars.SINGLE] = 'subData.single';
			
			var getSuccess = function(callback) {
				return function(code, dto, p) {
					$scope.loadingSubSingle = false;
					return callback(code, dto, p);
				};
			};
			
			var getError = function(error, a) {
				return function(code, dto) {
					i18n(function(t) {
						$scope.loadingSubSingle = false;
						$scope.subSingleAlert = t('alerts:pageableErrors.sub');
						if(ng.isDefined(a)) {
							$scope.subSingleAlert = t(a);
						}
					});
					$scope.subData = {};
					error(code, dto);
				};
			};
			
			var getData = function(activity) {
				if(ng.isDefined(activity) && ng.isDefined(activity.view) && (ng.isDefined(activity.method) || ng.isDefined(activity.getData))) {
					return function() {
						$scope.subSingleAlert = undefined;
						if(ng.isDefined($scope.subData) && ng.isDefined($scope.subData.single)) {
							$scope.subData = {};
						} else {
							$scope.loadingSubSingle = true;
							if(ng.isDefined(activity.getData)) {
								$scope.subData = activity.getData($scope.targetIds, $scope.targets);
							} else {
								$scope.subData = ApiData.getData({
									scope: $scope,
									view: activity.view,
									method: activity.method($scope.targetIds, $scope.targets)
								});
							}
						}
					};
				} else {
					return function() {};
				}
			};
			
			var activities = {
				ANY: {
					state: states.INDEX,
				},
				POSTING: {
					state: states.POSTINGS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
				},
				COMMENT: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				COMMENT_SUB: {
					state: states.COMMENTS_ID,
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
				},
				MESSAGE: {
					state: states.CONVERSATION
				},
				APPRECIATION_POSTING: {
					state: states.POSTINGS_ID,
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
					*/
				},
				APPRECIATION_COMMENT: {
					state: states.COMMENTS_ID,
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyComment.comment(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
					*/
				},
				APPRECIATION_ATTEMPT: {
					state: states.SETTINGS
				},
				PROMOTION_POSTING: {
					state: states.POSTINGS_ID,
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.POSTING]);
						};
					},
					view: partials.POSTING
					*/
				},
				PROMOTION_COMMENT: {
					state: states.COMMENTS_ID,
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyPosting.posting(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.COMMENT]);
						};
					},
					view: partials.COMMENT
					*/
				},
				OFFER: {
					state: states.OFFERS
				},
				OFFER_ACCEPT: {
					state: states.USERS_ID
				},
				OFFER_WITHDRAW: {
					state: states.USERS_ID
				},
				OFFER_DENY: {
					state: states.USERS_ID
				},
				BACKING_CANCEL: {
					state: states.USERS_ID
				},
				BACKING_WITHDRAW: {
					state: states.USERS_ID
				},
				FOLLOW_ADD: {
					state: states.USERS_ID,
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyUser.user(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.TARGET]);
						};
					},*/
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
				},
				FOLLOW_REMOVE: {
					state: states.USERS_ID,
					/*
					method: function(targetIds, targets) {
						return function(callback, error, apiError) {
							pyUser.user(getSuccess(callback), getError(error), getError(apiError), targetIds[pathVars.TARGET]);
						};
					},*/
					getData: function(targetIds, targets) {
						return User.user($scope, targetIds[pathVars.USER], getSuccess, getError, getError);
					},
					view: partials.USER
				},
				POSTING_INFRINGEMENT: {
					state: states.POSTINGS_ID
				},
				COMMENT_INFRINGEMENT: {
					state: states.COMMENTS_ID
				}
			};
			
			var updated = function(s) {
				if(ng.isDefined(s) && ng.isDefined(s.getSingleMain())) {
					$scope.single = s;
					$scope.event = s.getSingleMain();
					$scope.subData = {};
					if(!ng.isDefined($scope.event.type)) {
						return;
					}
					i18n(function(t) {
						$scope.targets = $scope.event.targets;
		
						if($scope.targets.type === 'POSTING') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.posting');
						} else if($scope.targets.type === 'USER') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.user');
						} else if($scope.targets.type === 'TAG') {
							$scope.targets.typeRenamed = t('shared:typeRenamed.tag');
						}

						$scope.targetIds = $scope.event.targetIds;
						if(typeof($scope.targetIds[pathVars.USER]) === 'undefined') {
							$scope.targetIds[pathVars.USER] = $scope.targetIds[pathVars.SOURCE];
						}
						
						$scope.title = t('shared:notificationTypes.' + $scope.event.type, $scope.targets);
						$scope.timeSince = utils.getTimeSince($scope.event.occurred);
						$scope.calendar = utils.getCalendarDate($scope.event.occurred);
						
						var activity = activities[$scope.event.type];
						$scope.click = undefined;
						if(ng.isDefined(activity)) {
							$scope.link = $state.href(activity.state, $scope.targetIds);
							if((ng.isDefined(activity.method) || ng.isDefined(activity.getData)) && ng.isDefined(activity.view)) {
								$scope.click = getData(activity);
								if($scope.single.autoLoad) {
									var timeout = 0;
									var index = $scope.$parent[scopeVars.INDEX];
									if(ng.isDefined(index) && index > 0) {
										timeout = index * values.AUTOLOAD_TIMEOUT_MULTIPLIER;
									}
									$timeout(function() {
										$scope.click();
									}, timeout);
								}
							}
						} else {
							$scope.link = $state.href(states.INDEX, $scope.targetIds);
						}
					});
				}
			};
			updated($scope.single);
			
			$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
				if(newValue !== oldValue) {
					updated($parse($scope.$parent[scopeVars.SINGLE])($scope.$parent));
				}
			});
		}
	]);

});