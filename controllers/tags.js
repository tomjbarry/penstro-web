define(['async',
        'server_util/render',
        'server_util/controller-util',
        'server_util/api-util',
        'server_util/param-util',
        'server_util/meta-data',
        'js/constants/model-attributes'],
		function(async, render, controllerUtil, apiUtil, paramUtil, metaData, model) {
	return {
		tags: function(req, res) {
			controllerUtil.setTitle(res, 'tags', true);
			apiUtil.tagPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
					paramUtil.constructTime(req),
					paramUtil.constructLanguage(req),
					function(code, dto, page) {
				render(req, res, 'tags', model.constructModel(null, page));
			}, function(code, dto) {
					render(req, res, 'noContent');
			}, controllerUtil.apiCallback(req, res));
		},
		tagReplies: function(req, res) {
			controllerUtil.setTitle(res, 'tags', true);
			var tag = paramUtil.constructTagId(req);
			var language = paramUtil.constructLanguage(req);

			async.parallel([
					function(callback) {
						apiUtil.tag(tag, language,
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.tagComments(tag,
							paramUtil.constructPage(req), paramUtil.constructSize(req),
							paramUtil.constructSort(req),
							paramUtil.constructTimeReplies(req),
							language,
							paramUtil.constructWarning(req),
							controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
          }
        ],
        function(err, results) {
					var single = controllerUtil.getSingleFromResultList(results);
					var page = controllerUtil.getPageFromResultList(results);
					if(typeof(single) === 'undefined') {
						render(req, res, 'noContent');
					} else {
						controllerUtil.setTitle(res, 'tagTag', true, {tag: single.name});
						render(req, res, 'tagViewReplies', model.constructModel(single, page), metaData.tag(single));
					}
				}
			);
		},
		tagPostings: function(req, res) {
			controllerUtil.setTitle(res, 'tags', true);
			var tag = paramUtil.constructTagId(req);
			var language = paramUtil.constructLanguage(req);

			async.parallel([
					function(callback) {
						apiUtil.tag(tag, language,
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.postingPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
							paramUtil.constructSort(req),
							paramUtil.constructTime(req),
							null,
							language,
							paramUtil.constructWarning(req),
							[tag],
							controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
          }
        ],
        function(err, results) {
					var single = controllerUtil.getSingleFromResultList(results);
					var page = controllerUtil.getPageFromResultList(results);
					if(typeof(single) === 'undefined') {
						render(req, res, 'noContent');
					} else {
						controllerUtil.setTitle(res, 'tagTag', true, {tag: single.name});
						render(req, res, 'tagViewPostings', model.constructModel(single, page), metaData.tag(single));
					}
				}
			);
		}
	};
});