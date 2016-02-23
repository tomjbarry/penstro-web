define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/events'],
		function(service, $, ng, i18n, events) {
	
	service.factory('Utils', ['$rootScope', '$window', 'RouteCheck', 'Browser', function($rootScope, $window, RouteCheck, Browser) {
		var confirmText, windowText;
		var ignoreStateChange = false;
		
		
		i18n(function(t) {
			confirmText = t('shared:unsavedContent.state');
			windowText = t('shared:unsavedContent.window');
		});

		$rootScope.$on(events.UNSAVED_CHANGES_COMPLETE, function(event) {
			ignoreStateChange = true;
		});
		
		return {
			unsavedChanges: function(scope, form) {
				if(typeof(scope) !== 'undefined' && typeof(form) !== 'undefined') {
					ignoreStateChange = false;
					if(!ng.isArray(form)) {
						form = [form];
					}
					$window.onbeforeunload = function(event) {
						if(!ignoreStateChange) {
							var anyDirty = false;
							for(var i = 0; i < form.length; i++) {
								if(typeof(scope[form[i]]) !== 'undefined' && scope[form[i]].$dirty) {
									anyDirty = true;
								}
							}
							if(anyDirty) {
								if(typeof(event) === 'undefined') {
									event = $window.event;
								}
								if(event) {
									event.returnValue = windowText;
								}
								return windowText;
							}
						}
					};
					RouteCheck.addToStateChangeStart(function() {
						if(!ignoreStateChange) {
							var anyDirty = false;
							for(var i = 0; i < form.length; i++) {
								if(typeof(scope[form[i]]) !== 'undefined' && scope[form[i]].$dirty) {
									anyDirty = true;
								}
							}
							if(anyDirty) {
								var answer = Browser.confirm(confirmText);
								if(answer) {
									$window.onbeforeunload = undefined;
									return false;
								} else {
									return true;
								}
							}
						}
						return false;
					}, 'Utils');
				}
			}
		};
	}]);
});