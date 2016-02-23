define(["angular",
        "js/constants/whitelist-urls",
        "js/controller/index",
        "js/service/index",
        "js/directive/index",
        "js/filter/index",
        "angular-ui-router",
        "angular-ui-bootstrap",
        "angular-sanitize",
        "angulartics",
        "angularticsClicky"], function(ng, whitelistUrls) {
	'use strict';
	return ng.module('app', ['app.controller',
													'app.service',
													'app.directive',
													'app.filter',
													'app.admin',
													'ui.router',
													'ui.bootstrap',
													'ngSanitize',
													'angulartics',
													'angulartics.clicky']).run(['$rootScope','$state','$stateParams',
		function($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}])
		.config(['$sceDelegateProvider', '$compileProvider', '$provide', '$analyticsProvider',
			function($sceDelegateProvider, $compileProvider, $provide, $analyticsProvider) {
				$sceDelegateProvider.resourceUrlWhitelist(whitelistUrls.URLS);
				
				$provide.decorator('$exceptionHandler', ['$delegate', '$window', function($delegate, $window) {
					var c = $window.pyGetClientConfig();
					if(typeof(c) !== 'undefined' && c.production) {
						return function (exception, cause) {
							//$delegate(exception, cause);
							/*
							if(typeof($window.localStorage) !== 'undefined') { 
								var log = $window.localStorage.getItem('log');
								if(typeof(log) === 'undefined' || log === null) {
									log = '';
								} else {
									log = log + ',';
								}
								//log = log + "{exception: " + exception + ", cause: " + cause + "}";
								//window.pyShowError(exception, cause);
								//TODO: enable this and add some way of removing old log data. either a maximum length or a maximum time.
								//$window.localStorage.setItem('log', log);
							}
							*/
						};
					} else {
						return function (exception, cause) {
							//window.pyShowError(exception, cause);
							$delegate(exception, cause);
						};
					}
				}]);
			}
		]);
});