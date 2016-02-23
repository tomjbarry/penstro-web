define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/values'],
		function(service, $, ng, i18n, values) {
	var loaded = {};
	//loaded.FAILED = 'FAILED';
	loaded.FAILED = values.LOADED_FAILED;
	loaded.page = {
			previous: false,
			current: false,
			next: false
	};
	loaded.resetPartial = function() {
		loaded.partial = {
			info: false,
			page: false,
			single: false
		};
	};
	loaded.resetPartial();
	loaded.count = {
		total: 0,
		loaded: 0,
		percentage: 0
	};
	loaded.single = false;
	loaded.info = false;
	loaded.account = false;
	loaded.content = true;
	
	var checkLoadedTotal = function(reset) {
		var total = 0;
		var count = 0;
		
		if(loaded.hasInfo) {
			total = total + 2;
			if(loaded.partial.info) {
				count++;
			}
			if(loaded.info) {
				count++;
			}
		}
		
		if(loaded.hasSingle) {
			total = total + 2;
			if(loaded.partial.single) {
				count++;
			}
			if(loaded.single) {
				count++;
			}
		}
		
		if(loaded.hasPage) {
			total = total + 2;
			if(loaded.partial.page) {
				count++;
			}
			if(loaded.page.current) {
				count++;
			}
		}
		
		loaded.count.total = total;
		loaded.count.loaded = count;
		loaded.count.percentage = (count/total) * 100;
		
		if(reset) {
			loaded.count.total = 0;
			loaded.count.percentage = 0;
			loaded.count.loaded = 0;
		}
	};
	
	loaded.resetInfo = function(hasInfo) {
		loaded.content = false;
		loaded.info = false;
		loaded.hasInfo = false;
		loaded.partial.info = false;
		if(typeof(hasInfo) !== 'undefined') {
			loaded.hasInfo = hasInfo;
		}
		loaded.loadedInfo();
		checkLoadedTotal();
	};
	
	loaded.softResetSingle = function(hasSingle) {
		loaded.single = false;
		loaded.hasSingle = false;
		if(typeof(hasSingle) !== 'undefined') {
			loaded.hasSingle = hasSingle;
		}
		checkLoadedTotal();
	};
	
	loaded.resetSingle = function(hasSingle) {
		loaded.content = false;
		loaded.partial.single = false;
		loaded.softResetSingle(hasSingle);
	};
	
	loaded.softResetPage = function(hasPage) {
		loaded.page = {
				previous: false,
				current: false,
				next: false
		};
		loaded.hasPage = false;
		if(typeof(hasPage) !== 'undefined') {
			loaded.hasPage = hasPage;
		}
		checkLoadedTotal();
	};
	
	loaded.resetPage = function(hasPage) {
		loaded.content = false;
		loaded.partial.page = false;
		loaded.softResetPage(hasPage);
	};
	
	loaded.resetContent = function(hasSingle, hasPage, hasInfo) {
		loaded.content = false;
		loaded.resetInfo(hasInfo);
		loaded.resetSingle(hasSingle);
		loaded.resetPage(hasPage);
		loaded.resetPartial();
		checkLoadedTotal();
	};
	
	var checkContent = function() {
		var content = true;
		if(loaded.hasInfo && (!loaded.info || !loaded.partial.info)) {
			content = false;
		}
		if(loaded.hasSingle && (!loaded.single || !loaded.partial.single)) {
			content = false;
		}
		if(loaded.hasPage && (!loaded.page.current || !loaded.partial.page)) {
			content = false;
		}
		checkLoadedTotal(content);

		loaded.content = content;
	};
	
	loaded.loadedInfo = function() {
		i18n(function(t) {
			loaded.info = true;
			checkContent();
		});
	};
	
	loaded.loadedSingle = function() {
		i18n(function(t) {
			loaded.single = true;
			checkContent();
		});
	};
	
	loaded.loadedPageCurrent = function() {
		i18n(function(t) {
			loaded.page.current = true;
			loaded.page.previous = true;
			loaded.page.next = true;
			checkContent();
		});
	};
	
	loaded.loadedPagePrevious = function() {
		i18n(function(t) {
			loaded.page.previous = true;
		});
	};
	
	loaded.loadedPageNext = function() {
		i18n(function(t) {
			loaded.page.next = true;
		});
	};
	
	loaded.failedInfo = function() {
		i18n(function(t) {
			loaded.info = loaded.FAILED;
			checkContent();
		});
	};
	
	loaded.failedSingle = function() {
		i18n(function(t) {
			loaded.single = loaded.FAILED;
			checkContent();
		});
	};
	
	loaded.failedPageCurrent = function() {
		i18n(function(t) {
			loaded.page.current = loaded.FAILED;
			loaded.page.previous = loaded.FAILED;
			loaded.page.next = loaded.FAILED;
			checkContent();
		});
	};
	
	loaded.failedPagePrevious = function() {
		i18n(function(t) {
			loaded.page.previous = loaded.FAILED;
		});
	};
	
	loaded.failedPageNext = function() {
		i18n(function(t) {
			loaded.page.next = loaded.FAILED;
		});
	};
	
	loaded.partialInfo = function() {
		loaded.partial.info = true;
		checkContent();
	};
	
	loaded.partialPage = function() {
		loaded.partial.page = true;
		checkContent();
	};
	
	loaded.partialSingle = function() {
		loaded.partial.single = true;
		checkContent();
	};
	
	service.factory('Loaded', function() {
		return loaded;
	});
});