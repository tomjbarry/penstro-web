define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyUser', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			userPreviews: function(success, error, api, page) {
				var p = {};
				p[params.WARNING] = Options.getWarning();
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.TIME] = Options.getTime();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS, undefined, p, undefined, success, error, api);
			},
			user: function(success, error, api, user, handleAll) {
				var p = {};
				p[params.WARNING] = Options.getWarning();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_ID, [user], p, undefined, success, error, api, handleAll);
			},
			appreciationResponse: function(success, error, api, user, handleAll) {
				var p = {};
				p[params.WARNING] = Options.getWarning();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_APPRECIATION_RESPONSE, [user], p, undefined, success, error, api, handleAll);
			},
			flag: function(success, error, api, user, reason) {
				var p = {};
				p[params.FLAG_REASON] = reason;
				pyApi.pyRequest(pyApi.POST, apiUrls.USERS_FLAG, [user], p, undefined, success, error, api);
			}
		};
	}]);
});