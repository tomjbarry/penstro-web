define(['./module', 'jquery', 'angular', 'js/util/utils', 'js/constants/events', 'js/constants/tour-states', 'js/constants/values'],
function(directive, $, ng, utils, events, tourStates, values) {
	'use strict';
	
	var pyTourSection = 'pyTourSection';
	var pyTourSubSection = 'pyTourSubSection';
	var pyTourAuthed = 'pyTourAuthed';
	directive.directive(pyTourSection, ['$rootScope', '$compile', '$timeout', 'Browser', 'Tour',
    function($rootScope, $compile, $timeout, Browser, Tour) {
			return {
				restrict: 'A',
				link: function(scope, iElement, attrs) {
					//var elId = iElement[0].id;
					var tourSection = attrs[pyTourSection];
					var tourSubSection = attrs[pyTourSubSection];
					var tourAuthed = attrs[pyTourAuthed];
					if(typeof(tourAuthed) !== 'undefined' && tourAuthed.toUpperCase() === 'TRUE') {
						tourAuthed = true;
					} else {
						tourAuthed = false;
					}
					
					var options = {
						trigger: 'manual',
						template: "<div class='popover' role='tooltip'>" +
												"<div class='arrow'></div>" +
												"<h4 class='popover-title fs-2'></h4>" +
												"<div class='popover-content'></div>" +
												"<div class='popover-links'></div>" +
											"</div>"
					};
					var subElement;
					// very odd race condition happening here? sporadic and cannot reproduce
					if(typeof(iElement) !== 'undefined' && typeof(iElement.find) !== 'undefined') {
						var foundElement = iElement.find('.pyTourSectionSubElement');
						if(typeof(foundElement) !== 'undefined' && typeof(foundElement.filter) !== 'undefined') {
							subElement = foundElement.filter(':last');
							subElement.popover(options);
						}
					}
					var buttons = $compile(
												"<a href='" + values.VOID_ACTION + "' ng-click='hide()' class='pull-left btn'>" +
													"<i class='fa fa-fw fa-2x fa-stop' />" +
												"</a>" +
												"<a href='" + values.VOID_ACTION + "' ng-click='next()' class='pull-right btn'>" +
													"<i class='fa fa-fw fa-2x fa-play' />" +
												"</a>")(scope);
					var buttonsAdded = false;
					var shown = false;
					/*
					var elementInViewport = function(el) {
						if(typeof(el) === 'undefined') {
							return;
						}
						var top = el.offsetTop;
						var left = el.offsetLeft;
						var width = el.offsetWidth;
						var height = el.offsetHeight;
						while(el.offsetParent) {
							el = el.offsetParent;
							top += el.offsetTop;
							left += el.offsetLeft;
						}
						return (
							top >= window.pageYOffset &&
							left >= window.pageXOffset &&
							(top + height) <= (window.pageYOffset + window.innerHeight) &&
							(left + width) <= (window.pageXOffset + window.innerWidth)
						);
					};*/
					
					var ensureInView = function(id) {
						if(typeof(id) === 'undefined') {
							return;
						}
						// this is distracting, disable it for now
						/*if(elementInViewport(iElement[0]) && elementInViewport()) {
							return;
						} else {
							Browser.scrollTo(id);
						}*/
					};
					
					var setEnabled = function(enabled) {
						shown = enabled;
						if(enabled) {
							scope.$evalAsync(function() {
								$timeout(function() {
									if(typeof(subElement) !== 'undefined') {
										subElement.popover('show');
									}
								}, 1);
							});
						} else {
							if(typeof(subElement) !== 'undefined') {
								subElement.popover('hide');
							}
						}
					};
					
					var eventOff;
					if(typeof(tourSection) !== 'undefined' && typeof(tourSubSection) !== 'undefined' && typeof(tourAuthed) !== 'undefined') {
						eventOff = $rootScope.$on(events.TOUR_SECTION_CHANGE, function(event, section, subSection, authed, enabled) {
							if(!enabled) {
								setEnabled(false);
							} else {
								if(section === tourSection && subSection === tourSubSection && authed === tourAuthed) {
									setEnabled(true);
								} else if(shown) {
									setEnabled(false);
								}
							}
						});
					}
					scope.next = function() {
						Tour.next(tourSection);
					};
					scope.hide = function() {
						Tour.hide();
					};
					if(typeof(subElement) !== 'undefined') {
						subElement.on('shown.bs.popover', function() {
							if(!buttonsAdded) {
								iElement.find('.popover-links').filter(':last').html(buttons);
								buttonsAdded = true;
							}
							// wierd bug where it moves the top to the middle of the tooltip
							iElement.find('.arrow').css('top','');
							ensureInView(utils.getTourId(tourSection, tourSubSection, tourAuthed));
						});
					}
					scope.$on('$destroy', function() {
						if(typeof(eventOff) !== 'undefined') {
							eventOff();
							eventOff = undefined;
						}
						if(typeof(subElement) !== 'undefined') {
							subElement.unbind('shown.bs.popover');
						}
					});
				}
			};
		}
	]);
	
});