define(['controllers/postings',
        'server_util/controller-util',
        'server_util/render'],
        function(postings, controllerUtil, render) {
	return {
		index: function(req, res) {
			/*if(authentication.isAuthenticated(req)) {
				postings.postings(req, res);
			} else {
				render(req, res, 'welcome');
			}*/
			postings.postings(req, res);
		},
		welcome: function(req, res) {
			render(req, res, 'welcome');
		},
		settings: function(req, res) {
			controllerUtil.setTitle(res, 'settings', true);
			render(req, res, 'settings');
		},
		noContent: function(req, res) {
			controllerUtil.setTitle(res, 'notFound', true);
			render(req, res, 'noContent');
		},
		terms: function(req, res) {
			render(req, res, 'terms');
		},
		externalUrl: function(req, res) {
			render(req, res, 'externalUrl');
		},
		/*about: function(req, res) {
			render(req, res, 'about');
		},*/
		careers: function(req, res) {
			render(req, res, 'careers');
		},
		support: function(req, res) {
			render(req, res, 'support');
		},
		help: function(req, res) {
			render(req, res, 'help');
		},
		helpTopic: function(topic) {
			return function(req, res) {
				render(req, res, 'helpTopics/' + topic);
			};
		}
	};
});