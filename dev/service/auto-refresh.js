define(['./module', 'jquery', 'angular', 'js/constants/defaults'],
		function(service, $, ng, defaults) {
	
	service.factory('AutoRefresh', ['$rootScope', '$timeout', 'Browser', function($rootScope, $timeout, Browser) {
		var defer = function(callback, seconds, max, clearEvent, immediate, completedCallback) {
			if(typeof(callback) !== 'undefined') {
				// interval should be in milliseconds
				var interval = (seconds || defaults.REFRESH) * 1000;
				var maxCount = max || defaults.MAX_DEFERS;
				var count = 0;
				var on = true;
				var timeout;
				var eventOff;
				var executeCallback = function() {
					count++;
					if(on) {
						if(callback() && count < maxCount) {
							timeout = $timeout(executeCallback, interval);
						}
					}
					if(count >= maxCount) {
						if(typeof(eventOff) !== 'undefined') {
							eventOff();
							eventOff = undefined;
						}
						if(typeof(completedCallback) !== 'undefined') {
								completedCallback();
						}
					}
				};
				var firstInterval = interval;
				if(immediate) {
					firstInterval = 1;
				}
				timeout = $timeout(executeCallback, firstInterval);
				if(ng.isDefined(clearEvent)) {
					eventOff = $rootScope.$on(clearEvent, function(event) {
						on = false;
						if(ng.isDefined(timeout)) {
							$timeout.cancel(timeout);
						}
						eventOff();
						eventOff = undefined;
					});
				}
			}
		};
		return {
			manageRefresh: function(callback, seconds, clearEvent, onlyActive, immediate, scope) {
				if(typeof(callback) !== 'undefined') {
					// interval should be in milliseconds
					var interval = (seconds || defaults.REFRESH);
					var intervalMillis = interval * 1000;
					var on = true;
					var timeout;
					
					var executeCallback = function() {
						if(on) {
							if(!onlyActive || Browser.isActive(interval)) {
								callback();
							}
							timeout = $timeout(executeCallback, intervalMillis);
						}
					};
					var firstInterval = intervalMillis;
					if(immediate) {
						firstInterval = 1;
					}
					timeout = $timeout(executeCallback, firstInterval);
					if(ng.isDefined(clearEvent)) {
						var eventOff = $rootScope.$on(clearEvent, function(event) {
							on = false;
							if(ng.isDefined(timeout)) {
								$timeout.cancel(timeout);
							}
							eventOff();
						});
					}
					if(ng.isDefined(scope)) {
						scope.$on('$destroy', function(event) {
							on = false;
							if(ng.isDefined(timeout)) {
								$timeout.cancel(timeout);
							}
						});
					}
				}
			},
			defer: defer,
			deferRequest: function(request, success, error, apiError, seconds, max, clearEvent, immediate, completedCallback) {
				if(typeof(request) === 'undefined') {
					return;
				}
				var getCallback = function() {
					var waiting = false;
					var repeat = true;
					
					var s = function(code, dto, p) {
						waiting = false;
						repeat = false;
						if(typeof(success) !== 'undefined') {
							success(code, dto, p);
						}
					};
					
					var e = function(code, dto) {
						waiting = false;
						if(typeof(error) !== 'undefined') {
							error(code, dto);
						}
					};
					
					var apiE = function() {
						waiting = false;
						if(typeof(apiError) !== 'undefined') {
							apiError();
						}
					};
					return function() {
						if(!waiting && repeat) {
							request(s, e, apiE);
							waiting = true;
						}
						return repeat;
					};
				};
				defer(getCallback(), seconds, max, clearEvent, immediate, completedCallback);
			}
		};
	}]);
});