define(['jquery', 'js/constants/partials'],function($, partials) {
	'use strict';
	
	var jsPartials = window.pyJsPartials();
	if(typeof(jsPartials) === 'undefined') {
		jsPartials = {};
	}
	var getBasePartials = function() {
		var o = {};
		for(var key in jsPartials) {
			if(jsPartials.hasOwnProperty(key)) {
				o[key] = {
					template: jsPartials[key],
					reloadOnSearch: false
				};
			}
		}
		
		return o;
	};
	
	var infoController = ['Loaded', function(Loaded) {Loaded.resetInfo(true);Loaded.loadedInfo();}];
	var noInfoController = ['Loaded', function(Loaded) {Loaded.resetInfo(false);Loaded.loadedInfo();}];
	var noSingleController = ['Loaded', 'Single', function(Loaded, Single) {Loaded.resetSingle(false);Single.clear();}];
	var noRootController = [function() {}];
	
	var infoTemplate = '<div loaded-info></div>';
	var singleTemplate = '<div loaded-single></div>';
	var pageTemplate = '<div loaded-page></div>';
	
	var url = function(u) {
		return '^' + u;
	};
	
	var blankRoot = {
		controller: noRootController,
		reloadOnSearch: false
	};
	
	var getRoot = function(r) {
		if(typeof(r) === 'undefined') {
			return blankRoot;
		}
		return {
			template: jsPartials[partials.ROOT],
			controller: r,
			reloadOnSearch: false
		};
	};
	
	var blankInfo = {
		template: infoTemplate,
		controller: noInfoController,
		reloadOnSearch: false
	};
	var info = function(templateUrl, controller) {
		controller = controller || noInfoController;
		var ob = {};
		ob.controller = controller;
		ob.reloadOnSearch = false;
		if(typeof(templateUrl) !== 'undefined') {
			ob.templateUrl = templateUrl;
		} else {
			ob.template = infoTemplate;
		}
		return ob;
	};
	
	var blankSingle = {
		template: singleTemplate,
		controller: noSingleController,
		reloadOnSearch: false
	};
	var single = function(templateUrl, controller) {
		controller = controller || noSingleController;
		var ob = {};
		ob.controller = controller;
		ob.reloadOnSearch = false;
		if(typeof(templateUrl) !== 'undefined') {
			ob.templateUrl = templateUrl;
		} else {
			ob.template = singleTemplate;
		}
		return ob;
	};
	
	var blankPage = {
		template: pageTemplate,
		reloadOnSearch: false
	};
	var page = function(url) {
		return {
			templateUrl: url
		};
	};
	var blankPageLoader = {
			template: '',
			controller: ['Loaded', 'Pageable', function(Loaded, Pageable) {
				Loaded.resetPage(false);
				Pageable.clear();
			}],
			reloadOnSearch: false
	};
	
	var pageLoader = function(f) {
		return {
			controller: f,
			reloadOnSearch: false
		};
	};
	
	var views = function(r, i) {
		var root = getRoot(r);
		var info = i || blankInfo;
		//s = s || blankSingle;
		//p = p || blankPage;
		//pL = pL || blankPageLoader;
		var v = getBasePartials();
		v['info@'] = info;
		v['root@'] = root;
		//v['single@'] = s;
		//v['page@'] = p;
		//v['pageLoader@'] = pL;
		
		return v;
	};
	
	return {
		controllers: {
			info: infoController,
			noInfo: noInfoController,
			noSingle: noSingleController
		},
		templates: {
			info: infoTemplate,
			single: singleTemplate,
			page: pageTemplate
		},
		blanks: {
			info: blankInfo,
			single: blankSingle,
			page: blankPage,
			pageLoader: blankPageLoader
		},
		funcs: {
			url: url,
			views: views,
			info: info,
			single: single,
			page: page,
			pageLoader: pageLoader
		}
	};
});