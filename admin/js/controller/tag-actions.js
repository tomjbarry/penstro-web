define(['./module', 'jquery', 'angular', 'js/util/i18n'],
		function(controller, $, ng, i18n) {
	controller.controller('AdminTagActionsController', ['$scope', 'Alerts', 'CacheDelay', 'pyaTag',
		function($scope, Alerts, CacheDelay, pyaTag) {
			$scope.status = {lock: true};
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			/*
			var tagName;
			var updated = function(s) {
				if(typeof(s) !== 'undefined') {
					$scope.tag = Single.getSingleMain(s);
					$scope.tagName = $scope.tag.name;
					tagName = $scope.tagName;
					$scope.locked = $scope.tag.locked;
				}
			};
			*/
			
			var getChangeSuccess = function(scopeStr) {
				return function(code, dto, page) {
					pscope.tag.locked = !pscope.tag.locked;
					$scope.status[scopeStr] = true;
					/*
					CacheDelay.tag(function() {
						$scope.status[scopeStr] = true;
						Single.refresh();
					}, true);
					*/
				};
			};
			
			var getChangeError = function(scopeStr, str) {
				return function(code, dto, page) {
					i18n(function(t) {
						Alerts.warning(t(str));
						$scope.status[scopeStr] = true;
					});
				};
			};
			
			$scope.onLock = function() {
				$scope.status.lock = false;
				pyaTag.lock(getChangeSuccess('lock'), getChangeError('lock', 'alerts:modTag.lock'), getChangeError('lock', 'alerts:apiError'), pscope.tag.name);
			};
			
			$scope.onUnlock = function() {
				$scope.status.lock = false;
				pyaTag.unlock(getChangeSuccess('lock'), getChangeError('lock', 'alerts:modTag.lock'), getChangeError('lock', 'alerts:apiError'), pscope.tag.name);
			};
			/*
			Single.manageEvent($scope, function(event, single) {
				updated(single);
			});
			var single = Single.getSingle();
			updated(single);
			*/
		}
	]);
});