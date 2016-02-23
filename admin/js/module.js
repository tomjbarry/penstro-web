define(['angular',
        'admin-js/service/index',
        'admin-js/controller/index',
        'angular-ui-router',
        'angular-ui-bootstrap',
        'angular-sanitize'], function(ng) {
	'use strict';
	return ng.module('app.admin', ['app.adminController', 'app.adminService', 'ui.router', 'ui.bootstrap', 'ngSanitize']);
});
define(['angular'], function(ng) {
	'use strict';
	return ng.module('app.admin', []);
});