define(['jade', 'utils-merge', 'js/constants/partials', 'admin-js/constants/admin-partials'], function(jade, merge, partials, adminPartials) {
	return function(app, translate, adminMode) {
		var startTime = new Date().getTime();
		console.log("Rendering JS Partials...");
		var jadeOptions = {};
		//if(process.env.NODE_ENV === 'production') {
			jadeOptions.compileDebug = false;
			jadeOptions.cache = false;
		//}
		
		var path = function(p) {
			return 'views/partials/jsPartials/' + p + '.jade';
		};
		
		var adminPath = function(p) {
			return 'views/partials/admin/jsPartials/' + p + '.jade';
		};
		
		var locals = {};
		merge(locals, app.locals);
		locals.t = translate;
		//merge(allOptions, jadeOptions);
		
		var render = function(p) {
			var options = {};
			options.filename = p;
			merge(options, jadeOptions);
			return jade.compileFile(path(p), options)(locals);
		};
		
		var adminRender = function(p) {
			var options = {};
			options.filename = p;
			merge(options, jadeOptions);
			return jade.compileFile(adminPath(p), options)(locals);
		};
		
		var renderedPartials = {};

		renderedPartials[partials.ROOT] = render('root');
		renderedPartials[partials.SINGLE] = render('single');
		renderedPartials[partials.PAGEABLE] = render('pageable');
		renderedPartials[partials.SUB_SINGLE] = render('subSingle');
		renderedPartials[partials.SUB_PAGEABLE] = render('subPageable');
		
		renderedPartials[partials.ACTIVITY] = render('activity');
		renderedPartials[partials.BLOCKED] = render('blockedInfo');
		renderedPartials[partials.COMMENT] = render('comment');
		renderedPartials[partials.CONVERSATION] = render('conversation');
		renderedPartials[partials.CURRENT] = render('current');
		renderedPartials[partials.FOLLOWEE] = render('followee');
		renderedPartials[partials.FOLLOWER] = render('followInfo');
		renderedPartials[partials.MESSAGE] = render('message');
		renderedPartials[partials.NOTIFICATION] = render('notification');
		renderedPartials[partials.POSTING] = render('posting');
		renderedPartials[partials.TAG] = render('tag');
		renderedPartials[partials.USER] = render('user');
		
		if(adminMode) {
			renderedPartials[adminPartials.POSTING] = adminRender('posting');
			renderedPartials[adminPartials.USER] = adminRender('user');
			renderedPartials[adminPartials.COMMENT] = adminRender('comment');

			renderedPartials[adminPartials.FOLLOWER] = adminRender('follower');
			renderedPartials[adminPartials.FOLLOWEE] = adminRender('followee');
			renderedPartials[adminPartials.BLOCKED] = adminRender('blocked');
			
			renderedPartials[adminPartials.RESTRICTED] = adminRender('restricted');
			renderedPartials[adminPartials.FLAGGED] = adminRender('flagged');
		}
		
		var stringifiedPartials = JSON.stringify(renderedPartials);
		console.log("Done rendering JS Partials in " + ((new Date().getTime()) - startTime) / (1000) + " seconds!");
		return {
			renderedPartials: renderedPartials,
			stringifiedPartials: stringifiedPartials
		};
	};
});