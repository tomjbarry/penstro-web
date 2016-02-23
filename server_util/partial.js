define(['server_util/render', 'js/constants/view-urls'], function(render, viewUrls) {
	var partials = 'partials/';
	var admin = partials + 'admin/';
	
	var info = partials + 'info/';
	var page = partials + 'page/';
	var single = partials + 'single/';
	var subNav = partials + 'subNav/';
	var help = partials + 'help/';
	
	var adminInfo = admin + 'info/';
	var adminSingle = admin + 'single/';
	var adminPage = admin + 'page/';
	
	return {
		partial: function(view) {
			return function(req, res) {
				return render(req, res, partials + view, undefined);
			};
		},
		info: function(view) {
			return function(req, res) {
				return render(req, res, info + view, undefined);
			};
		},
		page: function(view) {
			return function(req, res) {
				return render(req, res, page + view, undefined);
			};
		},
		single: function(view) {
			return function(req, res) {
				return render(req, res, single + view, undefined);
			};
		},
		subNav: function(view) {
			return function(req, res) {
				return render(req, res, subNav + view, undefined);
			};
		},
		help: function(view) {
			return function(req, res) {
				return render(req, res, help + view, undefined);
			};
		},
		admin: {
			info: function(view) {
				return function(req, res) {
					return render(req, res, adminInfo + view, undefined);
				};
			},
			single: function(view) {
				return function(req, res) {
					return render(req, res, adminSingle + view, undefined);
				};
			},
			page: function(view) {
				return function(req, res) {
					return render(req, res, adminPage + view, undefined);
				};
			}
		}
	};
});