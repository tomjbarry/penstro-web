define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n', 'js/constants/states', 'js/constants/path-variables',
				'js/constants/scope-variables', 'js/constants/model-attributes', 'js/constants/response-codes', 'js/constants/navigation',
				'js/constants/partials', 'js/constants/values', 'js/constants/events'],
		function(controller, $, ng, utils, i18n, states, pathVars, scopeVars, modelAttributes, responseCodes, navigation, partials, values, events) {
	
	controller.controller('PostingsController', ['$scope', 'Options', 'ApiData', 'pyPosting',
		function($scope, Options, ApiData, pyPosting) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var user;
				var tags;
				
				pyPosting.postingPreviews(callback, error, apiError, number, user, tags);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.POSTING,
				method: method,
				number: number,
				title: 'shared:postings',
				time: true,
				asReplies: false,
				alternatives: navigation.content,
				alternativesLabel: 'shared:contentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('CommentsController', ['$scope', 'Options', 'ApiData', 'pyComment',
		function($scope, Options, ApiData, pyComment) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var user, commentTypes;
				pyComment.commentPreviews(callback, error, apiError, number, user, commentTypes);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.COMMENT,
				method: method,
				number: number,
				title: 'shared:comments',
				time: true,
				asReplies: false,
				alternatives: navigation.content,
				alternativesLabel: 'shared:contentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('TagsController', ['$scope', '$state', 'ApiData', 'Options', 'pyTag',
		function($scope, $state, ApiData, Options, pyTag) {
			var search = {disabled: false, searchLabel: 'shared:tagSearch.search', model: undefined, search: undefined, alert: undefined, symbol:'shared:symbols.tag'};
			var success = function(code, dto, p) {
				search.disabled = false;
				var pa = {};
				pa[pathVars.TAG] = dto.name;
				$state.go(states.TAGS_ID, pa, {reload: true});
			};
			
			var error = function(code, dto) {
				i18n(function(t) {
					search.disabled = false;
					if(code === responseCodes.NOT_FOUND) {
						search.alert = t('shared:tagSearch.notFoundTag', {tag: search.model});
					} else if(code === responseCodes.NOT_ALLOWED) {
						search.alert = t('shared:tagSearch.notAllowedTag', {tag: search.model});
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
				pyTag.tag(success, error, api, search.model);
			};
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyTag.tagPreviews(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.TAG,
				method: method,
				number: number,
				title: 'shared:tags',
				time: true,
				asReplies: false,
				alternatives: navigation.content,
				alternativesLabel: 'shared:contentSelect',
				addSearch: search,
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('UsersController', ['$scope', '$state', 'ApiData', 'Options', 'User', 'pyUser',
		function($scope, $state, ApiData, Options, User, pyUser) {
			var search = {disabled: false, searchLabel: 'shared:userSearch.search', model: undefined, search: undefined, alert: undefined, symbol:'shared:symbols.username'};
			var success = function(code, dto, p) {
				search.disabled = false;
				var pa = {};
				pa[pathVars.USER] = dto.username.username;
				$state.go(states.USERS_ID, pa, {reload: true});
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
				pyUser.userPreviews(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.USER,
				method: method,
				number: number,
				title: 'shared:users',
				time: true,
				asReplies: false,
				alternatives: navigation.content,
				alternativesLabel: 'shared:contentSelect',
				addSearch: search,
				chained: User.userChained,
				callChained: true,
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('ConversationsController', ['$scope', '$state', 'ApiData', 'Options', 'pyMessage', 'pyUser',
		function($scope, $state, ApiData, Options, pyMessage, pyUser) {
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
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.CONVERSATION,
				method: method,
				number: number,
				title: 'shared:conversations',
				time: false,
				asReplies: false,
				addSearch: search,
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('MessagesController', ['$stateParams', '$scope', '$state', 'Alerts', 'Authentication', 'ApiData', 'Options',
			'AutoRefresh', 'CurrentUser', 'pyMessage',
		function($stateParams, $scope, $state, Alerts, Authentication, ApiData, Options, AutoRefresh, CurrentUser, pyMessage) {
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
			
			var success = function(code, dto, page) {
				if(page.totalElements > $scope.data.pageable.getPage().length) {
					return true;
				}
				return false;
			};
			
			var error = function() {return false;};
			
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.MESSAGE,
				method: method,
				number: number,
				title: 'shared:messages',
				time: false,
				asReplies: false,
				scroll: true
			});
			
			var refresh = function() {
				if($scope.data.pageable.loaded.current && $scope.refresh) {
					$scope.data.pageable.conditionalRefresh(0, success, error, error, true);
				}
			};
			
			$scope.$on(events.TOGGLE_AUTO_REFRESH, function(event, on) {
				$scope.refresh = on;
				if(on) {
					refresh();
				}
			});
			
			AutoRefresh.manageRefresh(refresh, values.CONVERSATION_REFRESH, undefined, undefined, undefined, $scope);
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('FeedController', ['$scope', 'ApiData', 'Options', 'pyEvent',
		function($scope, ApiData, Options, pyEvent) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.feed(callback, error, apiError, number, events);
			};
			
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.ACTIVITY,
				method: method,
				number: number,
				title: 'shared:feed',
				time: false,
				autoLoad: true,
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('NotificationsController', ['$scope', 'ApiData', 'Options', 'pyEvent',
		function($scope, ApiData, Options, pyEvent) {
		
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.notifications(callback, error, apiError, number, events);
			};
			
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: partials.NOTIFICATION,
				method: method,
				number: number,
				title: 'shared:notifications',
				time: false,
				autoLoad: true,
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('SinglePostingController', ['$scope', '$state', '$stateParams', '$location', 'ApiData', 'Title', 'Options', 'pyPosting',
		function($scope, $state, $stateParams, $location, ApiData, Title, Options, pyPosting) {
			var posting = $stateParams[pathVars.POSTING];
			
			var setTitle = function(title) {
				Title.setTitle(title);
				if(($state.is(states.POSTINGS_ID) || $state.is(states.POSTINGS_ID_TITLE)) && typeof(title) !== 'undefined') {
					var args = {};
					args[pathVars.POSTING] = posting;
					args[pathVars.TITLE] = utils.getEncodedTitle(title);
					var path = $state.href(states.POSTINGS_ID_TITLE, args);
					$location.path(path).replace();
				}
			};
			
			var getSuccess = function(callback) {
				return function(code, dto, page) {
					if(!dto.removed) {
						setTitle(dto.title);
					}
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
		
			var method = function(callback, error, apiError) {
				pyPosting.posting(getSuccess(callback), error, apiError, posting);
			};
			var number = Options.getPage();
			var pageableMethod = function(number, callback, error, apiError) {
				var user;
				var tags;
				
				pyPosting.postingPreviews(callback, error, apiError, number, user, tags);
			};
			$scope.data = ApiData.getData({
				scope: $scope,
				view: partials.POSTING,
				method: method,
				//autoSub: true,
				autoSub: false,
				args: {
					state: $state.current.name
				}
			},
			{
				scope: $scope,
				view: partials.POSTING,
				method: pageableMethod,
				number: number,
				title: 'shared:postings',
				time: false,
				asReplies: false,
				scroll: false,
				showMore: posting
			});
			
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
		
	controller.controller('SingleTagController', ['$scope', '$state', '$stateParams', 'ApiData', 'Title', 'Options', 'pyTag',
		function($scope, $state, $stateParams, ApiData, Title, Options, pyTag) {
			var tag = $stateParams[pathVars.TAG];
			
			var getSuccess = function(callback) {
				return function(code, dto, page) {
					Title.setTitle('tagTag', true, {tag: dto.name});
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			var method = function(callback, error, apiError) {
				pyTag.tag(getSuccess(callback), error, apiError, tag);
			};
		
			var number = Options.getPage();
			var pageableMethod = function(number, callback, error, apiError) {
				pyTag.tagPreviews(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData({
				scope: $scope,
				view: partials.TAG,
				method: method,
				autoSub: true,
				args: {
					state: $state.current.name
				}
			});
			
			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
		
	controller.controller('SingleUserController', ['$scope', '$state', '$stateParams', 'ApiData', 'Title', 'Options', 'User', 'pyUser',
		function($scope, $state, $stateParams, ApiData, Title, Options, User, pyUser) {
			var user = $stateParams[pathVars.USER];
		
			var success = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			$scope.data = User.user($scope, user, success, undefined, undefined, true, {state: $state.current.name});

			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
		
	controller.controller('SingleCurrentController', ['$scope', '$state', '$stateParams', 'Title', 'User',
		function($scope, $state, $stateParams, Title, User) {
		
			var success = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			$scope.data = User.self($scope, success, undefined, undefined, true, {state: $state.current.name});

			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
		
	controller.controller('SingleCommentController', ['$scope', '$state', '$stateParams', 'ApiData', 'Title', 'Options', 'pyComment',
		function($scope, $state, $stateParams, ApiData, Title, Options, pyComment) {
			var comment = $stateParams[pathVars.COMMENT];
			
			var getSuccess = function(callback) {
				return function(code, dto, page) {
					Title.setTitle('commentUser', true, {user: dto.author.username});
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			var method = function(callback, error, apiError) {
				pyComment.comment(getSuccess(callback), error, apiError, comment);
			};
			var number = Options.getPage();
			var pageableMethod = function(number, callback, error, apiError) {
				var user, commentTypes;
				pyComment.commentPreviews(callback, error, apiError, number, user, commentTypes);
			};
			
			$scope.data = ApiData.getData({
				scope: $scope,
				view: partials.COMMENT,
				method: method,
				autoSub: true,
				args: {
					state: $state.current.name
				}
			});
			$scope[scopeVars.SINGLE] = 'data.single';
		}]);
});