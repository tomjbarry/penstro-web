define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminParams, adminApiUrls) {
	
	service.factory('pyaFlagged', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			getUsers: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.FLAGGED_USERS, undefined, p, undefined, success, error, api);
			},
			getPostings: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.FLAGGED_POSTINGS, undefined, p, undefined, success, error, api);
			},
			getComments: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.FLAGGED_COMMENTS, undefined, p, undefined, success, error, api);
			},
			clearUser: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.FLAGGED_USERS_ID, [user], undefined, undefined, success, error, api);
			},
			clearPosting: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.FLAGGED_POSTINGS_ID, [id], undefined, undefined, success, error, api);
			},
			clearComment: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.FLAGGED_COMMENTS_ID, [id], undefined, undefined, success, error, api);
			}
		};
	}]);
	
});