define(['async',
        'server_util/render',
        'server_util/controller-util',
        'server_util/api-util',
        'server_util/param-util',
        'server_util/meta-data',
        'js/constants/model-attributes'],
		function(async, render, controllerUtil, apiUtil, paramUtil, metaData, model) {
	return {
		comments: function(req, res) {
			controllerUtil.setTitle(res, 'comments', true);
			apiUtil.commentPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
					paramUtil.constructSort(req),
					paramUtil.constructTime(req),
					null, paramUtil.constructLanguage(req),
					paramUtil.constructWarning(req),
					paramUtil.constructCommentTypes(req), function(code, dto, page) {
				render(req, res, 'comments', model.constructModel(null, page));
			}, function(code, dto) {
					render(req, res, 'noContent');
			}, controllerUtil.apiCallback(req, res));
		},
		commentReplies: function(req, res) {
			controllerUtil.setTitle(res, 'comments', true);
			var cid = paramUtil.constructCommentId(req);
			var warning = paramUtil.constructWarning(req);

			async.parallel([
					function(callback) {
						apiUtil.comment(cid, warning,
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.commentComments(cid,
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
						controllerUtil.setTitle(res, 'commentUser', true, {user: single.author.username});
						render(req, res, 'commentViewReplies', model.constructModel(single, page), metaData.comment(single));
					}
				}
			);
		}
	};
});