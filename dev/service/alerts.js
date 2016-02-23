define(['./module', 'jquery', 'angular', 'js/constants/view-ids'],
		function(service, $, ng, viewIds) {
	var ERROR = 'danger';
	var WARNING = 'warning';
	var INFO = 'info';
	var SUCCESS = 'success';
	
	var alerts = {notifications: []};
	
	var inArray = function(ob, list) {
		if(typeof(ob) === 'undefined' || typeof(list) === 'undefined') {
			return false;
		}
		for(var i = 0; i < list.length; i++) {
			if(list[i].message === ob.message && list[i].type === ob.type) {
				return true;
			}
		}
		return false;
	};
	
	service.factory('Alerts', ['Browser', function(Browser) {
	
		var add = function(type, message, link) {
			if(ng.isDefined(type) && ng.isDefined(message)) {
				var ob = {type: type, message: message, link: link};
				if(!inArray(ob, alerts.notifications)) {
					alerts.notifications.push(ob);
					Browser.scrollTo(viewIds.ALERTS);
				}
			}
		};
		return {
			getAlerts: function() {
				return alerts;
			},
			clear: function() {
				alerts.notifications = [];
			},
			remove: function(index) {
				alerts.notifications.splice(index, 1);
			},
			error: function(notification, link) {
				add(ERROR, notification, link);
			},
			warning: function(notification, link) {
				add(WARNING, notification, link);
			},
			info: function(notification, link) {
				// info is disabled currently
				// TODO: add way of user specifying which alerts they see
				//add(INFO, notification, link);
			},
			success: function(notification, link) {
				add(SUCCESS, notification, link);
			}
		};
	}]);
});