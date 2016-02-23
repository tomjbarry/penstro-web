define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {

	var filterEmptyString = function(str) {
		if(str === '') {
			str = undefined;
		}
		return str;
	};
	
	service.factory('pyComment', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			commentPreviews: function(success, error, api, page, user, types) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.COMMENT_TYPE] = types;
				p[params.USER] = user;
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTime();
				pyApi.pyRequest(pyApi.GET, apiUrls.COMMENTS, undefined, p, undefined, success, error, api);
			},
			currentCommentPreviews: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.COMMENTS_CURRENT, undefined, p, undefined, success, error, api);
			},
			comment: function(success, error, api, comment) {
				var p = {};
				p[params.WARNING] = Options.getWarning();
				pyApi.pyRequest(pyApi.GET, apiUrls.COMMENTS_ID, [comment], p, undefined, success, error, api);
			},
			postingComments: function(success, error, api, page, posting) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTimeReplies();
				pyApi.pyRequest(pyApi.GET, apiUrls.POSTINGS_COMMENTS, [posting], p, undefined, success, error, api);
			},
			tagComments: function(success, error, api, page, tag) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTimeReplies();
				pyApi.pyRequest(pyApi.GET, apiUrls.TAGS_COMMENTS, [tag], p, undefined, success, error, api);
			},
			userComments: function(success, error, api, page, user) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTimeReplies();
				pyApi.pyRequest(pyApi.GET, apiUrls.USERS_COMMENTS, [user], p, undefined, success, error, api);
			},
			commentComments: function(success, error, api, page, comment) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				p[params.LANGUAGE] = Options.getLanguage();
				p[params.WARNING] = Options.getWarning();
				p[params.SORT] = Options.getSort();
				p[params.TIME] = Options.getTimeReplies();
				pyApi.pyRequest(pyApi.GET, apiUrls.COMMENTS_COMMENTS, [comment], p, undefined, success, error, api);
			},
			postingReply: function(success, error, api, id, content, backer, warning, cost) {
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				var body = {
						content: content,
						backer: filterEmptyString(backer),
						warning: warning,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_COMMENTS, [id], p, body, success, error, api);
			},
			tagReply: function(success, error, api, id, content, backer, warning, cost) {
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				var body = {
						content: content,
						backer: filterEmptyString(backer),
						warning: warning,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.TAGS_COMMENTS, [id], p, body, success, error, api);
			},
			userReply: function(success, error, api, id, content, backer, warning, cost) {
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				var body = {
						content: content,
						backer: filterEmptyString(backer),
						warning: warning,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.USERS_COMMENTS, [id], p, body, success, error, api);
			},
			commentReply: function(success, error, api, id, content, backer, warning, cost) {
				var p = {};
				p[params.LANGUAGE] = Options.getLanguage();
				var body = {
						content: content,
						backer: filterEmptyString(backer),
						warning: warning,
						cost: cost
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_COMMENTS, [id], p, body, success, error, api);
			},
			edit: function(success, error, api, id, content) {
				var body = {
						content: content
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_EDIT, [id], undefined, body, success, error, api);
			},
			enable: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_ENABLE, [id], undefined, undefined, success, error, api);
			},
			disable: function(success, error, api, id) {
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_DISABLE, [id], undefined, undefined, success, error, api);
			},
			flag: function(success, error, api, id, reason) {
				var p = {};
				p[params.FLAG_REASON] = reason;
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_FLAG, [id], p, undefined, success, error, api);
			}
		};
	}]);
});