define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyBacker', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			backers: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.BACKERS, undefined, p, undefined, success, error, api);
			},
			backees: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.BACKERS_OUTSTANDING, undefined, p, undefined, success, error, api);
			},
			getBacker: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, apiUrls.BACKERS_ID, [user], undefined, undefined, success, error, api);
			},
			getBackee: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, apiUrls.BACKERS_OUTSTANDING_ID, [user], undefined, undefined, success, error, api);
			},
			cancelBacker: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.BACKERS_ID, [user], undefined, undefined, success, error, api);
			},
			withdrawBackee: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.BACKERS_OUTSTANDING_ID, [user], undefined, undefined, success, error, api);
			}
		};
	}]);
});