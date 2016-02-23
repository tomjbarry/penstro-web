define(['./module', 'jquery', 'angular', 'js/constants/path-variables', 'admin-js/constants/admin-navigation'],
		function(controller, $, ng, pathVars, adminNavigation) {
	
	controller.controller('AdminUserActivityController', ['Options', '$stateParams', 'Loaded',
			'Pageable', 'pyEvent',
		function(Options, $stateParams, Loaded, Pageable, pyEvent) {
			var user = $stateParams[pathVars.USER];
			
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyEvent.userFeed(callback, error, apiError, user, number, events);
			};
			Pageable.setMethod(method, number, 'shared:activity', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserFollowersController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFollow',
		function($state, Options, Loaded, Pageable, pyaFollow) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyaFollow.followers(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:followers', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserFolloweesController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFollow',
		function($state, Options, Loaded, Pageable, pyaFollow) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaFollow.followees(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:followees', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserFeedController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaUser',
		function($state, Options, Loaded, Pageable, pyaUser) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyaUser.feed(callback, error, apiError, user, number, events);
			};
			
			Pageable.setMethod(method, number, 'shared:feed', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserNotificationsController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaUser',
		function($state, Options, Loaded, Pageable, pyaUser) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				var events;
				
				pyaUser.notifications(callback, error, apiError, user, number, events);
			};
			
			Pageable.setMethod(method, number, 'shared:notifications', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	/*
	controller.controller('AdminUserOffersController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaBacker',
		function($state, Options, Loaded, Pageable, pyaBacker) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyaBacker.offers(callback, error, apiError, user, number);
			};
			
			Pageable.setMethod(method, number, 'shared:offers', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserOffeesController', ['$state', '$scope', 'Options', 'Loaded', 'Pageable', 'pyaBacker',
		function($state, $scope, Options, Loaded, Pageable, pyaBacker) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaBacker.offees(callback, error, apiError, user, number);
			};
			
			Pageable.setMethod(method, number, 'shared:offees', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserOffeesEmailController', ['$state', '$scope', 'Options', 'Loaded', 'Pageable', 'pyaBacker',
		function($state, $scope, Options, Loaded, Pageable, pyaBacker) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaBacker.emailOffees(callback, error, apiError, user, number);
			};
			
			Pageable.setMethod(method, number, 'shared:emailOffees', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserBackersController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaBacker',
		function($state, Options, Loaded, Pageable, pyaBacker) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				pyaBacker.backers(callback, error, apiError, user, number);
			};
			
			Pageable.setMethod(method, number, 'shared:backers', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	
	controller.controller('AdminUserBackeesController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaBacker',
		function($state, Options, Loaded, Pageable, pyaBacker) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyaBacker.backees(callback, error, apiError, user, number);
			};
			
			Pageable.setMethod(method, number, 'shared:backees', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
	*/
	controller.controller('AdminUserBlockedController', ['$state', 'Options', 'Loaded', 'Pageable', 'pyaFollow',
		function($state, Options, Loaded, Pageable, pyaFollow) {
			var user = $state.params[pathVars.USER];
			var number = Options.getPage();
			var method = function(number, callback, error, apiError) {
				
				pyaFollow.blocked(callback, error, apiError, user, number);
			};
			Pageable.setMethod(method, number, 'shared:blocked', false, false, adminNavigation.user, 'shared:otherContentSelect');
			Loaded.resetPage(true);
		}
	]);
});