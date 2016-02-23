define(['./module', 'jquery', 'angular', 'js/util/utils'],
		function(service, $, ng, utils) {
	service.factory('Reloader', ['$location', '$window', '$state', 'Loaded', function($location, $window, $state, Loaded) {
		
		var resetLoaded = function() {
			Loaded.resetContent(false, false, false);
		};
		
		return {
			reload: function() {
				//$state.reload();
			},
			fullRefresh: function() {
				var path = $window.location.pathname;
				var query = $location.search();
				var queryString = utils.constructFilteredQueryString(query);
				$window.location.href = $window.location.pathname + queryString;
			},
			reloadPrevious: function(options) {
				var query = {};
				var queryString = '';
				if(typeof(options) !== 'undefined') {
					if(typeof(options.query) !== 'undefined') {
						var key;
						
						var currentQuery = $location.search();
						if(typeof(currentQuery) !== 'undefined') {
							for(key in currentQuery) {
								if(currentQuery.hasOwnProperty(key)) {
									query[key] = currentQuery[key];
								}
							}
						}
						
						for(key in options.query) {
							if(options.query.hasOwnProperty(key)) {
								query[key] = options.query[key];
							}
						}
						queryString = utils.constructQueryString(options.query);
					}
					if(typeof(options.url) !== 'undefined') {
						$window.location.href = options.url + queryString;
						resetLoaded();
					} else {
						$window.location.search = queryString;
						resetLoaded();
					}
				} else {
					var path = $window.location.pathname;
					query = $location.search();
					queryString = utils.constructFilteredQueryString(query);
					$window.location.href = $window.location.pathname + queryString;
					resetLoaded();
				}
			}
		};
	}]);
});