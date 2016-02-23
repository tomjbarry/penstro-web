define(['js/constants/view-urls', 'js/constants/help-topics', 'js/constants/terms-sections', 'js/constants/params'],
function(viewUrls, helpTopics, termsSections, params) {
	// these links are intended to be premade to be inserted into i18ned text
	// obviously since this is premade, urls with path variables are unable to be used, excepting
	// help-topics, which are known at compile time (ok, server side you rascal, javascript isnt compiled!)
	
	var pl = {};
	var key, val;
	for(key in viewUrls) {
		if(viewUrls.hasOwnProperty(key)) {
			val = viewUrls[key];
			if(typeof(val) !== 'undefined' && typeof(val) === 'string' && val.indexOf(':') === -1 && val.indexOf('{') === -1) {
				pl[key] = val;
			}
		}
	}
	
	pl.helpTopics = {};
	var k, v, sections, base;
	for(key in helpTopics) {
		if(helpTopics.hasOwnProperty(key)) {
			val = helpTopics[key];
			base = viewUrls.HELP + '/' + val.name;
			sections = {};
			for(k in val.sections) {
				if(val.sections.hasOwnProperty(k)) {
					sections[k] = base + '?' + params.SCROLL_TO + '=' + val.sections[k];
				}
			}
			pl.helpTopics[key] = {link: base, name: val.name, sections: sections};
		}
	}
	pl.termsSections = {};
	for(key in termsSections) {
		if(termsSections.hasOwnProperty(key)) {
			val = termsSections[key];
			base = viewUrls.TERMS + '?' + params.SCROLL_TO + '=' + val;
			pl.termsSections[key] = {link: base, name: val};
		}
	}
	return pl;
});