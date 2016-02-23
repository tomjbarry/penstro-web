define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/params', 'js/constants/param-values', 'js/constants/events', 'js/constants/scope-variables'],
		function(controller, $, ng, i18n, params, paramValues, events, scopeVars) {

	var timeSelect = function($scope, $parse, Options, getTime, setTime) {
		$scope.label = {};
		$scope.optionalOpen = false;
		i18n(function(t) {
			$scope.label[paramValues.TIME_OPTION_HOUR] = t('shared:lastTimeOption.hour');
			$scope.label[paramValues.TIME_OPTION_DAY] = t('shared:lastTimeOption.day');
			$scope.label[paramValues.TIME_OPTION_MONTH] = t('shared:lastTimeOption.month');
			$scope.label[paramValues.TIME_OPTION_YEAR] = t('shared:lastTimeOption.year');
			$scope.label[paramValues.TIME_OPTION_ALLTIME] = t('shared:lastTimeOption.alltime');
		});
		var setActive = function(time) {
			$scope.time = {};
			$scope.time[time] = true;
			$scope.timeLabel = $scope.label[time];
		};

		setActive(getTime());
		
		$scope.onChange = function(time) {
			Options.setPage(0);
			setTime(time);
			setActive(time);
			var pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
			if(ng.isDefined(pageable)) {
				pageable.refresh(0);
			}
		};
	};
	controller.controller('TimeSelectController', ['$parse', '$scope', 'Options', 
		function($parse, $scope, Options) {
			timeSelect($scope, $parse, Options, Options.getTime, Options.setTime);
	}]);
	controller.controller('TimeRepliesSelectController', ['$parse', '$scope', 'Options',
		function($parse, $scope, Options) {
			timeSelect($scope, $parse, Options, Options.getTimeReplies, Options.setTimeReplies);
	}]);
	controller.controller('SortSelectController', ['$parse', '$scope', 'Options',
		function($parse, $scope, Options) {
			var setActive = function(sort) {
				$scope.sort = {};
				$scope.sort[sort] = true;
			};
		
			setActive(Options.getSort());
			
			$scope.onChange = function(sort) {
				Options.setPage(0);
				Options.setSort(sort);
				setActive(sort);
				var pageable = $parse($scope.$parent[scopeVars.PAGEABLE])($scope.$parent);
				if(ng.isDefined(pageable)) {
					pageable.refresh(0);
				}
			};
			
		}]);
	controller.controller('WarningController', ['$parse', '$scope', 'Options',
		function($parse, $scope, Options) {
			$scope.accept = function(name) {
				Options.setWarning(true);
				$scope.$parent[name] = !$scope.$parent[name];
			};
			
		}]);
	controller.controller('ContentPreviewController', ['$rootScope', '$scope', 'Options',
		function($rootScope, $scope, Options) {
			$scope.preview = function() {
				$rootScope.$broadcast(events.PREVIEW_UPDATE_PRE);
				$rootScope.$broadcast(events.PREVIEW_UPDATE);
			};
		}]);
	
});