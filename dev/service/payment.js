define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n',
        'js/constants/params', 'js/constants/events', 'js/constants/regexes', 'js/constants/cookies', 'js/constants/values', 'js/constants/response-codes'],
		function(service, $, ng, utils, i18n, params, events, regexes, cookies, values, responseCodes) {
	
	service.factory('Payment', ['$rootScope', 'Authentication', 'Alerts', 'AutoRefresh', 'EventManager', 'Cookies', 'CacheDelay', 'pyPayment',
		function($rootScope, Authentication, Alerts, AutoRefresh, EventManager, Cookies, CacheDelay, pyPayment) {
		
			var processing = {processing: 0};
			var storedSingles = {};
			
			var toggleProcessing = function(add) {
				if(add) {
					processing.processing++;
				} else {
					processing.processing--;
				}
				if(processing.processing < 0) {
					processing.processing = 0;
				}
			};
			var clearProcessing = function() {
				processing = 0;
			};
		
			var clearPaykeys = function() {
				Cookies.remove(cookies.PAYKEYS);
			};
			
			var createPaykeyString = function(paykey, isSingle, single, username, amount, altId) {
				if(typeof(paykey) === 'undefined') {
					return undefined;
				}
				if(!isSingle) {
					isSingle = 'f';
				} else {
					isSingle = 't';
				}
				if(typeof(username) === 'undefined') {
					username = '';
				}
				if(typeof(amount) === 'undefined') {
					amount = '';
				}
				if(typeof(altId) === 'undefined') {
					altId = '';
				}
				storedSingles[paykey] = single;
				return paykey + regexes.PAYKEY_COOKIE_DATA_DELIMITER + isSingle +
					regexes.PAYKEY_COOKIE_DATA_DELIMITER + username +
					regexes.PAYKEY_COOKIE_DATA_DELIMITER + amount +
					regexes.PAYKEY_COOKIE_DATA_DELIMITER + altId;
			};
			
			var getPaykeyObjectFromString = function(str) {
				var pk = {};
				if(typeof(str) !== 'undefined') {
					var arr = str.split(regexes.PAYKEY_COOKIE_DATA_DELIMITER);
					pk.paykey = arr[0];
					pk.isSingle = false;
					if(arr[1] === 't') {
						pk.isSingle = true;
					}
					if(typeof(arr[2]) !== 'undefined' && arr[2] !== '') {
						pk.username = arr[2];
					}
					if(typeof(arr[3]) !== 'undefined' && arr[3] !== '') {
						pk.amount = arr[3];
					}
					if(typeof(arr[4]) !== 'undefined' && arr[4] !== '') {
						pk.altId = arr[4];
					}
					pk.single = storedSingles[pk.paykey];
					delete storedSingles[pk.paykey];
				}
				return pk;
			};
			
			var authed;
			
			var setAuthenticated = function(authenticated) {
				authed = authenticated;
				if(!authenticated) {
					clearPaykeys();
					clearProcessing();
					//$rootScope.$broadcast(events.PAYMENT_PROCESSING_CHANGE, false);
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
		
			var getPaykeys = function() {
				var c = Cookies.get(cookies.PAYKEYS);
				if(typeof(c) === 'undefined') {
					return [];
				}
				return c.split(regexes.PAYKEY_COOKIE_DELIMITER);
			};
			var setPaykeys = function(paykeys) {
				var s = '';
				var delim = '';
				if(typeof(paykeys) !== 'undefined') {
					if(paykeys.length === 0) {
						clearPaykeys();
						return;
					}
					for(var i = 0; i < paykeys.length; i++) {
						s = s + delim + paykeys[i];
						delim = regexes.PAYKEY_COOKIE_DELIMITER;
					}
					Cookies.set(cookies.PAYKEYS, s);
				}
			};
			var removePaykey = function(paykey) {
				if(typeof(paykey) === 'undefined') {
					return;
				}
				var pks = getPaykeys();
				if(typeof(pks) !== 'undefined') {
					for(var i = 0; i < pks.length; i++) {
						var pk = getPaykeyObjectFromString(pks[i]);
						if(pk.paykey === paykey) {
							pks.splice(i, 1);
							setPaykeys(pks);
							return;
						}
					}
				}
			};
		
			var addPaykey = function(paykey, isSingle, single, username, amount, altId) {
				if(typeof(paykey) !== 'undefined') {
					var pks = getPaykeys();
					var pk = createPaykeyString(paykey, isSingle, single, username, amount, altId);
					if(typeof(pk) !== 'undefined') {
						pks.push(pk);
						if(pks.length > values.PAYMENT_COOKIE_LIMIT) {
							pks.shift();
						}
						setPaykeys(pks);
					}
				}
			};
		
			var constructPaymentUrl = function(url) {
				var paymentUrl, paykey;
				if(typeof(url) === 'undefined' || url === '') {
					paymentUrl = undefined;
					paykey = undefined;
				}
				var s = url.split('?');
				paymentUrl = s[0];
				var queryObject = utils.getQueryObject('?' + s[1]);
				paykey = queryObject.paykey;
				return [paymentUrl, paykey];
			};
			
			var addPaymentCheck = function(paykey, success, altId) {
				if(typeof(success) === 'undefined') {
					return;
				}
				var callback = function(s, e, apiE) {
					pyPayment.check(s, e, apiE, paykey, altId);
				};
				
				var checkedFailure = function() {
					// count ran out, end the processing!
					removePaykey(paykey);
					toggleProcessing(false);
					//$rootScope.$broadcast(events.PAYMENT_PROCESSING_CHANGE, false);
				};
				
				AutoRefresh.deferRequest(callback, success, undefined, undefined, values.PAYMENT_CHECK_DEFER, values.PAYMENT_CHECK_RETRIES, undefined, false, checkedFailure);
			};
			
			var markPayment = function(paykey, isSingle, single, username, amount, altId) {
				if(typeof(paykey) === 'undefined') {
					return;
				}
				
				var markedSuccess = function(code, dto, p) {
					var checkSuccess = function() {
						removePaykey(paykey);
						if(typeof(isSingle) === 'undefined') {
							isSingle = false;
						}
						i18n(function(t) {
							if(isSingle) {
								Alerts.success(t('alerts:appreciation.success'));
								/*
								CacheDelay.postingOrComment(function() {
									$rootScope.$broadcast(events.APPRECIATION_SUCCESS, username);
									toggleProcessing(false);
									//$rootScope.$broadcast(events.PAYMENT_PROCESSING_CHANGE, false);
								}, true);
								*/
								$rootScope.$broadcast(events.APPRECIATION_SHOW_RESPONSE, username);
								if(ng.isDefined(single) && ng.isDefined(single.scope)) {
									single.scope.$broadcast(events.APPRECIATION_SUCCESS, single, amount);
								}
								toggleProcessing(false);
							} else {
								$rootScope.$broadcast(events.BALANCE_CHANGE);
								toggleProcessing(false);
								//$rootScope.$broadcast(events.PAYMENT_PROCESSING_CHANGE, false);
							}
						});
					};
					addPaymentCheck(paykey, checkSuccess, altId);
				};
				
				var errorCallback = function(s, e, apiE) {
					pyPayment.mark(s, e, apiE, paykey, altId);
				};
				
				var error = function() {
					AutoRefresh.deferRequest(errorCallback, markedSuccess, undefined, undefined, values.PAYMENT_MARK_DEFER, values.PAYMENT_MARK_RETRIES, undefined, true);
				};

				var checkError = function(code, dto) {
					if(code === responseCodes.NOT_ALLOWED || code === responseCodes.NOT_FOUND) {
						removePaykey(paykey);
						return;
					} else {
						error();
					}
				};
				
				pyPayment.mark(markedSuccess, checkError, error, paykey, altId);
				toggleProcessing(true);
				//$rootScope.$broadcast(events.PAYMENT_PROCESSING_CHANGE, true);
			};
			
			// mark all paykeys and check each
			var pks = getPaykeys();
			for(var i = 0; i < pks.length; i++) {
				var pk = getPaykeyObjectFromString(pks[i]);
				markPayment(pk.paykey, pk.isSingle, pk.single, pk.username, pk.amount, pk.altId);
			}
			
			AutoRefresh.manageRefresh(function() {
				// mark all paykeys, do not check. this is in case of wierd crap
				var pks = getPaykeys();
				var silent = function(){};
				for(var i = 0; i < pks.length; i++) {
					var pk = getPaykeyObjectFromString(pks[i]);
					pyPayment.mark(silent, silent, silent, pk.paykey, pk.altId);
				}
			}, values.PAYMENT_AUTO_MARK_SECONDS);
			
			return {
				manageAppreciationEvent: function(scope, callback) {
					EventManager.manage(events.APPRECIATION_SUCCESS, scope, callback);
				},
				payment: function(url, isSingle, single, username, amount, altId) {
					var result = constructPaymentUrl(url);
					if(typeof(result) !== 'undefined') {
						var paymentUrl = result[0];
						var paykey = result[1];
						$rootScope.$broadcast(events.PAYMENT, paymentUrl, paykey, isSingle, single, username, amount, altId);
					}
				},
				paymentStarted: function(paykey, isSingle, single, username, amount, altId) {
					addPaykey(paykey, isSingle, single, username, amount, altId);
				},
				paymentFinished: function(paykey, isSingle, single, username, amount, altId) {
					markPayment(paykey, isSingle, single, username, amount, altId);
				},
				processing: processing
			};
		}
	]);
});