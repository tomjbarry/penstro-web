define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/path-variables',
				'js/constants/view-urls', 'js/constants/model-attributes', 'js/constants/params', 'js/constants/content-types', 'js/constants/states'],
		function(controller, $, ng, utils, pathVars, viewUrls, modelAttributes, params, contentTypes, states) {
	
	controller.controller('AdminSinglePostingController', ['$state', '$stateParams', 'Loaded', 'Title', 'Single', 'pyaPosting',
		function($state, $stateParams, Loaded, Title, Single, pyaPosting) {
			var posting = $stateParams[pathVars.POSTING];
			
			var getSuccess = function(callback) {
				return function(code, dto, page) {
					if(!dto.removed) {
						Title.setTitle(dto.title);
					}
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};

			Loaded.resetSingle(true);
			Single.setMethod(contentTypes.POSTING, function(callback, error, apiError) {
				pyaPosting.posting(getSuccess(callback), error, apiError, posting);
			});
		}
	]);
	
	controller.controller('AdminSingleUserController', ['$stateParams', 'Loaded', 'Title', 'Single', 'AUser',
		function($stateParams, Loaded, Title, Single, AUser) {
			var user = $stateParams[pathVars.USER];

			var getSuccess = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			Loaded.resetSingle(true);
			// dont care about following, blocking, or appreciation response. these are separate
			AUser.setUserSingle(user, getSuccess);
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
	
	controller.controller('AdminSingleCommentController', ['$stateParams', 'Loaded', 'Title', 'Single', 'pyaComment',
		function($stateParams, Loaded, Title, Single, pyaComment) {
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
			Single.setMethod(contentTypes.COMMENT, function(callback, error, apiError) {
				pyaComment.comment(getSuccess(callback), error, apiError, comment);
			});
		}
	]);
	
});