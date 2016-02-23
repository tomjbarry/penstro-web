define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/response-codes',
        'js/constants/states', 'js/constants/events', 'js/constants/chained-keys'],
		function(service, $, ng, i18n, responseCodes, states, events, chainedKeys) {
	
	service.factory('ApiData', ['SingleFactory', 'PageableFactory', function(SingleFactory, PageableFactory) {
		
		var getData = function(single, pageable) {
			var result = {};
			if(typeof(single) !== 'undefined') {
				result.single = SingleFactory.createSingle(single.scope, single.view, single.method, single.chained, single.callChained, single.preview, single.autoLoad, single.autoSub, single.args);
				if(typeof(result.single) === 'undefined') {
					throw 'Single undefined!';
				}
			}
			if(typeof(pageable) !== 'undefined') {
				result.pageable = PageableFactory.createPageable(pageable.scope, pageable.view, pageable.method, pageable.number,
						pageable.title, pageable.time, pageable.asReplies, pageable.alternatives, pageable.alternativesLabel,
						pageable.addSearch, pageable.scroll, pageable.previewMethod, pageable.previewChained, pageable.previewCallChained, pageable.autoLoad, pageable.autoSub, pageable.args, pageable.showMore);
				if(typeof(result.pageable) === 'undefined') {
					throw 'Pageable undefined!';
				}
			}
			return result;
		};
		
		return {
			getData: getData
		};
	}]);
});