define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/util/i18n',
				'js/constants/events', 'js/constants/states', 'js/constants/tour-states', 'js/constants/cookies'],
		function(service, $, ng, utils, i18n, events, states, tourStates, cookies) {
	service.factory('Tour', ['$rootScope', '$state', '$window', 'Authentication', 'Cookies',
		function($rootScope, $state, $window, Authentication, Cookies) {
			var tour = {enabled: false, show: false, available: false};
			var status = {};
			var stateMap = {};
			var keyMap = {};
			var tempState, i, j;
			for(i in tourStates) {
				if(tourStates.hasOwnProperty(i)) {
					status[i] = {state: 0, authed: false, complete: false};
					tempState = tourStates[i];
					keyMap[tourStates[i].key] = tourStates[i];
					if(typeof(tempState.states) !== 'undefined') {
						for(j in tempState.states) {
							if(tempState.states.hasOwnProperty(j)) {
								stateMap[tempState.states[j]] = tempState;
							}
						}
					}
				}
			}
			
			var createStatusString = function() {
				var str;
				var i, k, a, s;
				for(i in status) {
					if(status.hasOwnProperty(i)) {
						if(!status[i].complete) {
							k = tourStates[i].key;
							s = status[i].state;
							a = 'f';
							if(status[i].authed) {
								a = 't';
							}
							if(typeof(str) === 'undefined') {
								str = '';
							} else {
								str = str + '-';
							}
							str = str + k + ':' + s + ':' + a;
						}
					}
				}
				return str;
			};
			
			var saveStatus = function() {
				if(tour.enabled) {
					Cookies.set(cookies.TOUR, createStatusString());
				} else {
					Cookies.remove(cookies.TOUR);
				}
			};
			
			var readStatusString = function(str) {
				if(typeof(str) === 'undefined') {
					return;
				}
				var i, s, state, a, pI;
				var set = str.split('-');
				for(i in status) {
					if(status.hasOwnProperty(i)) {
						status[i].complete = true;
					}
				}
				for(i = 0; i < set.length; i++) {
					s = set[i].split(':');
					state = keyMap[s[0]];
					if(typeof(state) !== 'undefined') {
						a = false;
						if(s[2] === 't') {
							a = true;
						}
						pI = $window.parseInt(s[1]);
						status[state.name].complete = false;
						status[state.name].authed = a;
						if(typeof(pI) === 'undefined' || window.isNaN(pI)) {
							pI = 0;
						}
						status[state.name].state = pI;
					}
				}
			};
			
			var readStatus = function() {
				var c = Cookies.get(cookies.TOUR);
				tour.show = false;
				if(typeof(c) !== 'undefined') {
					tour.enabled = true;
					readStatusString(c);
				}
			};
			
			readStatus();
			
			var setTour = function(section, subSection, authed) {
				tour.section = section;
				tour.subSection = subSection;
				tour.authed = authed;
				saveStatus();
				$rootScope.$broadcast(events.TOUR_SECTION_CHANGE, section, subSection, authed, tour.show);
			};
			var setDisabled = function(enabled) {
				tour.show = false;
				if(enabled) {
					tour.enabled = false;
				}
				saveStatus();
				$rootScope.$broadcast(events.TOUR_SECTION_CHANGE, undefined, undefined, undefined, false);
			};
			
			var authed = false;
			
			var checkAvailable = function(state) {
				if(typeof(state) === 'undefined') {
					return;
				}
				var t = stateMap[state];
				tour.available = false;
				if(typeof(t) !== 'undefined') {
					if(!status[t.name].complete) {
						if(authed || !status[t.name].authed) {
							tour.available = true;
						}
					}
				}
			};
			var setAuthenticated = function(authenticated) {
				authed = authenticated;
				checkAvailable($state.current.name);
				setDisabled(false);
			};
			setAuthenticated(Authentication.isAuthenticated());
			$rootScope.$on(events.LOGIN_CHANGE, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var endCheck = function() {
				var show = false;
				var ts;
				for(var i in status) {
					if(status.hasOwnProperty(i)) {
						if(!status[i].complete) {
							show = true;
							ts = tourStates[i];
							if(typeof(ts.states) !== 'undefined') {
								if(typeof(stateMap[$state.current.name]) !== 'undefined' && stateMap[$state.current.name].name === i) {
									activate(i, false, undefined, true);
									tour.show = show;
									return true;
								}
							}
						}
					}
				}
				tour.show = show;
				tour.available = false;
				return false;
			};
			
			var activate = function(section, restart, add, skipEndCheck) {
				if(typeof(section) === 'undefined') {
					return;
				}
				var set = true;
				var list;
				var s = status[section];
				var tempSection;
				if(restart) {
					for(tempSection in status) {
						if(status.hasOwnProperty(tempSection)) {
							status[tempSection].state = 0;
							status[tempSection].complete = false;
							status[tempSection].authed = false;
						}
					}
				}
				if(s.complete) {
					return;
				}
				tour.show = true;
				if(typeof(add) !== 'undefined') {
					s.state = s.state + add;
				}
				if(!s.authed) {
					list = tourStates[section].order;
					if(s.state >= list.length) {
						s.state = 0;
						s.authed = true;
						if(!authed) {
							tour.available = false;
						}
					} else if(s.state < 0) {
						s.state = 0;
						s.authed = false;
					}
				}
				// if it turns to authed, make sure authed isnt length 0
				if(s.authed) {
					list = tourStates[section].authedOrder;
					if(s.state >= list.length) {
						s.state = 0;
						s.complete = true;
						set = false;
						if(!skipEndCheck) {
							if(endCheck()) {
								return;
							}
						}
					} else if(s.state < 0) {
						s.state = tourStates[section].order.length - 1;
						if(s.state < 0) {
							s.state = 0;
						}
						s.authed = false;
					}
				}
				if(set) {
					setTour(section, list[s.state], s.authed);
				} else {
					setTour(undefined, undefined, false);
				}
			};
			
			$rootScope.$on(events.CUSTOM_STATE_CHANGE_SUCCESS, function(event, toState, toParams, fromState, fromParams) {
				checkAvailable(toState.name);
			});
			
			return {
				tour: tour,
				start: function(section) {
					tour.enabled = true;
					tour.show = true;
					if(typeof(section) !== 'undefined') {
						activate(section, true);
						tour.available = true;
					}
				},
				show: function() {
					if(typeof(stateMap[$state.current.name]) !== 'undefined') {
						tour.enabled = true;
						tour.show = true;
						activate(stateMap[$state.current.name].name);
					}
				},
				next: function(section) {
					activate(section, false, 1);
				},
				finish: function() {
					setDisabled(true);
				},
				hide: function() {
					setDisabled(false);
				}
			};
	}]);
});