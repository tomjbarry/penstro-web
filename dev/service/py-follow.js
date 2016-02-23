define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyFollow', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			followers: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.FOLLOWERS, undefined, p, undefined, success, error, api);
			},
			userFollowers: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_FOLLOWERS, [user], p, undefined, success, error, api);
			},
			getFollower: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, apiUrls.FOLLOWERS_ID, [user], undefined, undefined, success, error, api);
			},
			followees: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.FOLLOWEES, undefined, p, undefined, success, error, api);
			},
			userFollowees: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_FOLLOWEES, [user], p, undefined, success, error, api);
			},
			getFollowee: function(success, error, api, user, handleAll) {
				pyApi.pyRequest(pyApi.GET, apiUrls.FOLLOWEES_ID, [user], undefined, undefined, success, error, api, handleAll);
			},
			follow: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.FOLLOWEES_ID, [user], undefined, undefined, success, error, api);
			},
			unfollow: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.FOLLOWEES_ID, [user], undefined, undefined, success, error, api);
			}
		};
	}]);
});