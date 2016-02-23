define(['./module', 'jquery', 'angular', 'js/constants/params', 'admin-js/constants/admin-api-urls'],
		function(service, $, ng, params, adminApiUrls) {
	
	service.factory('pyaAdmin', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			check: function(success, error, api) {
			},
			cacheStatistics: function(success, error, api) {
			},
			adminActions: function(success, error, api, page, user, target, type, state, descending) {
			}
		};
	}]);
	
});