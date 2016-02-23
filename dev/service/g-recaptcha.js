define(['./module', 'jquery', 'angular', 'js/constants/events', 'js/constants/values'],
		function(service, $, ng, events, values) {
	service.factory('GRecaptcha', ['$window', '$rootScope', function($window, $rootScope) {
		var widgetId;
		var recaptchaCallback = function() {
			var recaptcha = $window.grecaptcha;
			if(typeof(recaptcha) === 'undefined') {
				// huge error here!
				return;
			}
			$rootScope.$broadcast(events.RECAPTCHA_LOADED, recaptcha);
		};
		
		$window[values.RECAPTCHA_CALLBACK] = recaptchaCallback;
		
		if(typeof($window.grecaptcha) !== 'undefined') {
			recaptchaCallback();
		}
		
		return {
			getRecaptcha: function() {
				if(typeof($window.grecaptcha) === 'undefined') {
					return undefined;
				}
				return $window.grecaptcha;
			},
			setCurrentId: function(id) {
				widgetId = id;
			},
			getResponse: function() {
				var recaptcha = $window.grecaptcha;
				if(typeof(recaptcha) !== 'undefined') {
					return recaptcha.getResponse(widgetId);
				}
				return undefined;
			},
			reset: function() {
				var recaptcha = $window.grecaptcha;
				if(typeof(recaptcha) !== 'undefined') {
					recaptcha.reset(widgetId);
				}
			}
		};
	}]);
});