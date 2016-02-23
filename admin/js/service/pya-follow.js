define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaFollow', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			followers: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_FOLLOWERS, [user], undefined, undefined, success, error, api);
			},
			followees: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_FOLLOWEES, [user], undefined, undefined, success, error, api);
			},
			blocked: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_BLOCKED, [user], undefined, undefined, success, error, api);
			},
			follow: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_FOLLOWERS_ID, [user, username], undefined, undefined, success, error, api);
			},
			unfollow: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_FOLLOWEES_ID, [user, username], undefined, undefined, success, error, api);
			},
			block: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_BLOCKED_ID, [user, username], undefined, undefined, success, error, api);
			},
			unblock: function(success, error, api, user, username) {
				pyApi.pyRequest(pyApi.DELETE, adminApiUrls.USERS_ID_BLOCKED_ID, [user, username], undefined, undefined, success, error, api);
			}
		};
	}]);
	
});