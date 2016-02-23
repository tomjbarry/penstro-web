define(['js/util/utils', 'js/constants/view-urls', 'js/constants/path-variables'], function(utils, viewUrls, pathVars) {
	
	return {
		user: function(user, userLink) {
			var args = {};
			args[pathVars.USER] = user;
			var link = utils.format(viewUrls.USERS_ID, args);
			if(typeof(userLink) !== 'undefined') {
				link = userLink;
			}
			return	"<a href='" + link + "' class='pyUsernameReference'>" +
								"<i class='fa fa-user'></i>" +
								"<span class='username'>" + user + "</span>" +
							"</a>";
		},
		tag: function(tag, tagLink) {
			var args = {};
			args[pathVars.TAG] = tag;
			var link = utils.format(viewUrls.TAGS_ID, args);
			if(typeof(tagLink) !== 'undefined') {
				link = tagLink;
			}
			return	"<a href='" + link + "' class='pyTagReference label'>" +
								"<span class='tag'>" + tag + "</span>" +
							"</a>";
		},
		attribution: function(title, titleLink, author, authorLink, license, licenseLink) {
			var t = "";
			if(typeof(title) !== 'undefined' && title !== '') {
				t = '"' + title + '" ';
			}
			if(typeof(titleLink) !== 'undefined' && title !== '') {
				t = "<a href='" + titleLink + "'>";
				if(typeof(title) !== 'undefined' && title !== '') {
					t = t + '"' + title + '"';
				} else {
					t = t + "(" + titleLink + ")";
				}
				t = t + "</a> ";
			}
			
			var a = "";
			if(typeof(author) !== 'undefined' && author !== '') {
				a = "by " + author + "";
			}
			if(typeof(authorLink) !== 'undefined' && authorLink !== '') {
				a = "by <a href='" + authorLink + "'>";
				if(typeof(author) !== 'undefined' && author !== '') {
					a = a + author;
				} else {
					a = a + "[" + authorLink + "]";
				}
				a = a + "</a>";
			}
			
			var l = "";
			if(typeof(license) !== 'undefined' && license !== '') {
				l = ", licensed under " + license;
			}
			if(typeof(licenseLink) !== 'undefined' && licenseLink !== '') {
				l = ", licensed under <a href='" + licenseLink + "'>";
				if(typeof(license) !== 'undefined' && license !== '') {
					l = l + license;
				} else {
					l = "" + licenseLink + "";
				}
				l = l + "</a>";
			}
			return	"<span class='py-content-attribution'>Credit: " + t + a + l + "</span><br><br>";
		},
		editorButton: function(ngClick, icon, bind, active, title, show) {
			var showString = '';
			if(typeof(show) !== 'undefined') {
				showString = " ng-show='" + show + "'";
			}
			var str = "<a tabindex='-1' ng-click='" + ngClick + "' type='button' class='pyDropdownButtonInner editor-list-button btn btn-xs' role='button' aria-label='{{" + bind + "}}'";
			/*
			if(typeof(command) !== 'undefined') {
				str = str + " data-wysihtml5-command='" + command + "'";
			}*/
			if(typeof(title) !== 'undefined') {
				str = str + " title='" + title + "'";
			}
			if(typeof(active) !== 'undefined') {
				str = str + " ng-class='{active: " + active + " }'";
			}
			/*
			if(typeof(value) !== 'undefined') {
				str = str + " data-wysihtml5-command-value='" + value + "'";
			}
			if(typeof(blankValue) !== 'undefined') {
				str = str + " data-wysihtml5-blank-value='" + blankValue + "'";
			}
			if(typeof(action) !== 'undefined') {
				str = str + " data-wysihtml5-action='" + action + "'";
			}*/
			if(typeof(show) !== 'undefined') {
				str = str + " ng-show='" + show + "'";
			}
			str = str + ">";
			if(typeof(icon) !== 'undefined') {
				str = str + "<i class='fa fa-fw " + icon + "' aria-hidden='true'></i>";
			}
			str = str + "<span ng-bind='" + bind + "' class='menu-space'></span>" + "</a>";
			return str;
			/*
			return	"<button type='button' ng-click='" + ngClick + "' class='editor-button btn'" + showString + ">" +
								"<i class='fa fa-fw fa-2x " + icon + "' aria-hidden='true'></i>" +
							"</button>";
			*/
		},
		editorButtonDropdownOuter: function(isOpen, icon, tooltipBind, show, inner) {
			//return "<div dropdown is-open='" + isOpen + "' class='btn-group pyDropdownButton' tooltip-placement='bottom' tooltip='{{" + tooltipBind + "}}'>" +
			var showString = '';
			if(typeof(show) !== 'undefined') {
				showString = " ng-show='" + show + "'";
			}
			return "<div dropdown is-open='" + isOpen + "' class='btn-group pyDropdownButton editor-dropdown-button' " + showString + ">" +
								"<button tabindex='-1' type='button' class='btn btn-xs dropdown-toggle' dropdown-toggle>" +
									"<i class='fa fa-fw fa-2x " + icon + "'></i>" +
									"<span class='menu-space'></span>" +
									"<span><i class='caret'></i></span>" +
								"</button>" +
								"<ul class='dropdown-menu' role='menu'>" +
									inner +
								"</ul>" +
						"</div>";
		},
		editorButtonDropdownInner: function(ngClick, icon, bind, active, title, show) {
			/*return "<li>" +
							"<a href='" + utils.getAnchorHref() + "' ng-click='" + ngClick + "' type='button' class='pyDropdownButtonInner' role='button' onclick='return false' aria-label='{{" + bind + "}}'>" +
								"<div class='pyButtonInner'>" +
									"<i class='fa fa-fw " + icon + "' aria-hidden='true'></i>" +
									"<span ng-bind='" + bind + "' class='menu-space'></span>" +
								"</div>" +
							"</a>" +
						"</li>";*/
			var str = "<li>" + "<a tabindex='-1' ng-click='" + ngClick + "' type='button' class='pyDropdownButtonInner editor-list-button' role='button' onclick='return false' aria-label='{{" + bind + "}}'";
			/*
			if(typeof(command) !== 'undefined') {
				str = str + " data-wysihtml5-command='" + command + "'";
			}*/
			if(typeof(title) !== 'undefined') {
				str = str + " title='" + title + "'";
			}
			if(typeof(active) !== 'undefined') {
				str = str + " ng-class='{active: " + active + " }'";
			}
			/*
			if(typeof(value) !== 'undefined') {
				str = str + " data-wysihtml5-command-value='" + value + "'";
			}
			if(typeof(blankValue) !== 'undefined') {
				str = str + " data-wysihtml5-blank-value='" + blankValue + "'";
			}
			if(typeof(action) !== 'undefined') {
				str = str + " data-wysihtml5-action='" + action + "'";
			}*/
			if(typeof(show) !== 'undefined') {
				str = str + " ng-show='" + show + "'";
			}
			str = str + ">" +
											"<div class='pyButtonInner'>";
			if(typeof(icon) !== 'undefined') {
				str = str + "<i class='fa fa-fw " + icon + "' aria-hidden='true'></i>";
			}
			str = str + "<span ng-bind='" + bind + "' class='menu-space'></span>" + "</div>" + "</a>" + "</li>";
			return str;
		},
		fixed: {
			ALIGN_CENTER_START: "<p class='wysiwyg-text-align-center'>",
			ALIGN_LEFT_START: "<p class='wysiwyg-text-align-left'>",
			ALIGN_RIGHT_START: "<p class='wysiwyg-text-align-right'>",
			ALIGN_JUSTIFY_START: "<p class='wysiwyg-text-align-full'>",
			ALIGN_END: "</p>",
			
			FONT_SIZE_XSMALL_START: "<p class='wysiwyg-font-size-x-small'>",
			FONT_SIZE_SMALL_START: "<p class='wysiwyg-font-size-small'>",
			FONT_SIZE_MEDIUM_START: "<p class='wysiwyg-font-size-medium'>",
			FONT_SIZE_LARGE_START: "<p class='wysiwyg-font-size-large'>",
			FONT_SIZE_XLARGE_START: "<p class='wysiwyg-font-size-x-large'>",
			FONT_SIZE_END: "</p>",
			
			FONT_COLOR_RED_START: "<p class='wysiwyg-color-red'>",
			FONT_COLOR_GREEN_START: "<p class='wysiwyg-color-green'>",
			FONT_COLOR_BLUE_START: "<p class='wysiwyg-color-blue'>",
			FONT_COLOR_CYAN_START: "<p class='wysiwyg-color-cyan'>",
			FONT_COLOR_MAGENTA_START: "<p class='wysiwyg-color-magenta'>",
			FONT_COLOR_YELLOW_START: "<p class='wysiwyg-color-yellow'>",
			FONT_COLOR_END: "</p>",
		}
	};
});