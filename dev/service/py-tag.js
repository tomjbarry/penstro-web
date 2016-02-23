define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyTag', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			tagPreviews: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.TIME] = Options.getTime();
				pyApi.pyRequest(pyApi.GET, apiUrls.TAGS, undefined, p, undefined, success, error, api);
			},
			tag: function(success, error, api, tag) {
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				pyApi.pyRequest(pyApi.GET, apiUrls.TAGS_ID, [tag], p, undefined, success, error, api);
			}
		};
	}]);
});