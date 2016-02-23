define(['./module', 'jquery', 'angular', 'js/constants/states', 'js/constants/path-variables', 'js/constants/params'],
		function(controller, $, ng, states, pathVars, params) {
	controller.controller('HelpLinkController', ['$scope', '$state',
		function($scope, $state) {
			$scope.init = function(topic, section) {
				if(typeof(topic) === 'undefined') {
					$scope.link = $state.href(states.HELP);
					return;
				}
				
				var p = {};
				p[pathVars.HELP] = topic;
				if(typeof(section) !== 'undefined') {
					p[params.SCROLL_TO] = section;
				}
				$scope.link = $state.href(states.HELP_ID, p);
			};
		}
	]);
	controller.controller('HelpController', ['$rootScope', '$scope', '$location', '$timeout', 'Browser', 'Loaded',
		function($rootScope, $scope, $location, $timeout, Browser, Loaded) {
			$scope.loaded = Loaded;
			
			$scope.$watch('loaded.content', function(newValue, oldValue) {
				var scrollTo = $location.search()[params.SCROLL_TO];
				if(newValue === true && typeof(scrollTo) !== 'undefined' && scrollTo !== '') {
					$scope.$evalAsync(function() {
						$timeout(function() {
							Browser.scrollTo(scrollTo);
						}, 1);
					});
				}
			});
			Loaded.resetInfo(true);
			Loaded.loadedInfo();
		}
	]);
});