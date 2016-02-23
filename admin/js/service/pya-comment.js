define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaComment', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			currentComments: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, adminApiUrls.COMMENTS_SELF, [user], p, undefined, success, error, api);
			},
			comment: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.COMMENTS_ID, [comment], undefined, undefined, success, error, api);
			},
			enable: function(success, error, api, user, comment) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_ENABLE, [user, comment], undefined, undefined, success, error, api);
			},
			disable: function(success, error, api, user, comment) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_DISABLE, [user, comment], undefined, undefined, success, error, api);
			},
			remove: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.COMMENTS_ID_REMOVE, [comment], undefined, undefined, success, error, api);
			},
			unremove: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_REMOVE, [comment], undefined, undefined, success, error, api);
			},
			flag: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.COMMENTS_ID_FLAG, [comment], undefined, undefined, success, error, api);
			},
			unflag: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_FLAG, [comment], undefined, undefined, success, error, api);
			},
			warning: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.COMMENTS_ID_WARNING, [comment], undefined, undefined, success, error, api);
			},
			unwarning: function(success, error, api, comment) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_WARNING, [comment], undefined, undefined, success, error, api);
			},
			updateTally: function(success, error, api, comment, appreciation, promotion, cost) {
				var body = {
						appreciation: appreciation,
						promotion: promotion,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_TALLY_CHANGE, [comment], undefined, body, success, error, api);
			}
		};
	}]);
	
});