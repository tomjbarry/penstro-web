define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyBlock', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			blocked: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.BLOCKED, undefined, p, undefined, success, error, api);
			},
			getBlocked: function(success, error, api, user, handleAll) {
				pyApi.pyRequest(pyApi.GET, apiUrls.BLOCKED_ID, [user], undefined, undefined, success, error, api, handleAll);
			},
			block: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.BLOCKED_ID, [user], undefined, undefined, success, error, api);
			},
			unblock: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.BLOCKED_ID, [user], undefined, undefined, success, error, api);
			}
		};
	}]);
});