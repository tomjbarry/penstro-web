define(['./module', 'jquery', 'angular', 'showdown', 'js/util/markdown-extensions', 'js/constants/events', 'js/constants/values'],
		function(service, $, ng, showdown, ext, events, values) {
	
	service.factory('MarkdownConverter', ['$rootScope', 'EventManager', 'AutoRefresh', 'Options',
		function($rootScope, EventManager, AutoRefresh, Options) {
			showdown.setOption('noHeaderId', true);
			showdown.setOption('parseImgDimensions', true);
			var converter = new showdown.Converter({extensions: [ext]});
			
			/*
			AutoRefresh.manageRefresh(function() {
				if(Options.getAutoPreview()) {
					$rootScope.$broadcast(events.PREVIEW_UPDATE);
					$rootScope.$broadcast(events.PREVIEW_UPDATE_COMPLETE);
				}
			}, values.AUTO_PREVIEW_REFRESH, undefined, true);
			*/
			
			var convert = function(conv, str) {
				if(typeof(str) !== 'undefined') {
					return conv.makeHtml(str);
				}
				return '';
			};
			
			return {
				convert: function(str) {
					return convert(converter, str);
				},
				manageEvent: function(scope, callback) {
					EventManager.manage(events.PREVIEW_UPDATE, scope, callback);
				},
				managePreEvent: function(scope, callback) {
					EventManager.manage(events.PREVIEW_UPDATE_PRE, scope, callback);
				}
			};
		}
	]);
});