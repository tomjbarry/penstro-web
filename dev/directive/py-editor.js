define(['./module', 'jquery', 'angular', 'js/inlib/wysihtml', 'js/util/i18n', 'js/util/extra-templates', 'js/constants/resources', 'js/constants/states',
				'js/constants/path-variables', 'js/constants/values', 'js/constants/regexes', 'js/constants/wysihtml-parser-rules', 'js/constants/events',
				'js/constants/scope-variables', 'js/constants/chained-keys'],
	function(directive, $, ng, wysihtml, i18n, templates, resources, states, pathVariables, values, regexes, parserRules, events, scopeVars, chainedKeys) {
	'use strict';
	
	directive.directive('pyEditor', ['$compile', '$timeout', '$window', '$modal', '$state', '$parse', '$rootScope', 'Single', 'ModalInterface', 'MarkdownConverter',
	function($compile, $timeout, $window, $modal, $state, $parse, $rootScope, Single, ModalInterface, Converter) {
		var nextId = 0;
		var minRepeat = 5;
		
		return {
			restrict: 'A',
			replace: true,
			template: "<div class='pyEditor'></div>",
			scope: {},
			link: function(scope, iElement, attrs) {
				var id = attrs.id;
				var model = attrs.pyEditor;
				var dirtyForm = attrs.dirtyForm;
				var placeholder = attrs.placeholder;
				var placeholderString = '';
				if(typeof(placeholder) !== 'undefined') {
					placeholderString = " placeholder='" + placeholder + "'";
				}
				
				scope.labels = {};
				scope.tooltips = {};
				scope.titles = {};
				scope.active = {};
				scope.showAdvanced = false;
				scope.htmlMode = false;
				var advancedLoaded = false;
				scope.showTable = false;
				scope.showUser = false;
				scope.showTag = false;
				scope.showLink = false;
				scope.showImage = false;
				scope.showAttribution = false;
				scope.dropdownText = false;
				scope.dropdownAlign = false;
				scope.dropdownHeader = false;
				scope.dropdownFontSize = false;
				scope.dropdownFormat = false;
				scope.dropdownColor = false;
				scope.dropdownLinks = false;
				scope.dropdownSettings = false;
				
				i18n(function(t) {
					var add = function(s) {
						scope.labels[s] = t('shared:editorButtons.' + s);
					};
					add('bold');
					add('italic');
					add('underline');
					add('superscript');
					add('subscript');
					
					add('alignCenter');
					add('alignLeft');
					add('alignRight');
					add('alignJustify');
					
					add('h1');
					add('h2');
					add('normal');
					add('quote');
					add('code');
					
					add('fontXSmall');
					add('fontSmall');
					add('fontMedium');
					add('fontLarge');
					add('fontXLarge');
					
					add('ul');
					add('ol');
					add('indent');
					add('lineBreak');
					add('pageBreak');
					
					add('colorBlack');
					add('colorRed');
					add('colorGreen');
					add('colorBlue');
					add('colorCyan');
					add('colorMagenta');
					add('colorYellow');
					
					add('user');
					add('tag');
					add('link');
					add('unlink');
					add('image');
					add('imageWidth');
					add('imageHeight');
					
					add('attribution');
					add('attributionAuthor');
					add('attributionAuthorLink');
					add('attributionTitle');
					add('attributionTitleLink');
					add('attributionLicense');
					add('attributionLicenseLink');
					
					add('undo');
					add('redo');
					add('toggleView');
					
					add('save');
					add('cancel');
					
					scope.tooltips.text = t('shared:editorButtons.tooltips.text');
					scope.tooltips.align = t('shared:editorButtons.tooltips.align');
					scope.tooltips.header = t('shared:editorButtons.tooltips.header');
					scope.tooltips.fontSize = t('shared:editorButtons.tooltips.fontSize');
					scope.tooltips.format = t('shared:editorButtons.tooltips.format');
					scope.tooltips.color = t('shared:editorButtons.tooltips.color');
					scope.tooltips.links = t('shared:editorButtons.tooltips.links');
					scope.tooltips.settings = t('shared:editorButtons.tooltips.settings');
					
					scope.titles.bold = t('shared:editorButtons.titles.bold');
					scope.titles.italic = t('shared:editorButtons.titles.italic');
					scope.titles.underline = t('shared:editorButtons.titles.underline');
					scope.titles.indent = t('shared:editorButtons.titles.indent');
					scope.titles.undo = t('shared:editorButtons.titles.undo');
					scope.titles.redo = t('shared:editorButtons.titles.redo');
					
					scope.markdownWarning = t('alerts:editor.markdownWarning');
				});
				
				// scope appears to be created on first element, so encase all in a div for the scope, but model is already set to parent?
				var buttonSpacer = "<span class='buttonspacer'></span>";
				
				var newElement = $compile(
						"<div class='row'>" +
							"<span class='col-xs-12 well ng-hide' ng-hide='showAdvanced'><span ng-bind='markdownWarning'></span></span>" +
							"<div class='pyEditorButtonRow toolbar col-xs-12'>" +
								templates.editorButtonDropdownOuter('dropdownText', 'fa-font', 'tooltips.text', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();bold($event)', 'fa-bold', 'labels.bold', 'active.bold', '{{titles.bold}}') +
										templates.editorButtonDropdownInner('clearDropdowns();italic($event)', 'fa-italic', 'labels.italic', 'active.italic', '{{titles.italic}}') +
										templates.editorButtonDropdownInner('clearDropdowns();underline($event)', 'fa-underline', 'labels.underline', 'active.underline', '{{titles.underline}}') +
										templates.editorButtonDropdownInner('clearDropdowns();superscript($event)', 'fa-superscript', 'labels.superscript', 'active.superscript') +
										templates.editorButtonDropdownInner('clearDropdowns();subscript($event)', 'fa-subscript', 'labels.subscript', 'active.subscript')
								) +
								templates.editorButtonDropdownOuter('dropdownAlign', 'fa-align-center', 'tooltips.align', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();alignLeft($event)', 'fa-align-left', 'labels.alignLeft', 'active.justifyLeft') +
										templates.editorButtonDropdownInner('clearDropdowns();alignRight($event)', 'fa-align-right', 'labels.alignRight', 'active.justifyRight') +
										templates.editorButtonDropdownInner('clearDropdowns();alignCenter($event)', 'fa-align-center', 'labels.alignCenter', 'active.justifyCenter') +
										templates.editorButtonDropdownInner('clearDropdowns();alignJustify($event)', 'fa-align-justify', 'labels.alignJustify', 'active.justifyFull')
								) +
								templates.editorButtonDropdownOuter('dropdownHeader', 'fa-header', 'tooltips.header', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();header1($event)', 'fa-header', 'labels.h1') +
										templates.editorButtonDropdownInner('clearDropdowns();header2($event)', 'fa-header', 'labels.h2') +
										templates.editorButtonDropdownInner('clearDropdowns();normal($event)', 'fa-paragraph', 'labels.normal', undefined, undefined, 'showAdvanced') +
										templates.editorButtonDropdownInner('clearDropdowns();blockquote($event)', 'fa-quote-left', 'labels.quote') +
										templates.editorButtonDropdownInner('clearDropdowns();code($event)', 'fa-code', 'labels.code')
								) +
								templates.editorButtonDropdownOuter('dropdownFontSize', 'fa-text-height', 'tooltips.fontSize', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();fontXSmall($event)', 'fa-angle-double-down', 'labels.fontXSmall', 'active.fontSizex-small') +
										templates.editorButtonDropdownInner('clearDropdowns();fontSmall($event)', 'fa-angle-down', 'labels.fontSmall', 'active.fontSizesmall') +
										templates.editorButtonDropdownInner('clearDropdowns();fontMedium($event)', 'fa-angle-right', 'labels.fontMedium', 'active.fontSizemedium') +
										templates.editorButtonDropdownInner('clearDropdowns();fontLarge($event)', 'fa-angle-up', 'labels.fontLarge', 'active.fontSizelarge') +
										templates.editorButtonDropdownInner('clearDropdowns();fontXLarge($event)', 'fa-angle-double-up', 'labels.fontXLarge', 'active.fontSizex-large')
								) +
								templates.editorButtonDropdownOuter('dropdownFormat', 'fa-paragraph', 'tooltips.format', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();unorderedList($event)', 'fa-list-ul', 'labels.ul') +
										templates.editorButtonDropdownInner('clearDropdowns();orderedList($event)', 'fa-list-ol', 'labels.ol') +
										templates.editorButtonDropdownInner('clearDropdowns();indent($event)', 'fa-indent', 'labels.indent', undefined, '{{titles.indent}}') +
										templates.editorButtonDropdownInner('clearDropdowns();lineBreak($event)', 'fa-ellipsis-v', 'labels.lineBreak') +
										templates.editorButtonDropdownInner('clearDropdowns();pageBreak($event)', 'fa-ellipsis-h', 'labels.pageBreak')
								) +
								templates.editorButtonDropdownOuter('dropdownColor', 'fa-paint-brush', 'tooltips.color', '!htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();colorRed($event)', 'fa-tint wysiwyg-color-red', 'labels.colorRed', 'active.foreColorred') +
										templates.editorButtonDropdownInner('clearDropdowns();colorGreen($event)', 'fa-tint wysiwyg-color-green', 'labels.colorGreen', 'active.foreColorgreen') +
										templates.editorButtonDropdownInner('clearDropdowns();colorBlue($event)', 'fa-tint wysiwyg-color-blue', 'labels.colorBlue', 'active.foreColorblue') +
										templates.editorButtonDropdownInner('clearDropdowns();colorCyan($event)', 'fa-tint wysiwyg-color-cyan', 'labels.colorCyan', 'active.foreColorcyan') +
										templates.editorButtonDropdownInner('clearDropdowns();colorMagenta($event)', 'fa-tint wysiwyg-color-magenta', 'labels.colorMagenta', 'active.foreColormagenta') +
										templates.editorButtonDropdownInner('clearDropdowns();colorYellow($event)', 'fa-tint wysiwyg-color-yellow', 'labels.colorYellow', 'active.foreColoryellow')
								) +
								templates.editorButtonDropdownOuter('dropdownLinks', 'fa-external-link', 'tooltips.links', '!htmlMode',
										templates.editorButtonDropdownInner('dropdownLinks = false;addUser($event)', 'fa-user', 'labels.user') +
										templates.editorButtonDropdownInner('dropdownLinks = false;addTag($event)', 'fa-tag', 'labels.tag') +
										templates.editorButtonDropdownInner('clearDropdowns();link($event)', 'fa-link', 'labels.link') +
										templates.editorButtonDropdownInner('clearDropdowns();removeLink($event)', 'fa-unlink', 'labels.unlink', undefined, undefined, 'showAdvanced') +
										templates.editorButtonDropdownInner('clearDropdowns();image($event)', 'fa-image', 'labels.image') +
										templates.editorButtonDropdownInner('clearDropdowns();attribution($event)', 'fa-info', 'labels.attribution')
								) +
								templates.editorButtonDropdownOuter('dropdownSettings', 'fa-gear', 'tooltips.settings', 'showAdvanced && !htmlMode',
										templates.editorButtonDropdownInner('clearDropdowns();undo($event)', 'fa-undo', 'labels.undo', undefined, '{{titles.undo}}') +
										templates.editorButtonDropdownInner('clearDropdowns();redo($event)', 'fa-repeat', 'labels.redo', undefined, '{{titles.redo}}') +
										templates.editorButtonDropdownInner('clearDropdowns();toggleView($event)', 'fa-terminal', 'labels.toggleView')
								) +
								templates.editorButton('clearDropdowns();toggleView($event)', 'fa-terminal', 'labels.toggleView', undefined, undefined, 'showAdvanced && htmlMode') +
							"</div>" +
							"<div class='col-xs-12 pyEditorShowUser' ng-show='showUser'>" +
								"<label ng-bind='labels.user + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='userName' class='pyEditorUserName'>" +
								"<button type='button' class='btn btn-xs' ng-click='cancelInsert($event)' ng-bind='labels.cancel'></button>" +
								"<button type='button' class='btn btn-xs' ng-click='saveUser($event)' ng-bind='labels.save'></button>" +
							"</div>" +
							"<div class='col-xs-12 pyEditorShowTag' ng-show='showTag'>" +
								"<label ng-bind='labels.tag + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='tagName' class='pyEditorTagName'>" +
								"<button type='button' class='btn btn-xs' ng-click='cancelInsert($event)' ng-bind='labels.cancel'></button>" +
								"<button type='button' class='btn btn-xs' ng-click='saveTag($event)' ng-bind='labels.save'></button>" +
							"</div>" +
							"<div class='col-xs-12 pyEditorShowLink' ng-show='showLink'>" +
								"<label ng-bind='labels.link + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='linkHref' class='pyEditorLinkHref' placeholder='https://'>" +
								"<button type='button' class='btn btn-xs' ng-click='cancelInsert($event)' ng-bind='labels.cancel'></button>" +
								"<button type='button' class='btn btn-xs' ng-click='saveLink($event)' ng-bind='labels.save'></button>" +
							"</div>" +
							"<div class='col-xs-12 pyEditorShowImage' ng-show='showImage'>" +
								"<label ng-bind='labels.image + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='imageHref' class='pyEditorImageHref' placeholder='https://'>" +
								"<label ng-bind='labels.imageWidth + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='imageWidth'>" +
								"<label ng-bind='labels.imageHeight + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='imageHeight'>" +
								"<button type='button' class='btn btn-xs' ng-click='cancelInsert($event)' ng-bind='labels.cancel'></button>" +
								"<button type='button' class='btn btn-xs' ng-click='saveImage($event)' ng-bind='labels.save'></button>" +
							"</div>" +
							"<div class='col-xs-12 pyEditorShowAttribution' ng-show='showAttribution'>" +
								"<label ng-bind='labels.attributionAuthor + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionAuthor' class='pyEditorAttributionAuthor'>" +
								"<label ng-bind='labels.attributionAuthorLink + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionAuthorLink' class='pyEditorAttributionAuthorLink' placeholder='https://'>" +
								"<label ng-bind='labels.attributionTitle + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionTitle' class='pyEditorAttributionTitle'>" +
								"<label ng-bind='labels.attributionTitleLink + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionTitleLink' class='pyEditorAttributionTitleLink' placeholder='https://'>" +
								"<br>" +
								"<label ng-bind='labels.attributionLicense + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionLicense' class='pyEditorAttributionLicense'>" +
								"<label ng-bind='labels.attributionLicenseLink + \":&nbsp;\"'></label>" +
								"<input type='text' ng-model='attributionLicenseLink' class='pyEditorAttributionLicenseLink' placeholder='https://'>" +
								"<button type='button' class='btn btn-xs' ng-click='cancelInsert($event)' ng-bind='labels.cancel'></button>" +
								"<button type='button' class='btn btn-xs' ng-click='saveAttribution($event)' ng-bind='labels.save'></button>" +
							"</div>" +
							"<textarea contenteditable='true' ng-model='textareaData' class='col-xs-12' ng-hide='showAdvanced' rows='" + values.TEXTAREA_ROWS + "' cols='" + values.TEXTAREA_COLS + "'" + placeholderString + "></textarea>" +
							"<div contenteditable='true' ng-model='textData' class='col-xs-12 pyEditorTextareaDiv' ng-show='showAdvanced'></div>" +
						"</div>"
				)(scope);
				
				var jqEleMarkdown = $(newElement).find('textarea');
				var jqEle = $(newElement).find('.pyEditorTextareaDiv');
				var e = jqEle[0];
				if(typeof(e) !== 'undefined' && typeof(e.value) === 'undefined') {
					e.value = '';
				}
				if(typeof(id) !== 'undefined') {
					jqEle.attrs('id', id);
				}
				iElement.html(newElement);
				
				var dirtyFormParsed = $parse('$parent.' + dirtyForm);
				
				scope.modelChangeDirtyForm = function() {
					if(typeof(dirtyForm) !== 'undefined') {
						dirtyFormParsed(scope).$dirty = true;
						dirtyFormParsed(scope).$pristine = false;
					}
				};

				/*globals wysihtml5 */
				parserRules.extendRules(wysihtml5);
				var wysihtmlOptions = {
						parserRules: parserRules.parserRules,
						//toolbar: newElement.find('.toolbar')[0]
						name: 'pyEditorIframe',
						stylesheets: resources.cssBase
				};
				
				/*globals wysihtml5 */
				var editor = new wysihtml5.Editor(e, wysihtmlOptions);
				if(wysihtml5.browser.supported()) {
					scope.showAdvanced = true;
				}
				var modelParsed = $parse('$parent.' + model);
				
				var composer = editor.composer;
				var jqEleToolbar = $(newElement).find('.pyEditorButtonRow');
				
				scope.$on('$destroy', function() {
					try {
						editor.destroy();
					} catch(e) {
						//continue
					}
					$(jqEleToolbar).find('.editor-button').off();
					$(jqEleToolbar).find('.editor-dropdown-button').off();
					$(jqEleToolbar).find('.editor-list-button').off();
				});
				
				scope.clearDropdowns = function() {
					scope.dropdownText = false;
					scope.dropdownAlign = false;
					scope.dropdownHeader = false;
					scope.dropdownFontSize = false;
					scope.dropdownFormat = false;
					scope.dropdownColor = false;
					scope.dropdownLinks = false;
					scope.dropdownSettings = false;
				};
				
				var clearToolbar = function() {
					scope.showUser = false;
					scope.showTag = false;
					scope.showLink = false;
					scope.showImage = false;
					scope.showAttribution = false;
				};
				
				var checkState = function(state, value) {
					scope.active[state] = false;
					if(typeof(value) === 'undefined') {
						if(composer.commands.state(state)) {
							scope.active[state] = true;
						}
					} else {
						scope.active[state + value] = false;
						if(composer.commands.state(state, value) || composer.commands.stateValue(state, value)) {
							scope.active[state + value] = true;
						}
					}
				};
				
				var updateStates = function() {
					var value;
					//jqEleToolbar.find('.active').removeClass('active');
					// add active class here!
					
					checkState('bold');
					checkState('italic');
					checkState('underline');
					checkState('superscript');
					checkState('subscript');
					
					checkState('justifyLeft');
					checkState('justifyRight');
					checkState('justifyCenter');
					checkState('justifyFull');
					
					checkState('foreColor', 'red');
					checkState('foreColor', 'green');
					checkState('foreColor', 'blue');
					checkState('foreColor', 'cyan');
					checkState('foreColor', 'magenta');
					checkState('foreColor', 'yellow');
					
					checkState('fontSize', 'x-small');
					checkState('fontSize', 'small');
					checkState('fontSize', 'medium');
					checkState('fontSize', 'large');
					checkState('fontSize', 'x-large');
				};
				
				var updateTextAdvanced = function() {
					if(!advancedLoaded) {
						return;
					}
					var text;
					try {
						text = editor.getValue();
					} catch(e) {
						return;
					}
					if(typeof(text) === 'undefined') {
						text = '';
					}
					modelParsed.assign(scope, editor.getValue());
					scope.textData = text;
				};
				
				var updateTextMarkdown = function(text) {
					/*
					var text = editor.getValue();
					if(typeof(text) === 'undefined') {
						text = '';
					}
					modelParsed.assign(scope, Converter.convert(editor.getValue()));
					*/

					if(typeof(text) === 'undefined') {
						text = '';
					}
					modelParsed.assign(scope, Converter.convert(text));
					// gotta do both!
					scope.textareaData = text;
					// necessary so the cursor position is correct when the model changes
					e.value = text;
				};
				
				var eventText = function(text) {
					if(typeof(e.dispatchEvent) !== 'undefined' && typeof($window.document.createEvent) !== 'undefined') {
						var event = $window.document.createEvent('TextEvent');
						if(typeof(event) !== 'undefined' && typeof(event.initTextEvent) !== 'undefined') {
							// extra arguments for IE
							try {
								event.initTextEvent('textInput', true, true, null, text);
								e.dispatchEvent(event);
								return true;
							} catch(e) {
								return false;
							}
						}
					}
					return false;
				};
				
				var getStartAndEnd = function() {
					e.focus();
					var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
					
					if(typeof e.selectionStart === "number" && typeof e.selectionEnd === "number") {
						start = e.selectionStart;
						end = e.selectionEnd;
					} else {
						range = $window.document.selection.createRange();
						if(range && range.parentElement() === e) {
							len = e.value.length;
							normalizedValue = e.value.replace(/\r\n/g, "\n");
							
							// Create a working TextRange that lives only in the input
							textInputRange = e.createTextRange();
							textInputRange.moveToBookmark(range.getBookmark());
							
							// Check if the start and end of the selection are at the very end of the input,
							// since moveStart/moveEnd doesn't return what we want in those cases
							endRange = e.createTextRange();
							endRange.collapse(false);
							
							if(textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
								start = end = len;
							} else {
								start = -textInputRange.moveStart("character", -len);
								start += normalizedValue.slice(0, start).split("\n").length - 1;
								
								if(textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
									end = len;
								} else {
									end = -textInputRange.moveEnd("character", -len);
									end += normalizedValue.slice(0, end).split("\n").length - 1;
								}
							}
						}
					}
					
					if(start > end) {
						var temp = start;
						start = end;
						end = temp;
					}
					
					return {start: start, end: end};
				};
				
				var setSelection = function(start, end) {
					if(typeof(end) === 'undefined') {
						end = start;
					}
					
					if(e.setSelectionRange) {
						e.focus();
						e.setSelectionRange(start, end);
					} else if (e.createTextRange) {
						var range = e.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', start);
						range.select();
					}
				};
				
				var isTrimmableCharacter = function(c) {
					if(typeof(c) === 'undefined') {
						return false;
					}
					return (c === ' ' || c === '\t' || c === '\r' || c === '\n');
				};
				
				var getNewlineCharacter = function() {
					// '\r\n' on opera/ie8? test this, although \n should insert the same, the selection may be off by 1
					return '\n';
				};
				
				var getNewlineCount = function() {
					// '\r\n' on opera/ie8? test this, although \n should insert the same, the selection may be off by 1
					return 1;
				};
				
				// trim, but return numbers instead
				var getCorrectedStartAndEnd = function() {
					var sne = getStartAndEnd();
					var start = sne.start;
					var end = sne.end;
					var original = e.value;
					if(typeof(original) === 'undefined') {
						original = '';
					}
					var text = original.substring(start, end);
					var i;
					for(i = 0; i < text.length; i++) {
						if(isTrimmableCharacter(text[i])) {
							start = start + 1;
						} else {
							break;
						}
					}
					if(start < end) {
						text = text.substring(start, text.length);
						var j;
						for(i = 0; i < text.length; i++) {
							j = text.length - 1 - i;
							if(isTrimmableCharacter(text[j])) {
								end = end - 1;
							} else {
								break;
							}
						}
					}
					return {start: start, end: end};
				};
				
				var insert = function(start, end, strStart, strEnd, newLines, count) {
					if(typeof(start) === 'undefined') {
						start = 0;
					}
					if(typeof(end) === 'undefined') {
						end = 0;
					}
					var first, last;
					if(typeof(newLines) === 'undefined') {
						newLines = 0;
					}
					var original = e.value;
					if(typeof(original) === 'undefined') {
						original = '';
					}
					
					var beforeText = original.substring(0, start);
					var afterText = original.substring(end, original.length);
					if(typeof(strEnd) === 'undefined') {
						strEnd = '';
					}
					if(typeof(strStart) === 'undefined') {
						strStart = '';
					}
					
					var selectedText = '';
					var resultText = '';
					var select = false;
					if(start !== end) {
						select = true;
						selectedText = original.substring(start, end);
						// if we are gonna allow toggling off, check it here, but it's a crap feature
					}
					// split on newlines
					var selected = selectedText.split(/\r\n|\r|\n/g);
					var len = minRepeat;
					var hasCount = false;
					if(typeof(count) !== 'undefined') {
						hasCount = true;
					}
					var countPrefix = '';
					var nl = '';
					var i, iCount;
					for(i = 0; i < newLines; i++) {
						nl = nl + getNewlineCharacter();
					}
					var trimmed = '';
					if(selected.length === 1) {
						if(hasCount) {
							// use this instead of tostring for performance in FF and chrome, is this fully cross browser
							countPrefix = '' + count;
						}
						resultText = resultText + countPrefix + strStart;
						first = beforeText.length + resultText.length;
						resultText = resultText + selected[0];
						last = beforeText.length + resultText.length;
						resultText = resultText + strEnd;
					}	else if(selected.length > 1) {
						iCount = 0;
						for(i = 0; i < selected.length; i++) {
							trimmed = $.trim(selected[i]);
							if(typeof(trimmed) !== 'undefined' && trimmed.length !== 0) {
								if(hasCount) {
									// use this instead of tostring for performance in FF and chrome, is this fully cross browser
									countPrefix = '' + (iCount + count);
									iCount++;
								}
								resultText = resultText + countPrefix + strStart;
								if(typeof(first) === 'undefined') {
									first = beforeText.length + resultText.length;
								}
							}
							resultText = resultText + selected[i];
							if(typeof(trimmed) !== 'undefined' && trimmed.length !== 0) {
								if(typeof(last) === undefined) {
									last = beforeText.length + resultText.length;
								}
								resultText = resultText + strEnd;
							}
							if(i < (selected.length - 1)) {
								resultText = resultText + nl;
							}
						}
					}
					if(typeof(first) === 'undefined') {
						first = start;
					}
					if(typeof(last) === 'undefined') {
						last = end;
					}
					
					var text = beforeText;
					start = text.length;
					text = text + resultText;
					end = text.length;
					text = text + afterText;
					
					return {start: start, first: first, end: end, last: last, select: select, text: text, resultText: resultText};
				};
				
				var insertAround = function(strStart, strEnd, newLines, count) {
					var sne = getStartAndEnd();
					var start = sne.start;
					var end = sne.end;
					return insert(start, end, strStart, strEnd, newLines, count);
				};
				
				var handleResult = function(result) {
					$timeout(function() {
						if(!eventText(result.resultText)) {
							// handle last case, messes up undo/redo but what else can we do?
							updateText(result.text);
						}
						
						if(result.select) {
							setSelection(result.end);
						} else {
							setSelection(result.first);
						}
					});
				};
				
				var ensureNewlines = function(result, pre, post) {
					var start = result.start;
					var end = result.end;
					
					if(typeof(pre) === 'undefined') {
						pre = 0;
					}
					if(typeof(post) === 'undefined') {
						post = 0;
					}
					
					var beforeText = result.text.substring(0, start);
					var afterText = result.text.substring(end, result.text.length);
					var i, j, pad;
					var needsPre = pre;
					// find out the number of newlines it needs beforehand
					if(pre > 0) {
						pad = 0;
						for(i = 0; i < beforeText.length; i++) {
							j = beforeText.length - 1 - i;
							if(isTrimmableCharacter(beforeText[j])) {
								pad++;
								if(beforeText[j] === '\n') {
									needsPre--;
								}
								if(needsPre <= 0) {
									break;
								}
							} else {
								break;
							}
						}
					}
					var needsPost = post;
					if(post > 0) {
						pad = 0;
						for(i = 0; i < afterText.length; i++) {
							if(isTrimmableCharacter(afterText[i])) {
								pad++;
								if(afterText[i] === '\n') {
									needsPost--;
								}
								if(needsPost <= 0) {
									break;
								}
							} else {
								break;
							}
						}
					}
					if(needsPre < 0) {
						needsPre = 0;
					}
					if(needsPost < 0) {
						needsPost = 0;
					}
					if(needsPre > 0 || needsPost > 0) {
						var beforeNewlines = '';
						for(i = 0; i < needsPre; i++) {
							beforeNewlines = beforeNewlines + getNewlineCharacter();
						}
						var afterNewlines = '';
						for(i = 0; i < needsPost; i++) {
							afterNewlines = afterNewlines + getNewlineCharacter();
						}
						
						result.start = beforeText.length;
						result.end = beforeText.length + result.resultText.length + ((needsPre + needsPost) * getNewlineCount());
						result.first = result.first + (needsPre * getNewlineCount());
						result.last = result.last + (needsPre * getNewlineCount());
						result.resultText = beforeNewlines + result.resultText + afterNewlines;
						result.text = beforeText + result.resultText + afterText;
					}
					
					return result;
				};

				var selectionBookmark;
				var setBookmark = function() {
					if(scope.showAdvanced) {
						selectionBookmark = composer.selection.getBookmark();
					}
				};
				
				var nullExec = function() {};
				
				var advancedExec = function(event, command, data, bookmark) {
					if(bookmark && selectionBookmark) {
						$timeout(function() {
							composer.selection.setBookmark(selectionBookmark);
							try {
								composer.commands.exec(command, data);
								editor.focus();
							} catch(e) {
								// do nothing!
							}
						}, 0);
					} else {
						try {
							composer.commands.exec(command, data);
							editor.focus();
						} catch(e) {
							// do nothing!
						}
					}
				};
				
				var normalExec = function(around, start, end, strStart, strEnd, newLines, pre, post, rFunc, count) {
					var result;
					if(around) {
						result = insertAround(strStart, strEnd, newLines, count);
					} else {
						result = insert(start, end, strStart, strEnd, newLines, count);
					}
					if(typeof(pre) !== 'undefined' && typeof(post) !== 'undefined') {
						result = ensureNewlines(result, pre, post);
					}
					if(rFunc) {
						rFunc(result);
					} else {
						handleResult(result);
					}
				};
				
				var exec = nullExec;
				var markdownExec = normalExec;
				var updateText = updateTextMarkdown;
				var setText = updateTextMarkdown;
				var savedRefreshText;
				var bodyBindText = 'keypress keyup keydown paste change focus blur';
				if(scope.showAdvanced) {
					exec = advancedExec;
					markdownExec = nullExec;
					updateText = updateTextAdvanced;
					setText = function(text) {
						if(!advancedLoaded) {
							savedRefreshText = text;
							return;
						}
						if(typeof(text) === 'undefined' || text === '') {
							// with 1 space; otherwise the editor sets it as "<br>" for some odd reason...
							text = ' ';
						}
						try {
							editor.setValue(text, false);
						} catch(e) {
							//continue
						}
						modelParsed.assign(scope, text);
						scope.textData = text;
					};

					editor.on('load', function() {
						advancedLoaded = true;
						if(typeof(refreshText) !== 'undefined') {
							refreshText();
						}
					});
					
					editor.on('change', function() {
						updateText();
						scope.modelChangeDirtyForm();
						updateStates();
					});
					//editor.on('interaction', function() {
					//	updateStates();
					//});
					editor.on('focus', function() {
						updateText();
						scope.clearDropdowns();
					});
					editor.on('blur', function() {
						updateText();
						updateStates();
					});
					editor.on('tableselect', function() {
						scope.showTable = true;
					});
					editor.on('tableunselect', function() {
						scope.showTable = false;
					});
					
					scope.$on(events.SET_EDITOR, function(event, text) {
						if(!event.defaultPrevented) {
							if(!ng.isDefined(text)) {
								text = '';
							}
							event.preventDefault();
							setText(text);
						}
					});
					
					try {
						$(jqEleToolbar).find('.editor-button').mousedown(function(event) {
							var b = composer.selection.getBookmark();
							event.preventDefault();
							$timeout(function() {
								composer.selection.setBookmark(b);
							}, 0);
							try {
								editor.focus();
							} catch(e) {
								//continue
							}
						});
						$(jqEleToolbar).find('.editor-dropdown-button').click(function(event) {
							event.preventDefault();
							event.stopPropagation();
						});
						$(jqEleToolbar).find('.editor-list-button').mousedown(function(event) {
							event.preventDefault();
							event.stopPropagation();
						});
					} catch(e) {
						// do nothing, these are non essential
					}
					
				} else {
					jqEleMarkdown.on('blur', function() {
						updateText(scope.textareaData);
					});
				}
				var refreshText = function() {
					$timeout(function() {
						var text = modelParsed(scope);
						if(typeof(savedRefreshText) !== 'undefined') {
							text = savedRefreshText;
						}
						if(typeof(setText) !== 'undefined') {
							setText(text);
						}
					}, 0);
				};
				
				$rootScope.$on(events.UNSAVED_CHANGES_COMPLETE, function(event) {
					refreshText();
				});
				refreshText();
				
				scope.$watch('$parent.' + scope.$parent[scopeVars.SINGLE] + '.' + chainedKeys.DATA + '.' + chainedKeys.SINGLE, function(newValue, oldValue) {
					if(newValue !== oldValue) {
						refreshText();
					}
				});
				
				scope.cancelInsert = function(event) {
					clearToolbar();
				};
				
				scope.saveUser = function(event) {
					var p = {};
					p[pathVariables.USER] = scope.userName;
					exec(event, 'insertHTML', templates.user(scope.userName, $state.href(states.USERS_ID, p, {absolute: true})), true);
					markdownExec(true, undefined, undefined, '@[' + scope.userName, ']', 1);
					clearToolbar();
				};
				
				scope.saveTag = function(event) {
					var p = {};
					p[pathVariables.TAG] = scope.tagName;
					exec(event, 'insertHTML', templates.tag(scope.tagName, $state.href(states.TAGS_ID, p, {absolute: true})), true);
					markdownExec(true, undefined, undefined, '#[' + scope.tagName, ']', 1);
					clearToolbar();
				};
				
				scope.saveLink = function(event) {
					exec(event, 'createLink', {href: scope.linkHref}, true);
					if(!scope.showAdvanced) {
						var url = scope.linkHref;
						var sne = getStartAndEnd();
						var result = insert(sne.start, sne.end, '[', ']', 1);
						
						if(typeof(url) !== 'undefined') {
							if(url.lastIndexOf('http://', 0) !== 0 && url.lastIndexOf('https://', 0) !== 0) {
								url = 'http://' + url;
							}
						}
						
						var addedText = '(' + url + ')';
						var before = result.text.substring(0, result.end);
						var after = result.text.substring(result.end, result.text.length);
						result.resultText = result.resultText + addedText;
						result.end = result.end + addedText.length;
						result.text = before + addedText + after;
						
						result = ensureNewlines(result, 1, 1);
						handleResult(result);
					}
					clearToolbar();
				};
				
				scope.saveImage = function(event) {
					exec(event, 'insertImage', {src: scope.imageHref, width: scope.imageWidth, height: scope.imageHeight}, true);
					if(!scope.showAdvanced) {
						var height = '*';
						var width = '*';
						var hw = '';
						var url = scope.imageHref;

						if((typeof(scope.imageWidth) !== 'undefined' && scope.imageWidth.length > 0) || (typeof(scope.imageHeight) !== 'undefined' && scope.imageHeight.length > 0)) {
							if(typeof(scope.imageWidth) !== 'undefined' && scope.imageWidth.length > 0) {
								width = scope.imageWidth;
							}
							if(typeof(scope.imageHeight) !== 'undefined' && scope.imageHeight.length > 0) {
								height = scope.imageHeight;
							}
							hw = ' =' + width + 'x' + height;
						}
						if(typeof(scope.imageHref) === 'undefined') {
							return;
						}
						
						if(typeof(url) !== 'undefined') {
							if(url.lastIndexOf('http://', 0) !== 0 && url.lastIndexOf('https://', 0) !== 0) {
								url = 'https://' + url;
							}
						}
						
						/*
						var post = '<img itemprop="image" src="' + url + '"' + width + height + '>';
						var sne = getStartAndEnd();
						var result = insert(sne.start, sne.end, '', post, 1);
						result = ensureNewlines(result, 1, 1);
						result.first = result.end;
						result.last = result.end;
						handleResult(result);
						*/


						var sne = getStartAndEnd();
						var result = insert(sne.start, sne.end, '![', ']', 1);
						var addedText = '(' + url + hw + ')';
						var before = result.text.substring(0, result.end);
						var after = result.text.substring(result.end, result.text.length);
						result.resultText = result.resultText + addedText;
						result.end = result.end + addedText.length;
						result.text = before + addedText + after;
						
						result = ensureNewlines(result, 1, 1);
						handleResult(result);
					}
					clearToolbar();
				};
				
				scope.saveAttribution = function(event) {
					var title = scope.attributionTitle;
					if(title === '') {
						title = undefined;
					}
					var titleLink = scope.attributionTitleLink;
					if(titleLink === '') {
						titleLink = undefined;
					}
					var author = scope.attributionAuthor;
					if(author === '') {
						author = undefined;
					}
					var authorLink = scope.attributionAuthorLink;
					if(authorLink === '') {
						authorLink = undefined;
					}
					var license = scope.attributionLicense;
					if(license === '') {
						license = undefined;
					}
					var licenseLink = scope.attributionLicenseLink;
					if(licenseLink === '') {
						licenseLink = undefined;
					}
					
					var t = templates.attribution(title, titleLink,
							author, authorLink,
							license, licenseLink);
					exec(event, 'insertHtml', t, true);
					markdownExec(true, undefined, undefined, t, '', 1);
					clearToolbar();
				};
				
				var bindPress = function(c, save, cancel) {
					$(newElement).find(c).bind('keyup', function(e) {
						if(e.keyCode === 13) {
							save();
						} else if(e.keyCode === 27) {
							cancel();
						}
					});
				};
				
				try {
					bindPress('.pyEditorShowUser input', scope.saveUser, scope.cancelInsert);
					bindPress('.pyEditorShowTag input', scope.saveTag, scope.cancelInsert);
					bindPress('.pyEditorShowLink input', scope.saveLink, scope.cancelInsert);
					bindPress('.pyEditorShowImage input', scope.saveImage, scope.cancelInsert);
					bindPress('.pyEditorShowAttribution input', scope.saveAttribution, scope.cancelInsert);
				} catch(e) {
					// do nothing, these are non-essential
				}
				
				// text
				scope.bold = function(event) {
					exec(event, 'bold');
					markdownExec(true, undefined, undefined, '<strong>', '</strong>', 1);
				};
				
				scope.italic = function(event) {
					exec(event, 'italic');
					markdownExec(true, undefined, undefined, '<em>', '</em>', 1);
				};
				
				scope.underline = function(event) {
					exec(event, 'underline');
					markdownExec(true, undefined, undefined, '<u>', '</u>', 1);
				};
				
				scope.superscript = function(event) {
					exec(event, 'superscript');
					markdownExec(true, undefined, undefined, '<sup>', '</sup>', 1);
				};
				
				scope.subscript = function(event) {
					exec(event, 'subscript');
					markdownExec(true, undefined, undefined, '<sub>', '</sub>', 1);
				};
				
				// align
				scope.alignLeft = function(event) {
					exec(event, 'justifyLeft');
					markdownExec(true, undefined, undefined, '%[' + regexes.ALIGN_LEFT_START_STRING + ']', '%[' + regexes.ALIGN_END_STRING + ']', 1);
				};
				scope.alignRight = function(event) {
					exec(event, 'justifyRight');
					markdownExec(true, undefined, undefined, '%[' + regexes.ALIGN_RIGHT_START_STRING + ']', '%[' + regexes.ALIGN_END_STRING + ']', 1);
				};
				scope.alignCenter = function(event) {
					exec(event, 'justifyCenter');
					markdownExec(true, undefined, undefined, '%[' + regexes.ALIGN_CENTER_START_STRING + ']', '%[' + regexes.ALIGN_END_STRING + ']', 1);
				};
				scope.alignJustify = function(event) {
					exec(event, 'justifyFull');
					markdownExec(true, undefined, undefined, '%[' + regexes.ALIGN_JUSTIFY_START_STRING + ']', '%[' + regexes.ALIGN_END_STRING + ']', 1);
				};
				
				// header
				scope.header1 = function(event) {
					exec(event, 'formatBlock', 'h1');
					markdownExec(true, undefined, undefined, '## ', ' ##', 1, 1, 1);
				};
				
				scope.header2 = function(event) {
					exec(event, 'formatBlock', 'h2');
					markdownExec(true, undefined, undefined, '', '\n=====', 2, 1, 1);
				};
				
				scope.normal = function(event) {
					exec(event, 'formatBlock', '');
					// not shown in markdown
				};
				
				scope.blockquote = function(event) {
					exec(event, 'formatBlock', 'blockquote');
					markdownExec(true, undefined, undefined, '> ', '', 1, 1, 1);
				};
				
				scope.code = function(event) {
					exec(event, 'formatBlock', 'code');
					markdownExec(true, undefined, undefined, '`', '`', 1);
				};
				
				scope.pre = function(event) {
					exec(event, 'formatBlock', 'pre');
					markdownExec(true, undefined, undefined, '<pre>', '</pre>', 1);
				};
				
				// font size
				scope.fontXSmall = function(event) {
					exec(event, 'fontSize', 'x-small');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_SIZE_XSMALL_START_STRING + ']', '%[' + regexes.FONT_SIZE_END_STRING + ']', 1);
				};
				
				scope.fontSmall = function(event) {
					exec(event, 'fontSize', 'small');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_SIZE_SMALL_START_STRING + ']', '%[' + regexes.FONT_SIZE_END_STRING + ']', 1);
				};
				
				scope.fontMedium = function(event) {
					exec(event, 'fontSize', 'medium');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_SIZE_MEDIUM_START_STRING + ']', '%[' + regexes.FONT_SIZE_END_STRING + ']', 1);
				};
				
				scope.fontLarge = function(event) {
					exec(event, 'fontSize', 'large');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_SIZE_LARGE_START_STRING + ']', '%[' + regexes.FONT_SIZE_END_STRING + ']', 1);
				};
				
				scope.fontXLarge = function(event) {
					exec(event, 'fontSize', 'x-large');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_SIZE_XLARGE_START_STRING + ']', '%[' + regexes.FONT_SIZE_END_STRING + ']', 1);
				};
				
				// format
				scope.unorderedList = function(event) {
					exec(event, 'insertUnorderedList');
					markdownExec(true, undefined, undefined, '- ', '', 1, 2, 1);
				};
				
				scope.orderedList = function(event) {
					exec(event, 'insertOrderedList');
					markdownExec(true, undefined, undefined, '. ', '', 1, 2, 1, undefined, 1);
				};
				
				scope.indent = function(event) {
					exec(event, 'insertHtml', '&ensp;&ensp;');
					markdownExec(true, undefined, undefined, '&ensp;&ensp;', '', 1, undefined, undefined, function(result) {
						result.first = result.end;
						result.last = result.end;
						handleResult(result);
					});
				};
				
				scope.lineBreak = function(event) {
					exec(event, 'insertLineBreak');
					markdownExec(true, undefined, undefined, '<br>', '', 1, undefined, undefined, function(result) {
						result.first = result.end;
						result.last = result.end;
						handleResult(result);
					});
				};
				
				scope.pageBreak = function(event) {
					exec(event, 'insertHtml', '<hr>');
					markdownExec(true, undefined, undefined, '<hr>', '', 1, 2, 1, function(result) {
						result.first = result.end;
						result.last = result.end;
						handleResult(result);
					});
				};
				
				// color
				scope.colorRed = function(event) {
					exec(event, 'foreColor', 'red');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_RED_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				scope.colorGreen = function(event) {
					exec(event, 'foreColor', 'green');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_GREEN_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				scope.colorBlue = function(event) {
					exec(event, 'foreColor', 'blue');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_BLUE_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				scope.colorCyan = function(event) {
					exec(event, 'foreColor', 'cyan');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_CYAN_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				scope.colorMagenta = function(event) {
					exec(event, 'foreColor', 'magenta');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_MAGENTA_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				scope.colorYellow = function(event) {
					exec(event, 'foreColor', 'yellow');
					markdownExec(true, undefined, undefined, '%[' + regexes.FONT_COLOR_YELLOW_START_STRING + ']', '%[' + regexes.FONT_COLOR_END_STRING + ']', 1);
				};
				
				// links
				var inputUserName = $(newElement).find('input.pyEditorUserName');
				var inputTagName = $(newElement).find('input.pyEditorTagName');
				var inputLinkHref = $(newElement).find('input.pyEditorLinkHref');
				var inputImageHref = $(newElement).find('input.pyEditorImageHref');
				var inputAttributionAuthor = $(newElement).find('input.pyEditorAttributionAuthor');
				
				scope.addUser = function(event) {
					clearToolbar();
					setBookmark();
					scope.userName = '';
					scope.showUser = true;
					$timeout(function() {
						if(typeof(inputUserName) !== 'undefined') {
							inputUserName.focus();
						}
					}, 0);
				};
				
				scope.addTag = function(event) {
					clearToolbar();
					setBookmark();
					scope.tagName = '';
					scope.showTag = true;
					$timeout(function() {
						if(typeof(inputTagName) !== 'undefined') {
							inputTagName.focus();
						}
					}, 0);
				};
				
				scope.link = function(event) {
					clearToolbar();
					setBookmark();
					scope.linkHref = '';
					scope.showLink = true;
					$timeout(function() {
						if(typeof(inputLinkHref) !== 'undefined') {
							inputLinkHref.focus();
						}
					}, 0);
				};
				
				scope.removeLink = function(event) {
					exec(event, 'removeLink');
					// not shown in markdown
				};
				
				scope.image = function(event) {
					clearToolbar();
					setBookmark();
					scope.imageHref = '';
					scope.imageWidth = '';
					scope.imageHeight = '';
					scope.showImage = true;
					$timeout(function() {
						if(typeof(inputImageHref) !== 'undefined') {
							inputImageHref.focus();
						}
					}, 0);
				};
				
				scope.attribution = function(event) {
					clearToolbar();
					setBookmark();
					scope.attributionAuthor = '';
					scope.attributionAuthorLink = '';
					scope.attributionTitle = '';
					scope.attributionTitleLink = '';
					scope.attributionLicense = '';
					scope.attributionLicenseLink = '';
					scope.showAttribution = true;
					$timeout(function() {
						if(typeof(inputAttributionAuthor) !== 'undefined') {
							inputAttributionAuthor.focus();
						}
					}, 0);
				};
				
				// settings
				scope.undo = function(event) {
					exec(event, 'undo');
				};

				scope.redo = function(event) {
					exec(event, 'redo');
				};

				scope.toggleView = function(event) {
					try {
						if(editor.currentView === editor.textarea || editor.currentView === 'source') {
							editor.fire('change_view', 'composer');
							scope.htmlMode = false;
						} else {
							editor.fire('change_view', 'textarea');
							scope.htmlMode = true;
						}
					} catch(e) {
						//continue
					}
				};
				
				Converter.managePreEvent(scope, function() {
					if(scope.showAdvanced) {
						try {
							if(editor.currentView === editor.textarea || editor.currentView === 'source') {
								editor.fire('change_view', 'composer');
								scope.htmlMode = false;
								updateText();
							}
						} catch(e) {
							//continue
						}
					}
				});
			}
		};
	}]);
	
});