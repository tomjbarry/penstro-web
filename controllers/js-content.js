define(['server_util/render'], function(render) {
	
	var jsc = function(req, res) {
		render(req, res, 'jsContent');
	};
	return {
		jsc: jsc
	};
});