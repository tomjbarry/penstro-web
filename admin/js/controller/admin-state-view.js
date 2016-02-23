define(['./module', 'jquery', 'angular', 'admin-js/constants/admin-navigation', 'js/constants/path-variables', 'admin-js/constants/admin-param-values',
        'admin-js/constants/admin-partials', 'js/constants/partials', 'js/constants/scope-variables'],
		function(controller, $, ng, adminNavigation, pathVars, adminParamValues, adminPartials, partials, scopeVars) {
	
	controller.controller('RestrictedUsernamesController', ['$state', '$scope', 'Options', 'ApiData', 'pyaRestricted',
		function($state, $scope, Options, ApiData, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_USERNAME);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.RESTRICTED,
				method: method,
				number: number,
				title: 'shared:restrictedUsernames',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.restricted,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('RestrictedPasswordsController', ['$state', '$scope', 'Options', 'ApiData', 'pyaRestricted',
    function($state, $scope, Options, ApiData, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_PASSWORD);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.RESTRICTED,
				method: method,
				number: number,
				title: 'shared:restrictedPasswords',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.restricted,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('RestrictedEmailsController', ['$state', '$scope', 'Options', 'ApiData', 'pyaRestricted',
		function($state, $scope, Options, ApiData, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_EMAIL);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.RESTRICTED,
				method: method,
				number: number,
				title: 'shared:restrictedEmails',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.restricted,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('FlaggedUsersController', ['$state', '$scope', 'Options', 'ApiData', 'pyaFlagged',
		function($state, $scope, Options, ApiData, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getUsers(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.FLAGGED,
				method: method,
				number: number,
				title: 'shared:flaggedUsers',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.flagged,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('FlaggedPostingsController', ['$state', '$scope', 'Options', 'ApiData', 'pyaFlagged',
		function($state, $scope, Options, ApiData, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getPostings(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.FLAGGED,
				method: method,
				number: number,
				title: 'shared:flaggedPostings',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.flagged,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('FlaggedCommentsController', ['$state', '$scope', 'Options', 'ApiData', 'pyaFlagged',
		function($state, $scope, Options, ApiData, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getComments(callback, error, apiError, number);
			};
			$scope.data = ApiData.getData(undefined,
			{
				scope: $scope,
				view: adminPartials.FLAGGED,
				method: method,
				number: number,
				title: 'shared:flaggedComments',
				time: false,
				asReplies: false,
				alternatives: adminNavigation.flagged,
				alternativesLabel: 'shared:otherContentSelect',
				scroll: true
			});
			$scope[scopeVars.PAGEABLE] = 'data.pageable';
		}
	]);
	
	controller.controller('AdminSingleUserController', ['$scope', '$state', '$stateParams', 'Title', 'AUser',
		function($scope, $state, $stateParams, Title, AUser) {
			var user = $stateParams[pathVars.USER];
		
			var success = function(callback) {
				return function(code, dto, page) {
					Title.setTitle(dto.username.username);
					if(typeof(callback) !== 'undefined') {
						callback(code, dto, page);
					}
				};
			};
			
			$scope.data = AUser.user($scope, user, success, undefined, undefined, true, {state: $state.current.name});
	
			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
	
	controller.controller('AdminSinglePostingController', ['$scope', '$state', '$stateParams', '$location', 'ApiData', 'Title', 'pyaPosting',
		function($scope, $state, $stateParams, $location, ApiData, Title, pyaPosting) {
			var posting = $stateParams[pathVars.POSTING];
			
			var setTitle = function(title) {
				Title.setTitle(title);
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
				pyaPosting.posting(getSuccess(callback), error, apiError, posting);
			};
			
			$scope.data = ApiData.getData({
				scope: $scope,
				view: adminPartials.POSTING,
				method: method,
				autoSub: true,
				args: {
					state: $state.current.name
				}
			});
			$scope[scopeVars.SINGLE] = 'data.single';
		}
	]);
		
	controller.controller('AdminSingleCommentController', ['$scope', '$state', '$stateParams', 'ApiData', 'Title', 'pyaComment',
		function($scope, $state, $stateParams, ApiData, Title, pyaComment) {
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
				pyaComment.comment(getSuccess(callback), error, apiError, comment);
			};
			
			$scope.data = ApiData.getData({
				scope: $scope,
				view: adminPartials.COMMENT,
				method: method,
				autoSub: true,
				args: {
					state: $state.current.name
				}
			});
			$scope[scopeVars.SINGLE] = 'data.single';
		}]);
});