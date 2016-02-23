define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaTag', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			lock: function(success, error, api, tag) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.TAGS_ID_LOCK, [tag], undefined, undefined, success, error, api);
			},
			unlock: function(success, error, api, tag) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.TAGS_ID_UNLOCK, [tag], undefined, undefined, success, error, api);
			}
		};
	}]);
	
});