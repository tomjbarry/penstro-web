define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyMessage', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			conversations: function(success, error, api, page, folder) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.MESSAGES, undefined, p, undefined, success, error, api);
			},
			getConversation: function(success, error, api, user, handleAll) {
				pyApi.pyRequest(pyApi.GET, apiUrls.CONVERSATION, [user], undefined, undefined, success, error, api, handleAll);
			},
			messages: function(success, error, api, user, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.CONVERSATION_MESSAGES, [user], p, undefined, success, error, api);
			},
			send: function(success, error, api, user, message) {
				var body = {message: message};
				pyApi.pyRequest(pyApi.POST, apiUrls.CONVERSATION, [user], undefined, body, success, error, api);
			},
			flag: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CONVERSATION_FLAG, [user], undefined, undefined, success, error, api);
			},
			hide: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CONVERSATION_HIDE, [user], undefined, undefined, success, error, api);
			},
			show: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.CONVERSATION_SHOW, [user], undefined, undefined, success, error, api);
			}
		};
	}]);
});