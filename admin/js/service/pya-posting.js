define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaPosting', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			currentPostings: function(success, error, api, user, page, tags) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.TAGS] = tags;
				pyApi.pyRequest(pyApi.GET, adminApiUrls.POSTINGS_SELF, [user], p, undefined, success, error, api);
			},
			posting: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.POSTINGS_ID, [posting], undefined, undefined, success, error, api);
			},
			enable: function(success, error, api, user, posting) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_ENABLE, [user, posting], undefined, undefined, success, error, api);
			},
			disable: function(success, error, api, user, posting) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_DISABLE, [user, posting], undefined, undefined, success, error, api);
			},
			remove: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.POSTINGS_ID_REMOVE, [posting], undefined, undefined, success, error, api);
			},
			unremove: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_REMOVE, [posting], undefined, undefined, success, error, api);
			},
			flag: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.POSTINGS_ID_FLAG, [posting], undefined, undefined, success, error, api);
			},
			unflag: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_FLAG, [posting], undefined, undefined, success, error, api);
			},
			warning: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.POSTINGS_ID_WARNING, [posting], undefined, undefined, success, error, api);
			},
			unwarning: function(success, error, api, posting) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_WARNING, [posting], undefined, undefined, success, error, api);
			},
			updateTally: function(success, error, api, posting, appreciation, promotion, cost) {
				var body = {
						appreciation: appreciation,
						promotion: promotion,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_TALLY_CHANGE, [posting], undefined, body, success, error, api);
			}
		};
	}]);
	
});