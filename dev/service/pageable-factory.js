define(['./module', 'jquery', 'angular', 'js/constants/response-codes',
        'js/constants/params', 'js/constants/events', 'js/constants/states', 'js/constants/values'],
function(service, $, ng, responseCodes, params, events, states, values) {
	
	//TODO: REMOVE THIS!
	service.factory('Pageable', [function(){return {};}]);
	
	service.factory('PageableFactory', ['SingleFactory', function(SingleFactory) {
		
		var createSingle = function(pageable, singleData) {
			var preview = pageable.preview || {};
			return SingleFactory.createSingle(pageable.scope, pageable.view, preview.method, preview.chained, preview.callChained, singleData, pageable.autoLoad, pageable.autoSub, preview.args, pageable.showMore);
		};
		
		var updatePage = function(pageable, newPage, num) {
			pageable.pageNumber.first = num;
			pageable.pageNumber.last = num;
			if(typeof(newPage) !== 'undefined') {
				pageable.pageList = [newPage];
				pageable.page = [];
				for(var i = 0; i < newPage.content.length; i++) {
					pageable.page.push(createSingle(pageable, newPage.content[i]));
				}
				if(typeof(pageable.page) === undefined || pageable.page.length === 0) {
					pageable.page = [];
				}
			} else {
				pageable.pageList = [];
				pageable.page = [];
			}
			pageable.loaded.current = true;
			pageable.scope.$broadcast(events.PAGE_CHANGE, pageable, num);
		};
		
		var getCurrentError = function(p) {
			return function(code, dto) {
				/*
				if(code === responseCodes.DENIED) {
					$state.go(states.DENIED);
				}*/
				p.loaded.current = false;
			};
		};
		
		var getCurrentApiError = function(p) {
			return function() {
				p.loaded.current = false;
			};
		};
		
		var getPreviousError = function(p) {
			return function() {
				p.loaded.previous = false;
			};
		};
		
		var getNextError = function(p) {
			return function() {
				p.loaded.next = false;
			};
		};
		
		var getMethodCallback = function(pageable, count, num) {
			// count must be a number, we use closures to save the value!
			return function(code, dto, p) {
				if(code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
					if(typeof(p) !== 'undefined') {
						// make sure this is from the same page that requested it!
						//if(count === pageable.requestCount) {
							updatePage(pageable, p, num);
						//}
					}
				}
			};
		};
		
		var getNextPage = function(pageable) {
			return function(code, dto, p) {
				if(code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
					if(typeof(p) !== 'undefined') {
						pageable.pageNumber.last = pageable.pageNumber.last + 1;
						pageable.pageList.push(p);
						if(typeof(p.content) !== 'undefined' && p.content.length > 0) {
							var i;
							for(i = 0; i < p.content.length; i++) {
								pageable.page.push(createSingle(pageable, p.content[i]));
							}
						}
						if(pageable.pageList.length > values.MAX_PAGES) {
							var f = pageable.pageList.shift();
							pageable.pageNumber.first = pageable.pageNumber.first + 1;
							if(typeof(f) !== 'undefined' && f.content.length > 0) {
								var j;
								for(j = 0; j < f.content.length; j++) {
									pageable.page.shift();
								}
							}
						}
						pageable.loaded.next = true;
						pageable.scope.$broadcast(events.PAGE_CHANGE, pageable, pageable.pageNumber.last);
					}
				}
			};
		};
		
		var getPreviousPage = function(pageable) {
			return function(code, dto, p) {
				if(code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
					if(typeof(p) !== 'undefined') {
						pageable.pageNumber.first = pageable.pageNumber.first - 1;
						pageable.pageList.unshift(p);
						if(typeof(p.content) !== 'undefined' && p.content.length > 0) {
							var i;
							for(i = (p.content.length - 1); i >= 0; i--) {
								pageable.page.unshift(createSingle(pageable, p.content[i]) );
							}
						}
						if(pageable.pageList.length > values.MAX_PAGES) {
							var l = pageable.pageList.pop();
							pageable.pageNumber.last = pageable.pageNumber.last - 1;
							if(typeof(l) !== 'undefined' && l.content.length > 0) {
								var j;
								for(j = 0; j < l.content.length; j++) {
									pageable.page.pop();
								}
							}
						}
						pageable.loaded.previous = true;
						pageable.scope.$broadcast(events.PAGE_CHANGE, pageable, pageable.pageNumber.first);
					}
				}
			};
		};
		
		var getPageItem = function(pageable, i) {
			if(typeof(i) !== 'undefined' && typeof(pageable.page) !== 'undefined') {
				return pageable.page[i];
			}
			return undefined;
		};
		
		var getField = function(fieldList, o) {
			if(typeof(o) === 'undefined') {
				return undefined;
			}
			var temp = o;
			for(var i = 0; i < fieldList.length; i++) {
				if(typeof(temp) === 'undefined') {
					return undefined;
				}
				temp = temp[fieldList[i]];
			}
			return temp;
		};
		
		var findItem = function(pageable, ob, fieldList, indexToCheck) {
			if(typeof(ob) === 'undefined' || typeof(fieldList) === 'undefined' || !ng.isArray(fieldList)) {
				return undefined;
			}
			var a = getPageItem(pageable, indexToCheck);
			var field = getField(fieldList, ob);
			if(typeof(a) !== 'undefined') {
				if(getField(fieldList, a) === field) {
					return indexToCheck;
				}
			}
			for(var j = 0; j < pageable.page.length; j++) {
				if(getField(fieldList, pageable.page[j]) === field) {
					return j;
				}
			}
		};
		
		var conditionalRefresh = function(pageable, num, callbackSuccess, callbackError, callbackApiError, skipLoader) {
			if(typeof(num) === 'undefined') {
				num = pageable.pageNumber.first;
			}
			var s = getMethodCallback(pageable, pageable.requestCount, num);
			if(typeof(callbackSuccess) !== 'undefined') {
				s = function(code, dto, page) {
					if(callbackSuccess(code, dto, page)) {
						getMethodCallback(pageable, pageable.requestCount, num)(code, dto, page);
					}
				};
			}
			var e = getCurrentError(pageable);
			if(typeof(callbackError) !== 'undefined') {
				e = function(code, dto) {
					if(callbackError(code, dto)) {
						getCurrentError(pageable)(code, dto);
					}
				};
			}
			var aE = getCurrentApiError(pageable);
			if(typeof(callbackApiError) !== 'undefined') {
				aE = function() {
					if(callbackApiError()) {
						getCurrentApiError(pageable)();
					}
				};
			}
			if(!skipLoader) {
				pageable.loaded = {};
			}
			pageable.method(num, s, e, aE);
		};
		
		var createPageable = function(scope, v, m, num, pageableTitle, time, asReplies, alternatives, alternativesLabel, addSearch, scroll, previewMethod, previewChained, previewCallChained, previewAutoLoad, previewAutoSub, previewArgs, showMore) {
			var pageable = {
					pageNumber: {
						first: 0,
						last: 0
					},
					loaded: {},
					page: [],
					pageList: [],
					timeSort: false,
					timeRepliesSort: false,
					requestCount: 0,
					showMore: false
			};

			if(typeof(m) === 'undefined' || typeof(v) === 'undefined' || typeof(scope) === 'undefined') {
				return undefined;
			}
			pageable.view = v;
			pageable.title = pageableTitle;
			pageable.scroll = scroll || false;
			pageable.autoLoad = previewAutoLoad || false;
			pageable.autoSub = previewAutoSub || false;
			pageable.preview = {
				method: previewMethod,
				chained: previewChained,
				callChained: previewCallChained,
				args: previewArgs
			};
			pageable.showMore = showMore;
			// no longer using multicolumn pageables
			pageable.timeSort = time || false;
			pageable.timeRepliesSort = asReplies || false;
			pageable.number = num || 0;
			pageable.alts = [];
			pageable.altsLabel = undefined;
			delete pageable.altsLabel;
			if(typeof(alternatives) !== 'undefined') {
				pageable.alts = alternatives;
			}
			if(typeof(alternativesLabel) !== 'undefined') {
				pageable.altsLabel = alternativesLabel;
			}
			pageable.search = undefined;
			if(typeof(addSearch) !== 'undefined') {
				pageable.search = addSearch;
			}
			/*pageable.requestCount++;
			if(pageable.requestCount >= 1000) {
				// if the user exceeds this simultaneously with some magic browser, there is a definite issue
				pageable.requestCount = 0;
			}*/
			m(num, getMethodCallback(pageable, pageable.requestCount, num), getCurrentError(pageable), getCurrentApiError(pageable));
			pageable.method = m;
			pageable.scope = scope;
			
			pageable.hasPrevious = function() {
				var first = pageable.pageList[0];
				if(typeof(first) !== 'undefined' && !first.first) {
					return true;
				}
				return false;
			};
			pageable.hasNext = function() {
				var last = pageable.pageList[pageable.pageList.length - 1];
				if(typeof(last) !== 'undefined' && !last.last) {
					return true;
				}
				return false;
			};
			pageable.getPrevious = function() {
				if(pageable.method && pageable.pageNumber.first > 0 && pageable.hasPrevious()) {
					pageable.method(pageable.pageNumber.first - 1, getPreviousPage(pageable), getPreviousError(pageable), getPreviousError(pageable));
					return true;
				}
				return false;
			};
			pageable.getNext = function() {
				if(pageable.method && pageable.hasNext()) {
					pageable.method(pageable.pageNumber.last + 1, getNextPage(pageable), getNextError(pageable), getNextError(pageable));
					return true;
				}
				return false;
			};
			pageable.getFirst = function() {
				return pageable.pageNumber.first;
			};
			pageable.getLast = function() {
				return pageable.pageNumber.last;
			};
			pageable.getPage = function() {
				return pageable.page;
			};
			pageable.findItem = function(ob, fieldList, indexToCheck) {
				return findItem(pageable, ob, fieldList, indexToCheck);
			};
			pageable.getPageItem = function(i) {
				return getPageItem(pageable, i);
			};
			pageable.removeItem = function(i) {
				if(typeof(i) !== 'undefined' && typeof(pageable.page) !== 'undefined') {
					pageable.page[i] = {};
				}
			};
			pageable.getTitle = function() {
				return pageable.title;
			};
			pageable.setTitle = function(t) {
				pageable.title = t;
			};
			pageable.getAlternatives = function() {
				if(typeof(pageable.alts) === 'undefined') {
					return [];
				}
				return pageable.alts;
			};
			pageable.getAlternativesLabel = function() {
				return pageable.altsLabel;
			};
			pageable.getSearch = function() {
				return pageable.search;
			};
			pageable.refresh = function(num) {
				if(typeof(num) === 'undefined') {
					num = pageable.pageNumber.first;
				}
				pageable.loaded = {};
				pageable.method(num, getMethodCallback(pageable, pageable.requestCount, num), getCurrentError(pageable), getCurrentApiError(pageable));
			};
			pageable.getTimeSorted = function() {
				return pageable.timeSort;
			};
			pageable.getTimeRepliesSorted = function() {
				return pageable.timeRepliesSort;
			};
			pageable.conditionalRefresh = function(num, callbackSuccess, callbackError, callbackApiError, skipLoader) {
				return conditionalRefresh(pageable, num, callbackSuccess, callbackError, callbackApiError, skipLoader);
			};
			pageable.getView = function() {
				return pageable.view;
			};
			return pageable;
		};
		return {
			createPageable: createPageable
		};
	}]);
});