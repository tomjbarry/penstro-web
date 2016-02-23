define(['async',
        'server_util/render',
        'server_util/controller-util',
        'server_util/api-util',
        'server_util/param-util',
        'server_util/meta-data',
        'js/constants/model-attributes'],
		function(async, render, controllerUtil, apiUtil, paramUtil, metaData, model) {
	return {
		users: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			apiUtil.userPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
					paramUtil.constructTime(req),
					paramUtil.constructLanguage(req),
					function(code, dto, page) {
				render(req, res, 'users', model.constructModel(null, page));
			}, function(code, dto) {
					render(req, res, 'noContent');
			}, controllerUtil.apiCallback(req, res));
		},
		userReplies: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);
			var warning = paramUtil.constructWarning(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, warning,
							controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.userComments(uid,
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewReplies', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		},
		userActivity: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, paramUtil.constructWarning(req),
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.userFeed(uid,
							paramUtil.constructPage(req), null, null,
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewActivity', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		},
		userFollowees: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, paramUtil.constructWarning(req),
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.userFollowees(uid,
							paramUtil.constructPage(req), null,
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewFollowees', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		},
		userFollowers: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, paramUtil.constructWarning(req),
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
          function(callback) {
						apiUtil.userFollowers(uid,
							paramUtil.constructPage(req), paramUtil.constructSize(req),
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewFollowers', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		},
		userPostings: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, paramUtil.constructWarning(req),
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
					function(callback) {
						apiUtil.postingPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
								paramUtil.constructSort(req),
								paramUtil.constructTime(req),
								uid,
								paramUtil.constructLanguage(req),
								paramUtil.constructWarning(req),
								paramUtil.constructTags(req),
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewPostings', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		},
		userComments: function(req, res) {
			controllerUtil.setTitle(res, 'users', true);
			var uid = paramUtil.constructUserId(req);

			async.parallel([
					function(callback) {
						apiUtil.user(uid, paramUtil.constructWarning(req),
								controllerUtil.standardCallback(callback),
							controllerUtil.standardErrorCallback(callback));
					},
					function(callback) {
						apiUtil.commentPreviews(paramUtil.constructPage(req), paramUtil.constructSize(req),
								paramUtil.constructSort(req),
								paramUtil.constructTime(req),
								uid,
								paramUtil.constructLanguage(req),
								paramUtil.constructWarning(req),
								paramUtil.constructCommentTypes(req),
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
						controllerUtil.setTitle(res, single.username.username, false);
						render(req, res, 'userViewComments', model.constructModel(single, page), metaData.user(single));
					}
				}
			);
		}
	};
});