define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyEvent', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			notifications: function(success, error, api, page, events) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.EVENT] = events;
				pyApi.pyRequest(pyApi.GET, apiUrls.NOTIFICATIONS, undefined, p, undefined, success, error, api);
			},
			feed: function(success, error, api, page, events) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.EVENT] = events;
				pyApi.pyRequest(pyApi.GET, apiUrls.FEED, undefined, p, undefined, success, error, api);
			},
			userFeed: function(success, error, api, user, page, events) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.EVENT] = events;
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_FEED, [user], p, undefined, success, error, api);
			}
		};
	}]);
});