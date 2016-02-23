define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/api-urls', 'js/constants/params',
        'js/constants/view-urls', 'js/constants/response-codes', 'js/constants/finance'],
		function(service, $, ng, utils, apiUrls, params, viewUrls, responseCodes, finance) {
	
	var roundUp = function(amount) {
		return Math.ceil(amount * 100) / 100;
	};
	var roundDown = function(amount) {
		return Math.floor(amount * 100) / 100;
	};
	var roundHalfUp = function(amount) {
		return Math.round(amount * 100) / 100;
	};
	
	service.factory('pyFinance', ['$location', 'pyApi', function($location, pyApi) {
		return {
			balance: function(success, error, api) {
				pyApi.pyRequest(pyApi.GET, apiUrls.FINANCES, undefined, undefined, undefined, success, error, api);
			},
			purchaseCurrency: function(success, error, api, amount) {
				var body = {
						amount: amount
				};
				var url = $location.absUrl();
				pyApi.pyRequest(pyApi.POST, apiUrls.PURCHASE, undefined, undefined, body, success, error, api);
			},
			appreciatePosting: function(success, error, api, id, appreciation, tags, warning) {
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
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_APPRECIATE, [id], undefined, body, success, error, api);
			},
			promotePosting: function(success, error, api, id, promotion, tags, warning) {
				var body = {
						promotion: promotion,
						tags: tags,
						warning: warning
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.POSTINGS_PROMOTE, [id], undefined, body, success, error, api);
			},
			appreciateComment: function(success, error, api, id, appreciation, warning) {
				var appreciationString;
				if(typeof(appreciation) !== 'undefined') {
					appreciationString = '' + appreciation;
				}
				var body = {
						appreciation: appreciationString,
						warning: warning
				};
				var url = $location.absUrl();
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_APPRECIATE, [id], undefined, body, success, error, api);
			},
			promoteComment: function(success, error, api, id, promotion, warning) {
				var body = {
						promotion: promotion,
						warning: warning
				};
				pyApi.pyRequest(pyApi.POST, apiUrls.COMMENTS_PROMOTE, [id], undefined, body, success, error, api);
			},
			calculatePurchaseTotals: function(success, error, api, amount) {
				// this may eventually be handled server side
				if(typeof(success) !== 'undefined') {
					if(typeof(amount) === 'undefined' || amount < 0) {
						amount = 0;
					}
					var result = {amount: 0, tax: 0, total: 0};
					result.amount = roundDown(amount / finance.PURCHASE_COINS_CONVERSION_RATE);
					result.tax = roundHalfUp(result.amount * finance.TOTAL_TAX_RATE);
					result.total = roundDown(result.amount + result.tax);
					success(responseCodes.SUCCESS, result);
				}
			},
			calculateAppreciationTotals: function(success, error, api, amount) {
				// this may eventually be handled server side
				if(typeof(success) !== 'undefined') {
					if(typeof(amount) === 'undefined' || amount < 0) {
						amount = 0;
					}
					var result = {amount: 0, author: 0, fee: 0, tax: 0, total: 0};
					result.amount = roundDown(amount);
					result.fee = roundHalfUp(result.amount * finance.APPRECIATION_FEE_RATE);
					result.tax = roundHalfUp(result.fee * finance.TOTAL_TAX_RATE);
					result.author = roundDown(result.amount - result.fee);
					result.total = roundDown(result.amount + result.tax);
					success(responseCodes.SUCCESS, result);
				}
			},
			calculateAppreciationTotalsFromAppreciation: function(success, error, api, author) {
				// this may eventually be handled server side
				if(typeof(success) !== 'undefined') {
					if(typeof(author) === 'undefined' || author < 0) {
						author = 0;
					}
					var result = {amount: 0, author: 0, fee: 0, tax: 0, total: 0};
					result.author = roundDown(author);
					result.amount = roundHalfUp(result.author / (1 - finance.APPRECIATION_FEE_RATE));
					result.fee = roundHalfUp(result.amount * finance.APPRECIATION_FEE_RATE);
					result.tax = roundHalfUp(result.fee * finance.TOTAL_TAX_RATE);
					result.author = roundDown(result.amount - result.fee);
					result.total = roundDown(result.amount + result.tax);
					success(responseCodes.SUCCESS, result);
				}
			}
		};
	}]);
});