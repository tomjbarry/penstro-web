define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/path-variables', 'js/constants/model-attributes',
        'js/constants/params', 'js/constants/param-values', 'js/constants/values', 'js/constants/events', 'js/constants/states',
        'js/constants/response-codes', 'js/constants/navigation'],
		function(controller, $, ng, i18n, pathVars, modelAttributes, params, paramValues, values, events, states, responseCodes, navigation) {
	
	controller.controller('ActivityByUserController', ['Options', '$stateParams', 'Loaded',
			'Pageable', 'pyEvent',
		function(Options, $stateParams, Loaded, Pageable, pyEvent) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.userFeed(callback, error, apiError, user, number, events);
			};
			Pageable.setMethod(method, number, 'shared:activity', false, false, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('ActivityByCurrentController', ['Options', '$stateParams', 'Alerts', 'CurrentUser', 'Loaded',
		'Pageable', 'pyEvent',
		function(Options, $stateParams, Alerts, CurrentUser, Loaded, Pageable, pyEvent) {
			var number = Options.getPage();
			var user;
			var method = function(number, callback, error, apiError) {
				var events;
				if(typeof(user) !== 'undefined') {
					pyEvent.userFeed(callback, error, apiError, user, number, events);
				}
			};
			var errorMethod = function(number, callback, error, apiError) {
				apiError();
			};
			CurrentUser.get(function(current) {
				user = current.username.username;
				Pageable.setMethod(method, number, 'shared:activity', false, false, navigation.current, 'shared:otherContentSelect');
			},
			function() {
				Pageable.setMethod(errorMethod, number, 'shared:activity', false, false, navigation.current, 'shared:otherContentSelect');
			});
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FollowersByUserController', ['Options', '$stateParams', 'Loaded',
			'Pageable', 'pyFollow',
		function(Options, $stateParams, Loaded, Pageable, pyFollow) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyFollow.userFollowers(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:followers', false, false, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FolloweesByUserController', ['Options', '$stateParams', 'Loaded',
			'Pageable', 'pyFollow',
		function(Options, $stateParams, Loaded, Pageable, pyFollow) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyFollow.userFollowees(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:followees', false, false, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FollowersController', ['Options', 'Loaded', 'Pageable', 'pyFollow',
		function(Options, Loaded, Pageable, pyFollow) {
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyFollow.followers(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:followers', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FolloweesController', ['Options', 'Loaded', 'Pageable', 'pyFollow',
		function(Options, Loaded, Pageable, pyFollow) {
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyFollow.followees(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:followees', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('ConversationsController', ['$scope', '$state', 'Options', 'Loaded',
			'Pageable', 'pyMessage', 'pyUser',
		function($scope, $state, Options, Loaded, Pageable, pyMessage, pyUser) {
			var search = {disabled: false, searchLabel: 'shared:userSearch.search', model: undefined, search: undefined,
					alert: undefined, symbol:'shared:symbols.username'};
			var success = function(code, dto, p) {
				search.disabled = false;
				var params = {};
				params[pathVars.USER] = dto.username.username;
				$state.go(states.USERS_ID_MESSAGES, params, {reload: true});
			};
			
			var error = function(code, dto) {
				i18n(function(t) {
					search.disabled = false;
					if(code === responseCodes.NOT_FOUND) {
						search.alert = t('shared:userSearch.notFoundUser', {user: search.model});
					} else if(code === responseCodes.NOT_ALLOWED) {
						search.alert = t('shared:userSearch.notAllowedUser', {user: search.model});
					} else {
						search.alert = t('alerts:apiError');
					}
				});
			};
			var api = function() {
				i18n(function(t) {
					search.disabled = false;
					search.alert = t('alerts:apiError');
				});
			};
			
			search.search = function() {
				search.error = undefined;
				if(typeof(search.model) === 'undefined' || search.model.length === 0) {
					return;
				}
				search.disabled = true;
				pyUser.user(success, error, api, search.model);
			};
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyMessage.conversations(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:conversations', false, false, undefined, undefined, search);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('MessagesController', ['$rootScope', '$stateParams', '$scope', '$state', 'Alerts', 'Authentication', 'Options', 'Loaded',
			'Pageable', 'AutoRefresh', 'CurrentUser', 'pyMessage',
		function($rootScope, $stateParams, $scope, $state, Alerts, Authentication, Options, Loaded, Pageable, AutoRefresh, CurrentUser, pyMessage) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			$scope.refresh = true;
			var method = function(number, callback, error, apiError) {
				pyMessage.messages(callback, error, apiError, user, number);
			};

			var setAuthenticated = function(authenticated) {
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						var currentUsername = currentUser.username.username;
						if(currentUsername === user) {
							i18n(function(t) {
								Alerts.warning(t('alerts:navigation.self.messages'));
								$state.go(states.USERS_ID, $stateParams, {reload: true});
							});
						}
					}, function() {
						i18n(function(t) {
							Alerts.warning(t('alerts:apiError'));
							$state.go(states.USERS_ID, $stateParams, {reload: true});
						});
					});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());

			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			Pageable.setMethod(method, number, 'shared:messages', false);
			Loaded.resetPage(true);
			
			var success = function(code, dto, page) {
				if(page.totalElements > Pageable.getPage().length) {
					return true;
				}
				return false;
			};
			
			var error = function() {return false;};
			
			$scope.$on('$destroy', function(event) {
				$rootScope.$broadcast(events.destroy('MessagesController'));
			});
			
			AutoRefresh.manageRefresh(function() {
				// check if pageable has received its first success yet
				// check if user has enabled refresh
				if(Loaded.page.current && $scope.refresh) {
					Pageable.conditionalRefresh(Options.getPage(), success, error, error, true);
				}
			}, values.CONVERSATION_REFRESH, events.destroy('MessagesController'));
		}
	]);
	
	controller.controller('FeedController', ['Options', 'Loaded', 'Pageable', 'pyEvent',
		function(Options, Loaded, Pageable, pyEvent) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.feed(callback, error, apiError, number, events);
			};
			
			Pageable.setMethod(method, number, 'shared:feed', false);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('NotificationsController', ['Options', 'Loaded', 'Pageable', 'pyEvent',
		function(Options, Loaded, Pageable, pyEvent) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.notifications(callback, error, apiError, number, events);
			};
			
			Pageable.setMethod(method, number, 'shared:notifications', false);
			Loaded.resetPage(true);
		}
	]);
	/*
	controller.controller('OffersController', ['Options', 'Loaded', 'Pageable', 'pyOffer',
		function(Options, Loaded, Pageable, pyOffer) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyOffer.offers(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:offers', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('OffeesController', ['$scope', 'Options', 'Loaded', 'Pageable', 'pyOffer',
		function($scope, Options, Loaded, Pageable, pyOffer) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyOffer.offees(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:offees', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('OffeesEmailController', ['$scope', 'Options', 'Loaded', 'Pageable', 'pyOffer',
		function($scope, Options, Loaded, Pageable, pyOffer) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyOffer.emailOffees(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:emailOffees', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('BackersController', ['Options', 'Loaded', 'Pageable', 'pyBacker',
		function(Options, Loaded, Pageable, pyBacker) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyBacker.backers(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:backers', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('BackeesController', ['Options', 'Loaded', 'Pageable', 'pyBacker',
		function(Options, Loaded, Pageable, pyBacker) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyBacker.backees(callback, error, apiError, number);
			};
			
			Pageable.setMethod(method, number, 'shared:backees', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	*/
	controller.controller('BlockedController', ['Options', 'Loaded', 'Pageable', 'pyBlock',
		function(Options, Loaded, Pageable, pyBlock) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyBlock.blocked(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:blocked', false);
			Loaded.resetPage(true);
		}
	]);
});