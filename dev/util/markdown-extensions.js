define(['showdown', 'js/util/extra-templates', 'js/constants/regexes'], function(showdown, templates, regexes) {
	
	// This is prone to breakage if the showdown version is changed. This is based on an internal showdown function
	var escapeCharacters_callback = function(m) {
		var charCodeToEscape = m.charCodeAt(0);
		return "~E"+charCodeToEscape+"E";
	};
	
	var getList = function() {
		return [
      // Youtube embedding extension. is it worth it? probably not, as it needs to be explicity bypassed on the sanitization, then rerendered
      /*{
				type: 'lang',
				regex: '@yt\\[(.*?)\\]',
				replace: function(match, link) {
					return "<iframe src='//www.youtube.com/embed/" + link + "' frameborder='0' allowFullScreen></iframe>";
				}
			},*/
			{
				type: 'lang',
				regex: '(\\\\)?@\\[(' + regexes.USERNAME_STRING + '?)\\]',
				replace: function(match, leadingSlash, user) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						var username = user.replace(/_/g,escapeCharacters_callback);
						return templates.user(username);
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?#\\[(' + regexes.TAG_STRING + '?)\\]',
				replace: function(match, leadingSlash, tag) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						var tagname = tag.replace(/_/g,escapeCharacters_callback);
						return templates.tag(tagname);
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.ALIGN_CENTER_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.ALIGN_CENTER_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.ALIGN_LEFT_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.ALIGN_LEFT_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.ALIGN_RIGHT_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.ALIGN_RIGHT_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.ALIGN_JUSTIFY_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.ALIGN_JUSTIFY_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.ALIGN_END_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.ALIGN_END;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_XSMALL_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_XSMALL_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_SMALL_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_SMALL_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_MEDIUM_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_MEDIUM_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_LARGE_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_LARGE_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_XLARGE_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_XLARGE_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_SIZE_END_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_SIZE_END;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_RED_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_RED_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_GREEN_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_GREEN_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_BLUE_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_BLUE_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_CYAN_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_CYAN_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_MAGENTA_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_MAGENTA_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_YELLOW_START_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_YELLOW_START;
					}
				}
			},
			{
				type: 'lang',
				regex: '(\\\\)?%\\[(' + regexes.FONT_COLOR_END_STRING + ')\\]',
				replace: function(match, leadingSlash, align) {
					if(leadingSlash === '\\') {
						return match;
					} else {
						return templates.fixed.FONT_COLOR_END;
					}
				}
			},
			{type: 'lang', regex: '\\\\@', replace: '@'},
			{type: 'lang', regex: '\\\\#', replace: '#'},
			{type: 'lang', regex: '\\\\%', replace: '%'}
		];
	};
	
	var ext = function(converter) {
		return getList();
	};
	
	if(typeof window !== 'undefined' && window.showdown && window.showdown.extensions) {
		window.showdown.extensions.ext = ext;
	}
	if(typeof module !== 'undefined') {
		module.exports = ext;
	}
	return ext;
});