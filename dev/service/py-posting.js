define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	var filterEmptyString = function(str) {
		if(str === '') {
			str = undefined;
		}
		return str;
	};
	
	service.factory('pyPosting', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			postingPreviews: function(success, error, api, page, user, tags) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.USER] = user;
				p[params.TAGS] = tags;
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTime();
				pyApi.pyRequest(pyApi.GET, apiUrls.POSTINGS, undefined, p, undefined, success, error, api);
			},
			currentPostingPreviews: function(success, error, api, page, tags) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.TAGS] = tags;
				pyApi.pyRequest(pyApi.GET, apiUrls.POSTINGS_CURRENT, undefined, p, undefined, success, error, api);
			},
			posting: function(success, error, api, posting) {
				var p = {};
				p[params.WARNING] = Options.getWarning();
				pyApi.pyRequest(pyApi.GET, apiUrls.POSTINGS_ID, [posting], p, undefined, success, error, api);
			},
			create: function(success, error, api, title, content, tags, backer, warning, cost, preview, imageLink, imageWidth, imageHeight) {
				var body = {
						title: title,
						content: content,
						tags: filterEmptyString(tags),
						backer: filterEmptyString(backer),
						warning: warning,
						cost: cost,
						preview: preview,
						imageLink: imageLink,
						imageHeight: imageHeight,
						imageWidth: imageWidth
				};
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS, undefined, p, body, success, error, api);
			},
			edit: function(success, error, api, id, title, content, preview, imageLink, imageWidth, imageHeight) {
				var body = {
						title: title,
						content: content,
						preview: preview,
						imageLink: imageLink,
						imageHeight: imageHeight,
						imageWidth: imageWidth
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_EDIT, [id], undefined, body, success, error, api);
			},
			enable: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_ENABLE, [id], undefined, undefined, success, error, api);
			},
			disable: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_DISABLE, [id], undefined, undefined, success, error, api);
			},
			flag: function(success, error, api, id, reason) {
				var p = {};
				p[params.FLAG_REASON] = reason;
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_FLAG, [id], p, undefined, success, error, api);
			}
		};
	}]);
});