define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/path-variables',
				'js/constants/view-urls', 'js/constants/model-attributes', 'js/constants/params', 'js/constants/content-types', 'js/constants/states'],
		function(controller, $, ng, utils, pathVars, viewUrls, modelAttributes, params, contentTypes, states) {
	
	controller.controller('SinglePostingController', ['$state', '$stateParams', '$location', 'Loaded', 'Title', 'Single', 'pyPosting',
		function($state, $stateParams, $location, Loaded, Title, Single, pyPosting) {
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

			Loaded.resetSingle(true);
			if(Single.stale()) {
				Single.setMethod(contentTypes.POSTING, function(callback, error, apiError) {
					pyPosting.posting(getSuccess(callback), error, apiError, posting);
				});
			} else {
				var s = Single.getSingle();
				var p = Single.getSingleMain(s);
				if(typeof(p) !== 'undefined') {
					if(!p.removed) {
						setTitle(p.title);
					}
				}
				Loaded.loadedSingle();
			}
		}
	]);
	
	controller.controller('SingleTagController', ['$stateParams', 'Loaded', 'Title', 'Single', 'pyTag',
		function($stateParams, Loaded, Title, Single, pyTag) {
			var tag = $stateParams[pathVars.TAG];
			
			var getSuccess = function(callback) {
				return function(code, dto, page) {
					Title.setTitle('tagTag', true, {tag: dto.name});
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			Loaded.resetSingle(true);
			if(Single.stale()) {
				Single.setMethod(contentTypes.TAG, function(callback, error, apiError) {
					pyTag.tag(getSuccess(callback), error, apiError, tag);
				});
			} else {
				var s = Single.getSingle();
				var p = Single.getSingleMain(s);
				if(typeof(p) !== 'undefined') {
					Title.setTitle('tagTag', true, {tag: p.name});
				}
				Loaded.loadedSingle();
			}
		}
	]);
	
	controller.controller('SingleUserController', ['$stateParams', 'Loaded', 'Title', 'Single', 'User',
		function($stateParams, Loaded, Title, Single, User) {
			var user = $stateParams[pathVars.USER];

			var success = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			Loaded.resetSingle(true);
			User.setUserSingle(user, success);
			if(!Single.stale()) {
				var s = Single.getSingle();
				var p = Single.getSingleMain(s);
				if(typeof(p) !== 'undefined') {
					Title.setTitle(p.username.username);
				}
				Loaded.loadedSingle();
			}
		}
	]);
	
	controller.controller('SingleCurrentController', ['$stateParams', 'Loaded', 'Title', 'Single', 'User',
		function($stateParams, Loaded, Title, Single, User) {

			var success = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			Loaded.resetSingle(true);
			User.setSelfSingle(success);
			if(!Single.stale()) {
				var s = Single.getSingle();
				var p = Single.getSingleMain(s);
				if(typeof(p) !== 'undefined') {
					Title.setTitle(p.username.username);
				}
				Loaded.loadedSingle();
			}
		}
	]);
	
	controller.controller('SingleCommentController', ['$stateParams', 'Loaded', 'Title', 'Single', 'pyComment',
		function($stateParams, Loaded, Title, Single, pyComment) {
			var comment = $stateParams[pathVars.COMMENT];

			var getSuccess = function(callback) {
				return function(code, dto, page) {
					Title.setTitle('commentUser', true, {user: dto.author.username});
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			Loaded.resetSingle(true);
			if(Single.stale()) {
				Single.setMethod(contentTypes.COMMENT, function(callback, error, apiError) {
					pyComment.comment(getSuccess(callback), error, apiError, comment);
				});
			} else {
				var s = Single.getSingle();
				var p = Single.getSingleMain(s);
				if(typeof(p) !== 'undefined') {
					Title.setTitle('commentUser', true, {user: p.author.username});
				}
				Loaded.loadedSingle();
			}
		}
	]);
	
});