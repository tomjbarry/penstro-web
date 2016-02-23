define(['./module', 'jquery', 'angular', 'js/util/utils', 'admin-js/constants/admin-api-urls', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, utils, adminApiUrls, apiUrls, params) {
	
	// NOT A TYPO! Overrides default py-payment
	service.factory('pyPayment', ['pyApi', function(pyApi) {
		return {
			check: function(success, error, api, paykey, user) {
				var p = {};
				p[params.PAYKEY] = paykey;
				if(typeof(user) === 'undefined') {
					pyApi.pyRequest(pyApi.GET, apiUrls.PAYMENT, undefined, p, undefined, success, error, api, true);
				} else {
					pyApi.pyRequest(pyApi.GET, adminApiUrls.USERS_ID_PAYMENT, [user], p, undefined, success, error, api, true);
				}
			},
			mark: function(success, error, api, paykey, user) {
				var p = {};
				p[params.PAYKEY] = paykey;
				if(typeof(user) === 'undefined') {
					pyApi.pyRequest(pyApi.POST, apiUrls.PAYMENT, undefined, p, undefined, success, error, api, true);
				} else {
					pyApi.pyRequest(pyApi.POST, adminApiUrls.USERS_ID_PAYMENT, [user], p, undefined, success, error, api, true);
				}
			}
		};
	}]);
});