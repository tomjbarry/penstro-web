define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/response-codes',
        'js/constants/states', 'js/constants/events', 'js/constants/chained-keys'],
		function(service, $, ng, i18n, responseCodes, states, events, chainedKeys) {
	
	//TODO: REMOVE THIS!!
	service.factory('Single', [function(){return {};}]);
	
	service.factory('SingleFactory', [function() {
		var getMethodError = function(single) {
			return function(code, dto) {
				single.loaded[chainedKeys.SINGLE] = false;
				if(code === responseCodes.NOT_ALLOWED) {
					single.scope.$emit(events.SINGLE_ERROR_NOT_ALLOWED);
					return;
					/*
					i18n(function(t) {
						Alerts.warning(t('alerts:single.notAllowed'));
						$rootScope.$broadcast(events.BACK);
					});
					return;
					*/
				} else if(code === responseCodes.NOT_FOUND) {
					single.scope.$emit(events.SINGLE_ERROR_NOT_ALLOWED);
					return;
					/*
					i18n(function(t) {
						Alerts.warning(t('alerts:single.notFound'));
						$rootScope.$broadcast(events.BACK);
					});
					return;
					*/
				} else if(code === responseCodes.DENIED) {
					single.scope.$emit(events.SINGLE_ERROR_DENIED);
					return;
					/*
					$state.go(states.DENIED, undefined, {reload: true});
					return;
					*/
				}
			};
		};
		
		var getMethodApiError = function(single) {
			return function() {
				single.loaded[chainedKeys.SINGLE] = false;
			};
		};
		
		var updateSingle = function(single, results) {
			single[chainedKeys.DATA] = results;
			single.loaded[chainedKeys.SINGLE] = true;
			single.scope.$broadcast(events.SINGLE_CHANGE, single);
		};
	
		/*
		$rootScope.$on(events.CUSTOM_STATE_CHANGE_SUCCESS, function(event, toState, toParams, fromState, fromParams) {
			// in the case where the state has the same content type and the content path var is identical, it does not stale the data
			// except in the case where it would not stale the data, but the state is the same as previous so it must have been refreshed
			// overcomplex?
			if(!(toState.name !== fromState.name && typeof(toState.single) !== 'undefined' && typeof(toState.single.id) !== 'undefined' &&
					typeof(fromState.single) !== 'undefined' && typeof(fromState.single.id) !== 'undefined' &&
					toState.single.id === fromState.single.id &&
					(typeof(toState.single.pv) === 'undefined'  || toParams[toState.single.pv] === fromParams[toState.single.pv]))) {
				single = undefined;
				type = undefined;
			}
		});
		*/
		
		var checkUpdateSingle = function(single, results, countObject) {
			if(countObject.count >= countObject.total) {
				updateSingle(single, results);
			}
		};
		
		var getChainedSuccess = function(single, results, countObject) {
			return function(key) {
				return function(code, dto, page) {
					countObject.count = countObject.count + 1;
					if(typeof(results) !== 'undefined' && typeof(key) !== 'undefined') {
						if(code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
							results[key] = {code: code, dto: dto, page: page};
							single.loaded[key] = true;
						}
					}
					checkUpdateSingle(single, results, countObject);
				};
			};
		};
		
		var getChainedError = function(single, results, countObject, exceptions) {
			return function(key) {
				return function(code, dto, page) {
					countObject.count = countObject.count + 1;
					results[key] = {code: code, dto: dto, page: page};
					single.loaded[key] = false;
					checkUpdateSingle(single, results, countObject);
				};
			};
		};
		
		var getChainedApiError = function(single, results, countObject) {
			return function(key) {
				return function(code, dto, page) {
					countObject.count = countObject.count + 1;
					single.loaded[key] = false;
					checkUpdateSingle(single, results, countObject);
				};
			};
		};
		
		var handleChained = function(single, dto) {
			var results = {};
			results[chainedKeys.SINGLE] = dto;
			if(typeof(single.chained) === 'undefined' || !single.callChained || $.isEmptyObject(single.chained)) {
				updateSingle(single, results);
			} else {
				var key;
				var countObject = {count: 0, total: 0};
				var total = 0;
				var callback = getChainedSuccess(single, results, countObject);
				var error = getChainedError(single, results, countObject);
				var api = getChainedApiError(single, results, countObject);
				var chainedObject = single.chained;
				if(typeof(chainedObject) === 'function') {
					chainedObject = single.chained(dto);
				}
				for(key in chainedObject) {
					if(chainedObject.hasOwnProperty(key)) {
						if(typeof(chainedObject[key]) !== 'undefined') {
							countObject.total = countObject.total + 1;
							single.loaded[key] = undefined;
							delete single.loaded[key];
							chainedObject[key](callback(key), error(key), api(key));
						}
					}
				}
				if(countObject.total === 0) {
					updateSingle(single, results);
				}
			}
		};
	
		var getMethodCallback = function(single, count) {
			return function(code, dto, page) {
				if(code === responseCodes.SUCCESS || code === responseCodes.CREATED || code === responseCodes.DELETED) {
					if(typeof(dto) !== 'undefined') {
						// make sure this is from the same page that requested it!
						//if(count === single.requestCount) {
							handleChained(single, dto);
						//}
					}
				}
			};
		};
		
		var refresh = function(single, cc) {
			if(typeof(cc) !== 'undefined') {
				single.callChained = cc;
			}
			if(typeof(single.method) !== 'undefined') {
				single.loaded = {};
				single.method(getMethodCallback(single, single.requestCount), getMethodError(single), getMethodApiError(single));
			}
		};
		
		var createSingle = function(scope, view, m, c, cc, preview, autoLoad, autoSub, args, hiddenId) {
			var single = {
				args: {},
				loaded: {},
				show: true,
				showPageable: false,
				requestCount: 0
			};
			single[chainedKeys.DATA] = {};
			
			if((typeof(m) === 'undefined' && typeof(preview) === 'undefined') || typeof(view) === 'undefined' || typeof(scope) === 'undefined') {
				return undefined;
			}
			single.hiddenId = hiddenId;
			single.args = args;
			single.view = view;
			single.autoLoad = autoLoad || false;
			single.autoSub = autoSub || false;
			// replace chained as long as m gets replaced
			single.chained = c;
			single.callChained = cc;
			
			single.method = m;
			single.scope = scope;
			/*
			single.requestCount++;
			if(single.requestCount >= 1000) {
				// if the user exceeds this simultaneously with some magic browser, there is a definite issue
				single.requestCount = 0;
			}*/
			
			single.getSingleMain = function() {
				return single[chainedKeys.DATA][chainedKeys.SINGLE];
			};
			
			single.getChained = function(c) {
				return single[chainedKeys.DATA][c];
			};
			
			single.getArg = function(a) {
				var args = single.args || {};
				return args[a];
			};
			
			single.refresh = function(c) {
				if(typeof(single.method) !== 'undefined') {
					return refresh(single, c);
				} else {
					return undefined;
				}
			};
			
			single.refreshChained = function() {
				single.callChained = true;
				if(typeof(single[chainedKeys.DATA][chainedKeys.SINGLE]) !== 'undefined') {
					handleChained(single, single[chainedKeys.DATA][chainedKeys.SINGLE]);
				} else {
					single.refresh(single, true);
				}
			};
			single.getView = function() {
				return single.view;
			};
			
			if(ng.isDefined(preview)) {
				handleChained(single, preview);
			} else {
				m(getMethodCallback(single, single.requestCount), getMethodError(single), getMethodApiError(single));
			}
			
			return single;
		};
		
		return {
			createSingle: createSingle
		};
	}]);
});