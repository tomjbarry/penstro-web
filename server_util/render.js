define(['server_util/request-cache'], function(requestCache) {
	var shallowMerge = function(base, model) {
		var mergedModel = {};
		var attrname;
		for(attrname in base) {
			if(base.hasOwnProperty(attrname)) {
				mergedModel[attrname] = base[attrname];
			}
		}
		for(attrname in model) {
			if(model.hasOwnProperty(attrname)) {
				mergedModel[attrname] = model[attrname];
			}
		}
		return mergedModel;
	};
	var buildModel = function(model, meta) {
		var base = {};
		base._meta = meta;
		if(typeof(model) !== 'undefined') {
			return shallowMerge(base, model);
		} else {
			return base;
		}
	};
	
	return function(req, res, view, model, meta) {
		return res.render(view, buildModel(model, meta), function(err, html) {
			if(err) {
				return req.next(err);
			}
			requestCache.setByRequest(req, html);
			res.send(html);
		});
	};
});