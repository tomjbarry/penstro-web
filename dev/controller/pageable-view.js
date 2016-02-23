define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/states', 'js/constants/path-variables',
				'js/constants/model-attributes', 'js/constants/response-codes', 'js/constants/navigation'],
		function(controller, $, ng, i18n, states, pathVars, modelAttributes, responseCodes, navigation) {
	
	controller.controller('PostingsController', ['$scope', 'Options', 'Loaded', 'Pageable', 'pyPosting',
		function($scope, Options, Loaded, Pageable, pyPosting) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var user;
				var tags;
				
				pyPosting.postingPreviews(callback, error, apiError, number, user, tags);
			};
			Pageable.setMethod(method, number, 'shared:postings', true, false, navigation.content, 'shared:contentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('PostingsByTagController', ['Options', '$stateParams', 'Loaded',
			'Pageable', 'pyPosting',
		function(Options, $stateParams, Loaded, Pageable, pyPosting) {
			var tag = $stateParams[pathVars.TAG];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var user;
				var tags = [tag];
				
				pyPosting.postingPreviews(callback, error, apiError, number, user, tags);
			};
			Pageable.setMethod(method, number, 'shared:taggedPostings', true, false, navigation.tag, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('PostingsByCurrentController', ['Options', 'Loaded', 'Pageable', 'pyPosting',
		function(Options, Loaded, Pageable, pyPosting) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var tags;
				
				pyPosting.currentPostingPreviews(callback, error, apiError, number, tags);
			};
			Pageable.setMethod(method, number, 'shared:authoredPostings', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('CommentsByCurrentController', ['Options', 'Loaded', 'Pageable', 'pyComment',
		function(Options, Loaded, Pageable, pyComment) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyComment.currentCommentPreviews(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:authoredComments', false, false, navigation.current, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('TagsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyTag',
		function($state, Options, Loaded, Pageable, pyTag) {
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
			Pageable.setMethod(method, number, 'shared:tags', true, false, navigation.content, 'shared:contentSelect', search);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('UsersController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyUser',
		function($state, Options, Loaded, Pageable, pyUser) {
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
			Pageable.setMethod(method, number, 'shared:users', true, false, navigation.content, 'shared:contentSelect', search);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('PostingsByAuthorController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyPosting',
		function(Options, $stateParams, Loaded, Single, Pageable, pyPosting) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var tags;
				
				pyPosting.postingPreviews(callback, error, apiError, number, user, tags);
			};
			Pageable.setMethod(method, number, 'shared:authoredPostings', true, false, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('CommentsByAuthorController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var commentTypes;
				
				pyComment.commentPreviews(callback, error, apiError, number, user, commentTypes);
			};
			Pageable.setMethod(method, number, 'shared:authoredComments', true, false, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('CommentsController', ['Options', 'Loaded', 'Pageable', 'pyComment',
		function(Options, Loaded, Pageable, pyComment) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var user, commentTypes;
				
				pyComment.commentPreviews(callback, error, apiError, number, user, commentTypes);
			};
			Pageable.setMethod(method, number, 'shared:comments', true, false, navigation.content, 'shared:contentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('PostingCommentsController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var posting = $stateParams[pathVars.POSTING];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyComment.postingComments(callback, error, apiError, number, posting);
			};
			Pageable.setMethod(method, number, 'shared:replies', true, true);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('UserCommentsController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyComment.userComments(callback, error, apiError, number, user);
			};
			Pageable.setMethod(method, number, 'shared:replies', true, true, navigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('TagCommentsController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var tag = $stateParams[pathVars.TAG];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyComment.tagComments(callback, error, apiError, number, tag);
			};
			Pageable.setMethod(method, number, 'shared:replies', true, true, navigation.tag, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('CommentCommentsController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var comment = $stateParams[pathVars.COMMENT];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyComment.commentComments(callback, error, apiError, number, comment);
			};
			Pageable.setMethod(method, number, 'shared:replies', true, true);
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('CurrentCommentsController', ['Options', '$state', 'Alerts', 'CurrentUser',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $state, Alerts, CurrentUser, Loaded, Single, Pageable, pyComment) {

			var user;
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				if(typeof(user) !== 'undefined') {
					pyComment.userComments(callback, error, apiError, number, user);
				}
			};
			CurrentUser.get(function(currentUser) {
				user = currentUser.username.username;
				Pageable.setMethod(method, number, 'shared:replies', true, true, navigation.current, 'shared:otherContentSelect');
			}, function() {
				i18n(function(t) {
					Alerts.warning(t('alerts:user.repliesError'));
					$state.go(states.CURRENT, undefined, {reload: true});
				});
			});
			Loaded.resetPage(true);
		}
	]);
});