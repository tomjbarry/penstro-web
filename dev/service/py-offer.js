define(['./module', 'jquery', 'angular', 'js/constants/api-urls', 'js/constants/params'],
		function(service, $, ng, apiUrls, params) {
	
	service.factory('pyOffer', ['pyApi', 'Options', function(pyApi, Options) {
		return {
			offers: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.OFFERS, undefined, p, undefined, success, error, api);
			},
			offees: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.OFFERS_OUTSTANDING, undefined, p, undefined, success, error, api);
			},
			emailOffees: function(success, error, api, page) {
				var p = {};
				p[params.PAGE] = page;
				p[params.SIZE] = Options.getPageSize();
				pyApi.pyRequest(pyApi.GET, apiUrls.OFFERS_EMAIL_OUTSTANDING, undefined, p, undefined, success, error, api);
			},
			offer: function(success, error, api, username, amount) {
				var body = {
						username: username,
						amount: amount
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.OFFERS, undefined, undefined, body, success, error, api);
			},
			emailOffer: function(success, error, api, email, amount) {
				var body = {
						email: email,
						amount: amount
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.OFFERS_EMAIL, undefined, undefined, body, success, error, api);
			},
			getOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.GET, apiUrls.OFFERS_ID, [user], undefined, undefined, success, error, api);
			},
			getEmailOffer: function(success, error, api, email) {
				pyApi.pyRequest(pyApi.GET, apiUrls.OFFERS_EMAIL_OUTSTANDING_ID, [email], undefined, undefined, success, error, api);
			},
			acceptOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.OFFERS_ACCEPT, [user], undefined, undefined, success, error, api);
			},
			denyOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.OFFERS_DENY, [user], undefined, undefined, success, error, api);
			},
			acceptEmailOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.POST, apiUrls.OFFERS_EMAIL_ACCEPT, [user], undefined, undefined, success, error, api);
			},
			denyEmailOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.OFFERS_EMAIL_DENY, [user], undefined, undefined, success, error, api);
			},
			withdrawOffer: function(success, error, api, user) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.OFFERS_OUTSTANDING_WITHDRAW, [user], undefined, undefined, success, error, api);
			},
			withdrawEmailOffer: function(success, error, api, email) {
				pyApi.pyRequest(pyApi.DELETE, apiUrls.OFFERS_EMAIL_OUTSTANDING_WITHDRAW, [email], undefined, undefined, success, error, api);
			}
		};
	}]);
});