define(['jquery', './module', 'js/constants/events', 'js/constants/public-keys'], function($, directive, events, pks) {
	'use strict';
	/*
	directive.directive('htmlText', [function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				// ensure it is not user submitted content, though it should be sanitized anyhow
				if(element.parents().find('.pyContent, .pyMarkdownContent, [py-bind-convert-html]').length === 0) {
					element.html(element.text());
				}
			}
		};
	}]);*/
	
	directive.directive('loadedInfo', ['Loaded', function(Loaded) {
		return {
			controller: function() {Loaded.partialInfo();}
		};
	}]);
	
	directive.directive('loadedPage', ['Loaded', function(Loaded) {
		return {
			controller: function() {Loaded.partialPage();}
		};
	}]);
	
	directive.directive('loadedSingle', ['Loaded', function(Loaded) {
		return {
			controller: function() {Loaded.partialSingle();}
		};
	}]);
	
	directive.directive('modalFocus', ['$timeout', '$parse', function($timeout, $parse) {
		return {
			link: function(scope, element, attrs) {
				var model = $parse(attrs.modalFocus);
				scope.$watch(model, function(value) {
					if(value === true) {
						$timeout(function() {
							element[0].focus();
						});
					}
				});
				/*
				element.bind('blur', function() {
					scope.$apply(model.assign(scope, false));
				});*/
			}
		};
	}]);
	
	directive.directive('paymentModalLink', ['$rootScope', function($rootScope) {
		return {
			controller: ['$element', function($element) {
				$rootScope.$broadcast(events.PAYMENT_MODAL_OPEN, $element[0]);
			}]
		};
	}]);
	
	directive.directive('pyRecaptcha', ['$rootScope', '$timeout', 'GRecaptcha', function($rootScope, $timeout, GRecaptcha) {
		return {
			restrict: 'A',
			template: "<i class='fa fa-5x fa-spin fa-spinner recaptcha-loading'></i><div class='g-recaptcha recaptcha-move'></div>",
			link: function(scope, element, attrs) {
				var elId = attrs.id;
				var grId;
				element.removeAttr('id');
				element.children('.g-recaptcha').attr('id', elId);
				var loaded = false;
				var recaptcha = GRecaptcha.getRecaptcha();
				var render = function(gr) {
					if(typeof(gr) === 'undefined') {
						return;
					}
					
					var expired = function() {
						gr.reset(grId);
					};
					
					var callback = function(response) {
					};
					
					grId = gr.render(elId, {
						'sitekey' : pks.GOOGLE_RECAPTCHA,
						'theme' : 'light',
						'type' : 'image',
						'size' : 'normal',
						'callback' : callback,
						'expired-callback' : expired
					});
					
					GRecaptcha.setCurrentId(grId);
				};
				if(typeof(recaptcha) !== 'undefined') {
					render(recaptcha);
				} else {
					$rootScope.$on(events.RECAPTCHA_LOADED, function(event, r) {
						render(r);
					});
				}
			}
		};
	}]);
	
});