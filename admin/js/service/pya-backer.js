define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaBacker', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			offers: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_OFFERS, [user], undefined, undefined, success, error, api);
			},
			offees: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_OFFEES, [user], undefined, undefined, success, error, api);
			},
			emailOffees: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_OFFEES_EMAIL, [user], undefined, undefined, success, error, api);
			},
			backers: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_BACKERS, [user], undefined, undefined, success, error, api);
			},
			backees: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_BACKEES, [user], undefined, undefined, success, error, api);
			},
			withdrawOffee: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_OFFEES_ID_WITHDRAW, [user, username], undefined, undefined, success, error, api);
			},
			withdrawEmailOffee: function(success, error, api, user, email) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_OFFEES_EMAIL_ID_WITHDRAW, [user, email], undefined, undefined, success, error, api);
			},
			cancelBacker: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_BACKERS_ID, [user, username], undefined, undefined, success, error, api);
			},
			withdrawBackee: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_BACKEES_ID, [user, username], undefined, undefined, success, error, api);
			}
		};
	}]);
	
});