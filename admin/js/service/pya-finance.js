define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/params',
        'admin-js/constants/admin-api-urls', 'js/constants/finance'],
		function(service, $, ng, utils, params, adminApiUrls, viewUrls, responseCodes, finance) {
	
	var roundUp = function(amount) {
		return Math.ceil(amount * 100) / 100;
	};
	var roundDown = function(amount) {
		return Math.floor(amount * 100) / 100;
	};
	var roundHalfUp = function(amount) {
		return Math.round(amount * 100) / 100;
	};
	
	service.factory('pyaFinance', ['$location', 'pyApi', function($location, pyApi) {
		return {
			appreciatePosting: function(success, error, api, id, user, appreciation, tags, warning) {
				var appreciationString;
				if(typeof(appreciation) !== 'undefined') {
					appreciationString = '' + appreciation;
				}
				var body = {
						appreciation: appreciationString,
						tags: tags,
						warning: warning
				};
				var url = $location.absUrl();
				pyApi.pyRequest(pyApi.POST, adminApiUrls.POSTINGS_ID_APPRECIATE, [id, user], undefined, body, success, error, api);
			},
			appreciateComment: function(success, error, api, id, user, appreciation, warning) {
				var appreciationString;
				if(typeof(appreciation) !== 'undefined') {
					appreciationString = '' + appreciation;
				}
				var body = {
						appreciation: appreciationString,
						warning: warning
				};
				var url = $location.absUrl();
				pyApi.pyRequest(pyApi.POST, adminApiUrls.COMMENTS_ID_APPRECIATE, [id, user], undefined, body, success, error, api);
			}
		};
	}]);
});