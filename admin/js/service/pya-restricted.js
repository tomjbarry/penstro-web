define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminParams, adminApiUrls) {
	
	service.factory('pyaRestricted', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			getRestricted: function(success, error, api, page, type) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[adminParams.RESTRICTED_TYPE] = type;
				pyApi.pyRequest(pyApi.GET, adminApiUrls.RESTRICTEDS, undefined, p, undefined, success, error, api);
			},
			addRestricted: function(success, error, api, type, word) {
				var body = {
						word: word,
						type: type
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.RESTRICTEDS, undefined, undefined, body, success, error, api);
			},
			removeRestricted: function(success, error, api, type, word) {
				var p = {};
				p[adminParams.RESTRICTED_TYPE] = type;
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.RESTRICTEDS_ID, [word], p, undefined, success, error, api);
			}
		};
	}]);
	
});