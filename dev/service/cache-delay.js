define(['./module', 'jquery', 'angular', 'js/constants/cache-times', 'js/constants/events'],
		function(service, $, ng, cacheTimes, events) {
	
	service.factory('CacheDelay', ['AutoRefresh', function(AutoRefresh) {
		
		var wait = {waiting: 0};
		
		var delay = function(callback, seconds, onRouteSuccess, toggleWait) {
			
			var clearEvent;
			if(onRouteSuccess) {
				clearEvent = events.CUSTOM_STATE_CHANGE_SUCCESS;
			}
			var s = seconds;
			var immediate;
			if(seconds <= 0) {
				s = 1;
				immediate = true;
			}
			if(toggleWait) {
				wait.waiting++;
			}
			var completedCallback = function() {
				wait.waiting--;
			};
			AutoRefresh.defer(callback, s, 1, clearEvent, immediate, completedCallback);
		};
		
		return {
			username: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.USER_USERNAME, onRouteSuccess);
			},
			user: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.USER_INFO, onRouteSuccess);
			},
			posting: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.POSTING, onRouteSuccess, true);
			},
			comment: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.COMMENT, onRouteSuccess, true);
			},
			postingOrComment: function(callback, onRouteSuccess) {
				// use the largest
				var time = cacheTimes.POSTING;
				if(cacheTimes.COMMENT > cacheTimes.POSTING) {
					time = cacheTimes.COMMENT;
				}
				delay(callback, time, onRouteSuccess, true);
			},
			tag: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.TAG, onRouteSuccess);
			},
			paged: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.PAGED, onRouteSuccess);
			},
			pagedReplies: function(callback, onRouteSuccess) {
				delay(callback, cacheTimes.PAGED_REPLIES, onRouteSuccess);
			},
			waiting: wait
		};
	}]);
});