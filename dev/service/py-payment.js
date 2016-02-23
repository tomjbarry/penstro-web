define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, utils, apiUrls, params) {
	
	service.factory('pyPayment', ['pyApi', function(pyApi) {
		return {
			check: function(success, error, api, paykey) {
				var p = {};
				p[params.PAYKEY] = paykey;
				pyApi.pyRequest(pyApi.GET, apiUrls.PAYMENT, undefined, p, undefined, success, error, api, true);
			},
			mark: function(success, error, api, paykey) {
				var p = {};
				p[params.PAYKEY] = paykey;
				pyApi.pyRequest(pyApi.POST, apiUrls.PAYMENT, undefined, p, undefined, success, error, api, true);
			}
		};
	}]);
});