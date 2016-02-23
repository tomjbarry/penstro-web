define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n',
				'js/constants/events', 'js/constants/states'],
		function(service, $, ng, utils, i18n, events, states) {
	service.factory('Title', ['$rootScope', '$window', '$state',
		function($rootScope, $window, $state) {
			var obj = {};
			var afterInitial = false;
			obj.title = $window.document.title;
			obj.fullTitle = $window.document.title;
			
			var changeTitle = function(title, translate, args) {
				args = args;
					i18n(function(t) {
						var base = t('titles:app');
						if(typeof(title) !== 'undefined') {
							if(translate) {
								obj.title = t('titles:' + title, args);
							} else {
								obj.title = title;
							}
							obj.fullTitle = utils.createFullTitle(base, obj.title, t('titles:sep'));
						} else {
							obj.title = base;
							obj.fullTitle = utils.createFullTitle(base, obj.title, t('titles:sep'));
						}
					});
			};
			
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
				var getType = {};
				if(afterInitial) {
					if(typeof(toState.title) !== 'undefined') {
						var t = toState.title;
						if(typeof(toState.title) === 'function') {
							t = toState.title(toParams);
						}
						changeTitle(t, true);
					}
				}
				afterInitial = true;
			});
			
			obj.setTitle = function(title, translate, args) {
				changeTitle(title, translate, args);
			};
			
			return obj;
	}]);
});