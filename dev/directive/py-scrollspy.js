define(['./module', 'jquery', 'angular'], function(directive, $, ng) {
	'use strict';
	
	directive.directive('scrollSpy', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				var offset = parseInt(attr.scrollOffset, 10);
				if(!offset) {
					offset = 10;
				}
				if(typeof(elem) !== 'undefined' && typeof(elem.scrollspy) !== 'undefined') {
					$('body').scrollspy({"target": '#' + attr.scrollSpy, "offset": offset});
				}
				/*
				scope.$watch(attr.scrollSpy, function(value) {
					$timeout(function() {
						if(typeof(elem) !== 'undefined' && typeof(elem.scrollspy) !== 'undefined') {
							elem.scrollspy('refresh', {'offset': offset});
						}
					}, 1);
				}, true);
				*/
			}
		};
	}]);
	
	directive.directive('preventDefault', function() {
		return function(scope, element, attrs) {
			$(element).click(function(event) {
				event.preventDefault();
			});
		};
	});
	
	directive.directive('scrollTo', ['$window', 'Browser', function($window, Browser) {
		return {
			restrict: 'AC',
			compile: function() {
				function scrollInto(elementId) {
					if(!elementId) {
						$window.scrollTo(0, 0);
					}
					Browser.scrollTo(elementId);
				}
				return function(scope, element, attr) {
					element.bind('click', function(event) {
						scrollInto(attr.scrollTo);
					});
				};
			}
		};
	}]);
});