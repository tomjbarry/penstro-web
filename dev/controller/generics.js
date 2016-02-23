define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils', 'js/constants/path-variables', 'js/constants/states',
				'js/constants/cookies', 'js/constants/params', 'js/constants/response-codes', 'js/constants/events', 'js/constants/tour-states'],
		function(controller, $, ng, i18n, utils, pathVars, states, cookies, params, responseCodes, events, tourStates) {
	controller.controller('AccountController', ['$rootScope', '$scope', '$state', 'Authentication', function($rootScope, $scope, $state, Authentication) {
			var setAuthenticated = function(authenticated) {
				if(authenticated) {
					$state.go(states.DEFAULT, undefined, {reload: true});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			$scope.openLogin = function() {
				$rootScope.$broadcast(events.LOGIN_OPEN);
			};
			$scope.openRegister = function() {
				$rootScope.$broadcast(events.REGISTER_OPEN);
			};
		}
	]);
	controller.controller('HeaderController', ['$scope', 'Title', function($scope, Title) {
			$scope.title = Title;
		}
	]);
	controller.controller('TourController', ['$scope', 'Loaded', 'Tour',
		function($scope, Loaded, Tour) {
			$scope.startTour = function() {
				Tour.start(tourStates.GENERAL.name);
			};
		}
	]);
	controller.controller('SettingsErrorController', ['$scope', '$state', 'Alerts', 'Loaded',
		function($scope, $state, Alerts, Loaded) {
			i18n(function(t) {
				Alerts.error(t('alerts:user.settingsError'));
				$state.go(states.DEFAULT, undefined, {reload: true});
			});
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	controller.controller('DeletedController', ['$scope', '$state', 'Alerts', 'Authentication', 'Reloader', 'Loaded', 'CurrentUser', 'pyProfile',
		function($scope, $state, Alerts, Authentication, Reloader, Loaded, CurrentUser, pyProfile) {

			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			if(!$scope.authenticated) {
				$state.go(states.DEFAULT, undefined, {reload: true});
			}
			
			var success = function(code, dto, page) {
				i18n(function(t) {
					CurrentUser.refreshRoles(function() {
						Alerts.success(t('alerts:deleted.success'));
						$state.go(states.DEFAULT, undefined, {reload: true});
					}, function() {
						Alerts.success(t('alerts:deleted.success'));
						$state.go(states.DEFAULT, undefined, {reload: true});
					});
				});
			};
			
			var error = function(code, dto) {
				i18n(function(t) {
					if(code === responseCodes.NOT_ALLOWED) {
						Alerts.warning(t('alerts:deleted.notAllowed'));
					} else {
						Alerts.error(t('alerts:deleted.error'));
					}
				});
			};
			
			var api = function() {
				i18n(function(t) {
					Alerts.error(t('alerts:deleted.apiError'));
				});
			};
			
			$scope.undelete = function($event) {
				if($scope.authenticated) {
					pyProfile.undelete(success, error, api);
				}
			};
			
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
	
	controller.controller('ContentLoaderController', ['$rootScope', '$scope', 'Loaded',
		function($rootScope, $scope, Loaded) {
			$scope.loaded = Loaded;
		}
	]);
	
	controller.controller('ExternalUrlController', ['$rootScope', '$scope', '$location', 'Loaded',
	    function($rootScope, $scope, $location, Loaded) {
			var externalUrl = $location.search()[params.EXTERNAL_URL];
		
			if(typeof(externalUrl) === 'undefined') {
				externalUrl = '';
			}/*
			try {
				$scope.externalUrl = decodeURIComponent(externalUrl);
			} catch(e) {
				// do nothing, it wasnt encoded properly
			}*/
			$scope.externalUrl = externalUrl;
			
			$scope.back = function() {
				$rootScope.$broadcast(events.BACK);
			};
		
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
});