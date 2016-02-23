define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/utils', 'js/constants/values', 'js/constants/help-topics', 'js/constants/webapp',
'js/constants/view-urls', 'js/constants/params'],
function(directive, $, ng, i18n, utils, values, helpTopics, webapp, viewUrls, params) {
	'use strict';
	
	var pyBindConvertHtml = 'pyBindConvertHtml';
	
	// havent i18ned it yet!
	var getErrorHtml = function() {
		return "<span>" +
			"<div class='row'>" +
				"<span class='col-xs-12 well'>" +
					"<strong class='pyBCHError'></strong>" +
				"</span>" +
			"</div>" +
			"<span class='pyBCHMarkup'></span>" +
		"</span>";
	};
	
	var checkExternalHrefs = function(i, href) {
		try {
			// the this refers to jquery a object; only use this function within an .attr('href', checkExternalHrefs) call
			var protocol = href.split('/')[0];
			if(!(utils.isExternalUrl(webapp.DOMAIN, this.hostname) || (protocol !== 'http:' && protocol !== 'https:'))) {
				return href;
			}
			var p = {};
			p[params.EXTERNAL_URL] = href;
			return utils.constructPath(viewUrls.EXTERNAL_URL, undefined, p);
		} catch(e) {
			return utils.constructPath(viewUrls.NOT_FOUND);
		}
	};
	
	var applyFilters = function(compiled) {
		if(typeof(compiled) === 'undefined') {
			return undefined;
		}
		compiled.find('a[href]').attr('href', checkExternalHrefs);
		return compiled;
	};
	
	var get = function(directiveName) {
		return ['$rootScope', '$sce', '$sanitize', '$parse', '$compile',
      function($rootScope, $sce, $sanitize, $parse, $compile) {
				return {
					restrict: 'A',
					link: function(scope, element, attr) {
						element.data('$binding', attr[directiveName]);
						
						var parsed = $parse(attr[directiveName]);
						
						function getStringValue() {
							return (parsed(scope) || '').toString();
						}
						
						var errorHtml = $compile(getErrorHtml())(scope);
						
						i18n(function(t) {
							errorHtml.find('.pyBCHError').text(t('shared:html.error'));
						});
						
						// no tooltip on help link to avoid client side i18n of all help!
						var getImageHtml = function() {
							return "<span py-secure-image></span>";
						};
						
						scope.$watch(getStringValue, function pyBindHtmlWatchAction() {
							var text;
							try {
								var t = parsed(scope);
								if(typeof(t) === 'undefined') {
									t = '';
								}
								//var compiled = $compile($sanitize(Converter.convert(parsed(scope))))({});
								var compiled = $sce.getTrustedHtml($sanitize(t));
								element.html(compiled);
								applyFilters(element);
							} catch(e) {
								text = parsed(scope);
								if(typeof(text) === 'undefined' || typeof(text) !== typeof('')) {
									text = '';
								}
								var lines = text.split('\n');
								var markupElement = $compile('<p></p>')(scope);
								var tempEle;
								for(var i = 0; i < lines.length; i++) {
									tempEle = $compile('<p></p>')(scope);
									tempEle.text(lines[i]);
									markupElement.append(tempEle);
								}
								errorHtml.find('.pyBCHMarkup').html(markupElement);
								element.html(errorHtml);
							}
						});
					}
				};
			}
		];
	};
	
	directive.directive(pyBindConvertHtml, get(pyBindConvertHtml));
	
});