define(['./module', 'jquery', 'angular', 'js/constants/events', 'js/constants/scope-variables', 'js/constants/chained-keys'],
		function(controller, $, ng, events, scopeVars, chainedKeys) {
	controller.controller('SingleController', ['$scope', '$parse',
		function($scope, $parse) {
			$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
			$scope.data = undefined;
			$scope.subData = undefined;
			$scope[scopeVars.SINGLE] = 'single';
			$scope[scopeVars.PAGEABLE] = undefined;
			$scope[scopeVars.INDEX] = $scope.$parent[scopeVars.INDEX];
			
			if(ng.isDefined($scope.$parent[scopeVars.SINGLE])) {
				$scope.$watch('$parent.' + $scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
					if(newValue !== oldValue) {
						$scope.single = $parse($scope.$parent[scopeVars.SINGLE])($scope.$parent);
					}
				});
			}
			
			/*
			$scope.$watch('loaded.content', function(newValue, oldValue) {
				if(newValue === true && shouldScroll === true) {
					$scope.$evalAsync(function() {
						shouldScroll = false;
						$timeout(function() {
							Browser.scrollTo(viewIds.PAGEABLE);
						}, 1);
					});
				}
			});*/
			/*
			$scope.$on(events.SINGLE_CHANGE, function(event, s) {
				if(!event.defaultPrevented) {
					// do not prevent default, as it will be done when caught down the line
					$scope.single = s;
				}
			});
			*/
		}]);
});