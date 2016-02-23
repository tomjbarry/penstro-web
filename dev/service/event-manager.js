define(['./module', 'jquery', 'angular', 'js/constants/states', 'js/constants/events'],
		function(service, $, ng, states, events) {
	var managedEventList;
	
	service.factory('EventManager', ['$rootScope',
		function($rootScope) {
	
			$rootScope.$on(events.CUSTOM_STATE_CHANGE_SUCCESS, function(event, toState, toParams, fromState, fromParams) {
				if(typeof(managedEventList) !== 'undefined') {
					var i;
					for(i = 0; i < managedEventList.length; i++) {
						var e = managedEventList[i];
						if(typeof(e) !== 'undefined' && typeof(e.eventOff) !== 'undefined') {
							e.eventOff();
						}
					}
					managedEventList = undefined;
				}
			});
			
			return {
				manage: function(event, scope, callback) {
					var eventOff = $rootScope.$on(event, callback);
					if(typeof(eventOff) !== 'undefined') {
						if(typeof(managedEventList) === 'undefined') {
							managedEventList = [];
						}
						if(typeof(scope) !== 'undefined') {
							scope.$on('$destroy', function(event) {
								eventOff();
							});
						}
						managedEventList.push({eventOff: eventOff, scope: scope});
					}
				},
				managePersistent: function(event, scope, callback) {
					var eventOff = $rootScope.$on(event, callback);
					if(typeof(eventOff) !== 'undefined') {
						if(typeof(scope) !== 'undefined') {
							scope.$on('$destroy', function(event) {
								eventOff();
							});
						}
					}
				}
			};
		}
	]);
});