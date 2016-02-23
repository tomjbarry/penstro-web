define(['./module', 'jquery', 'angular', 'js/constants/defaults', 'js/constants/view-ids'],
		function(service, $, ng, defaults, viewIds) {
	
	var getTime = function() {
		return new Date().getTime();
	};
	
	var withinInterval = function(first, last, interval) {
		if(typeof(first) !== 'undefined' && typeof(last) !== 'undefined' && typeof(interval) !== 'undefined') {
			if((last - first) <= interval) {
				return true;
			}
		}
		return false;
	};
	
	service.factory('Browser', ['$rootScope', '$window', '$location', '$timeout', '$anchorScroll',
    function($rootScope, $window, $location, $timeout, $anchorScroll) {
			$anchorScroll.yOffset = $('#' + viewIds.NAVBAR);
			var isFocus = true;
			var IE = false;
			var lastActive = getTime();
			
			var onChange = function() {
				lastActive = getTime();
			};
			
			// probably unnecessary
			//$(document).mousemove(onChange);
			//$(document).scroll(onChange);
			
			//$rootScope.$on('$locationChangeStart', function(event) {
			//	lastActive = getTime();
			//});
			
			var onFocus = function() {
				isFocus = true;
				onChange();
			};
			
			var onBlur = function() {
				isFocus = false;
			};
			
			if(/*@cc_on!@*/false) { // check for InternetExplorer
				$window.document.onfocusin = onFocus;
				$window.document.onfocusout = onBlur;
				IE = true;
			} else {
				$window.onfocus = onFocus;
				$window.onblur = onBlur;
				IE = false;
			}
			
			var isActive = function(interval) {
				var millis = (interval || defaults.ACTIVE) * 1000;
				return withinInterval(lastActive, getTime(), millis);
			};
			
			// one second
			var interval = 1000;
			var checkActive = function() {
				if(isFocus) {
					onChange();
				}
				$timeout(checkActive, interval);
			};
			$timeout(checkActive, interval);
			
			var scrollTo = function(id) {
				var old = $location.hash();
				$location.hash(id);
				$anchorScroll();
				$location.hash(old);
			};
			
			return {
				isFocus: function() {
					return isFocus;
				},
				isActive: function(interval) {
					return isActive(interval);
				},
				confirm: function(text) {
					return confirm(text);
				},
				scrollTo: scrollTo,
				scrollTop: function() {
					if(typeof($window.scrollTo) !== 'undefined') {
						$window.scrollTo(0,0);
					} else if(typeof($window.scroll) !== 'undefined') {
						$window.scroll(0,0);
					} else {
						scrollTo('pageheader');
					}
				}
			};
		}
	]);
});