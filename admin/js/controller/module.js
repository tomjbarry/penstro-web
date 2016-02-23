define(['angular', 'js/controller/index', 'js/service/index'], function(ng) {
	'use strict';
	return ng.module('app.adminController', ['app.adminService', 'app.controller', 'app.service']);
});