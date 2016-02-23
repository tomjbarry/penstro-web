define(['async',
        'server_util/render',
        'server_util/controller-util',
        'server_util/api-util',
        'server_util/param-util',
        'server_util/meta-data',
        'js/constants/model-attributes'],
		function(async, render, controllerUtil, apiUtil, paramUtil, metaData, model) {
	return {
		postings: function(req, res) {
			controllerUtil.setTitle(res, 'postings', true);
			apiUtil.postingPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
					paramUtil.constructSort(req),
					paramUtil.constructTime(req),
					null, paramUtil.constructLanguage(req),
					paramUtil.constructWarning(req),
					paramUtil.constructTags(req), function(code, dto, page) {
				render(req, res, 'postings', model.constructModel(null, page));
			}, function(code, dto) {
					render(req, res, 'noContent');
			}, controllerUtil.apiCallback(req, res));
		},
		postingReplies: function(req, res) {
			controllerUtil.setTitle(res, 'postings');
			var pid = paramUtil.constructPostingId(req);
			var warning = paramUtil.constructWarning(req);

			async.parallel([
					function(callback) {
						apiUtil.posting(pid, warning,
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.postingComments(pid,
							paramUtil.constructPage(req), paramUtil.constructSize(req),
							paramUtil.constructSort(req),
							paramUtil.constructTimeReplies(req),
							paramUtil.constructLanguage(req),
							warning,
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
						controllerUtil.setTitle(res, single.title, false);
						render(req, res, 'postingViewReplies', model.constructModel(single, page), metaData.posting(single));
					}
				}
			);
		}
	};
});