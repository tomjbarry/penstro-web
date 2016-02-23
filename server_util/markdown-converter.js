define(['sanitize-html', 'url', 'js/util/markdown-extensions', 'js/util/utils', 'js/constants/webapp', 'js/constants/view-urls', 'js/constants/params'],
function(sanitizeHtml, Url, ext, utils, webapp, viewUrls, params) {
	var voidElements = ["area","br","col","hr","img","wbr"];

	// Elements that you can"," intentionally"," leave open (and which close themselves)
	// http://dev.w3.org/html5/spec/Overview.html#optional-tags
	var optionalEndTagBlockElements = ["colgroup","dd","dt","li","p","tbody","td","tfoot","th","thead","tr"];
	var optionalEndTagInlineElements = ["rp","rt"];

	// Safe Block Elements - HTML5
	var blockElements = ["address","article","aside","blockquote","caption","center","del","dir","div","dl","figure","figcaption","footer",
						"h1","h2","h3","h4","h5","h6","header","hgroup","hr","ins","map","menu","nav","ol","pre","section","table","ul"];

	// Inline Elements - HTML5
	var inlineElements = ["a","abbr","acronym","b","bdi","bdo","big","br","cite","code","del","dfn","em","font","i","img","ins","kbd",
						"label","map","mark","q","ruby","rp","rt","s","samp","small","span","strike","strong","sub","sup","time","tt","u","var"];

	// SVG Elements
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
	// Note: the elements animate","animateColor","animateMotion","animateTransform","set are intentionally omitted.
	// They can potentially allow for arbitrary javascript to be executed. See #11290
	var svgElements = ["circle","defs","desc","ellipse","font-face","font-face-name","font-face-src","g","glyph","hkern","image",
					"linearGradient","line","marker","metadata","missing-glyph","mpath","path","polygon","polyline","radialGradient",
					"rect","stop","svg","switch","text","title","tspan","use"];
	
	var allowedTags = [];
	allowedTags = allowedTags.concat(
			voidElements,
			optionalEndTagBlockElements,
			optionalEndTagInlineElements,
			blockElements,
			inlineElements,
			svgElements
		);
	
	var uriAttrs = ["background","cite","href","longdesc","src","usemap","xlink:href"];

	var htmlAttrs = ["abbr","align","alt","axis","bgcolor","border","cellpadding","cellspacing","class","clear",
	    "color","cols","colspan","compact","coords","dir","face","headers","height","hreflang","hspace",
	    "ismap","lang","language","nohref","nowrap","rel","rev","rows","rowspan","rules",
	    "scope","scrolling","shape","size","span","start","summary","tabindex","target","title","type",
	    "valign","value","vspace","width"];

	// SVG attributes (without "id" and "name" attributes)
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
	var svgAttrs = ["accent-height","accumulate","additive","alphabetic","arabic-form","ascent",
	    "baseProfile","bbox","begin","by","calcMode","cap-height","class","color","color-rendering","content",
	    "cx","cy","d","dx","dy","descent","display","dur","end","fill","fill-rule","font-family","font-size","font-stretch",
	    "font-style","font-variant","font-weight","from","fx","fy","g1","g2","glyph-name","gradientUnits","hanging",
	    "height","horiz-adv-x","horiz-origin-x","ideographic","k","keyPoints","keySplines","keyTimes","lang",
	    "marker-end","marker-mid","marker-start","markerHeight","markerUnits","markerWidth","mathematical",
	    "max","min","offset","opacity","orient","origin","overline-position","overline-thickness","panose-1",
	    "path","pathLength","points","preserveAspectRatio","r","refX","refY","repeatCount","repeatDur",
	    "requiredExtensions","requiredFeatures","restart","rotate","rx","ry","slope","stemh","stemv","stop-color",
	    "stop-opacity","strikethrough-position","strikethrough-thickness","stroke","stroke-dasharray",
	    "stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity",
	    "stroke-width","systemLanguage","target","text-anchor","to","transform","type","u1","u2","underline-position",
	    "underline-thickness","unicode","unicode-range","units-per-em","values","version","viewBox","visibility",
	    "width","widths","x","x-height","x1","x2","xlink:actuate","xlink:arcrole","xlink:role","xlink:show","xlink:title",
	    "xlink:type","xml:base","xml:lang","xml:space","xmlns","xmlns:xlink","y","y1","y2","zoomAndPan"];
	
	var allowedAttributes = [];
	allowedAttributes = allowedAttributes.concat(
			uriAttrs,
			htmlAttrs,
			svgAttrs
		);
	
	return {
		convertAndSanitize: function(str) {
			var sanitizeOptions = {
				allowedTags: allowedTags,
				allowedAttributes: {'*': allowedAttributes},
				transformTags: {
					'*': function(tagName, attribs) {
						if(typeof(attribs) !== 'undefined' && typeof(attribs.href) !== 'undefined') {
							try {
								var targetUrl = Url.parse(attribs.href);
								if(utils.isExternalUrl(webapp.DOMAIN, targetUrl.hostname) || targetUrl.protocol === null || targetUrl.hostname === null ||
										(targetUrl.protocol !== 'https:' && targetUrl.protocol !== 'http:')) {
									var p = {};
									p[params.EXTERNAL_URL] = attribs.href;
									attribs.href = utils.constructPath(viewUrls.EXTERNAL_URL, undefined, p);
								}
							} catch(e) {
								//malformed, what to do here? this isnt any good!
								attribs.href = utils.constructPath(viewUrls.NOT_FOUND);
							}
						}
						
						return {
							tagName: tagName,
							attribs: attribs
						};
					}
				}
			};
			return sanitizeHtml(str, sanitizeOptions);
		}
	};
});
				