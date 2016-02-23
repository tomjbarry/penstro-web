define(['./module', 'jquery', 'angular', 'admin-js/constants/admin-navigation', 'js/constants/path-variables', 'admin-js/constants/admin-param-values'],
		function(controller, $, ng, adminNavigation, pathVars, adminParamValues) {
	
	controller.controller('AdminUserRepliesController', ['Options', '$stateParams',
			'Loaded', 'Single', 'Pageable', 'pyComment',
		function(Options, $stateParams, Loaded, Single, Pageable, pyComment) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyComment.userComments(callback, error, apiError, number, user);
			};
			Pageable.setMethod(method, number, 'shared:replies', true, true, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserPostingsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaPosting',
		function($state, Options, Loaded, Pageable, pyaPosting) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var tags;
				
				pyaPosting.currentPostings(callback, error, apiError, user, number, tags);
			};
			Pageable.setMethod(method, number, 'shared:authoredPostings', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserCommentsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaComment',
		function($state, Options, Loaded, Pageable, pyaComment) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaComment.currentComments(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:authoredComments', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('RestrictedUsernamesController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaRestricted',
		function($state, Options, Loaded, Pageable, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_USERNAME);
			};
			Pageable.setMethod(method, number, 'shared:restrictedUsernames', false, false, adminNavigation.restricted, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('RestrictedPasswordsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaRestricted',
		function($state, Options, Loaded, Pageable, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_PASSWORD);
			};
			Pageable.setMethod(method, number, 'shared:restrictedPasswords', false, false, adminNavigation.restricted, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('RestrictedEmailsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaRestricted',
		function($state, Options, Loaded, Pageable, pyaRestricted) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaRestricted.getRestricted(callback, error, apiError, number, adminParamValues.RESTRICTED_EMAIL);
			};
			Pageable.setMethod(method, number, 'shared:restrictedEmails', false, false, adminNavigation.restricted, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FlaggedUsersController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFlagged',
		function($state, Options, Loaded, Pageable, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getUsers(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:flaggedUsers', false, false, adminNavigation.flagged, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FlaggedPostingsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFlagged',
		function($state, Options, Loaded, Pageable, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getPostings(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:flaggedPostings', false, false, adminNavigation.flagged, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('FlaggedCommentsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFlagged',
		function($state, Options, Loaded, Pageable, pyaFlagged) {
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFlagged.getComments(callback, error, apiError, number);
			};
			Pageable.setMethod(method, number, 'shared:flaggedComments', false, false, adminNavigation.flagged, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
});