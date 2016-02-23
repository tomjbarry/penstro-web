define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/events', 'js/constants/view-ids', 'js/constants/scope-variables'],
		function(controller, $, ng, i18n, events, viewIds, scopeVars) {
	
	controller.controller('PageableController', ['$scope', '$parse', '$state', '$timeout', 'Alerts', 'Browser', 'Options',
	function($scope, $parse, $state, $timeout, Alerts, Browser, Options) {
		var pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
		
		$scope.pageable = pageable;
		$scope[scopeVars.PAGEABLE] = 'pageable';
		
		var loadedOnce = false;
		var scrolled = false;
		//var searchDefault = {search: function(){}, show: false};
		
		var pageChanged = function(pageable, num) {
			if(ng.isDefined(pageable)) {
				$scope.pageable = pageable;
				/*
				$scope.pageable = pageable;
				$scope.alternativesOpen = false;
				$scope.alternativesCurrent = undefined;
				$scope.time = pageable.getTimeSorted();
				$scope.timeReplies = pageable.getTimeRepliesSorted();
				var alternatives = pageable.getAlternatives();
				var search = pageable.getSearch();
				$scope.search = $scope.searchDefault;
				$scope.searchLabel = undefined;
				$scope.searchSymbol = undefined;
				$scope.showSearch = false;
				$scope.submitSearch = function(){};
				var active, altName, icon;
				$scope.altActive = undefined;
				$scope.altIcon = undefined;
				$scope.alternatives = [];
				*/
				var active, altName, icon;
				var alternatives = pageable.getAlternatives();
				$scope.alternatives = [];
				$scope.alternativesOpen = false;
				$scope.alternativesCurrent = undefined;
				$scope.altActive = undefined;
				$scope.altIcon = undefined;
				i18n(function(t) {
					if(typeof(alternatives) !== 'undefined' && alternatives.length > 0) {
						for(var i = 0; i < alternatives.length; i++) {
							if(typeof(alternatives[i].label) !== 'undefined' && typeof(alternatives[i].state) !== 'undefined') {
								active = (alternatives[i].state === $state.current.name);
								icon = alternatives[i].icon;
								if(typeof(icon) === 'undefined') {
									icon = 'fa';
								}
								altName = t(alternatives[i].label);
								if(active) {
									$scope.altActive = altName;
									$scope.altIcon = icon;
								}
								$scope.alternatives.push({
									label: altName,
									icon: icon,
									state: alternatives[i].state,
									active: active,
									params: alternatives[i].params
								});
							}
						}
					} else {
						$scope.alternatives = undefined;
					}
					/*
					title = pageable.getTitle();
					if(typeof(title) !== 'undefined') {
						$scope.title = t(title);
					}*/
					
					if(ng.isDefined(pageable.search)) {
						if(ng.isDefined(pageable.search.searchLabel)) {
							$scope.searchLabel = t(pageable.search.searchLabel);
						}
						if(ng.isDefined(pageable.search.symbol)) {
							$scope.searchSymbol = t(pageable.search.symbol);
						}
					}
				});
				
				Options.setPage(num);
				//if(loadedOnce && (pageable.pageNumber.first !== pageable.pageNumber.last || pageable.scroll)) {
				if(loadedOnce && !scrolled && pageable.scroll) {
					scrolled = true;
					Browser.scrollTo(viewIds.PAGEABLE);
				}
			}
		};

		if(ng.isDefined(pageable)) {
			var first = pageable.getFirst();
			pageChanged(pageable, first);
		}
		loadedOnce = true;
		
		$scope.$on(events.PAGE_CHANGE, function(event, p, num) {
			if(!event.defaultPrevented) {
				event.preventDefault();
				pageChanged(p, num);
			}
		});
		
		$scope.onPrevious = function() {
			pageable.getPrevious();
		};
		$scope.onNext = function() {
			pageable.getNext();
		};
		
		$scope.alternativeClick = function($index) {
			var alt, go;
			if(typeof($scope.alternatives) !== 'undefined') {
				alt = $scope.alternatives[$index];
				if(typeof(alt) !== 'undefined' && typeof(alt.state) !== 'undefined') {
					go = $state.go(alt.state, $state.params, {reload: true});
				}
			}
		};
		
		$scope.$watch('$parent.' + $scope.$parent[scopeVars.PAGEABLE], function(newValue, oldValue) {
			if(newValue !== oldValue) {
				pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
				if(ng.isDefined(pageable)) {
					first = pageable.getFirst();
					pageChanged(pageable, first);
				}
			}
		});
		
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
	}]);
	
	controller.controller('SubPageableController', ['$scope', '$parse', '$state',
	function($scope, $parse, $state) {
		var pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
		
		$scope.pageable = pageable;
		$scope[scopeVars.PAGEABLE] = 'pageable';
		
		var pageChanged = function(pageable, num) {
			if(ng.isDefined(pageable)) {
				$scope.pageable = pageable;
			}
		};

		if(ng.isDefined(pageable)) {
			var first = pageable.getFirst();
			pageChanged(pageable, first);
		}
		
		$scope.$on(events.PAGE_CHANGE, function(event, p, num) {
			if(!event.defaultPrevented) {
				event.preventDefault();
				pageChanged(p, num);
			}
		});
		
		$scope.onPrevious = function() {
			pageable.getPrevious();
		};
		$scope.onNext = function() {
			pageable.getNext();
		};
		
		$scope.$watch('$parent.' + $scope.$parent[scopeVars.PAGEABLE], function(newValue, oldValue) {
			if(newValue !== oldValue) {
				pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
				if(ng.isDefined(pageable)) {
					first = pageable.getFirst();
					pageChanged(pageable, first);
				}
			}
		});
		
	}]);
	
	controller.controller('PageableItemController', ['$scope', function($scope) {
		$scope[scopeVars.SINGLE] = 'pageItem';
	}]);
});