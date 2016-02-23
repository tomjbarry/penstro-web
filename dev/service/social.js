define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/constants/states', 'js/constants/events', 'js/constants/social-urls'],
		function(service, $, ng, i18n, states, events, socialUrls) {
	service.factory('Social', ['$modal', '$rootScope', '$state', '$window', '$location', 'Loaded', 'Alerts', 'ModalInterface',
	                       		function($modal, $rootScope, $state, $window, $location, Loaded, Alerts, ModalInterface) {
		var socialData = {open: false, loading: false};
		
		var SocialModalCtrl = function($scope, $modalInstance) {
			$scope.socialData = socialData;
			socialData.loading = false;
			socialData.errors = {};
			socialData.alert = undefined;
			
			$scope.share = function(url) {
				if(typeof(url) !== 'undefined' && typeof(socialData.info) !== 'undefined') {
					for(var k in socialData.info) {
						if(socialData.info.hasOwnProperty(k)) {
							url = url.replace(k, socialData.info[k]);
						}
					}
					$window.open(url, '', 'menubar=no,toolbar=no,resizeable=yes,scrollbars=yes,height=420,width=550');
					
					$modalInstance.dismiss('complete');
				}
			};
			
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
		};
		
		var open = function(title, description, url, altUrl) {
			i18n(function(t) {
				socialData.info = {};
				var permalink = $location.absUrl();
				socialData.info[socialUrls.constants.URL] = encodeURIComponent($location.absUrl());
				if(ng.isDefined(url)) {
					permalink = url;
					socialData.info[socialUrls.constants.URL] = encodeURIComponent(url);
				}
				if(ng.isDefined(altUrl)) {
					permalink = altUrl;
					socialData.info[socialUrls.constants.ALT_URL] = encodeURIComponent(altUrl);
				}
				socialData.info[socialUrls.constants.TITLE] = encodeURIComponent(title);
				socialData.info[socialUrls.constants.DESCRIPTION] = encodeURIComponent(description);
				socialData.info[socialUrls.constants.SOURCE] = encodeURIComponent(t('shared:app'));
				socialData.permalink = permalink;
				
				var r = $modal.open({
					templateUrl: 'socialModal',
					controller: ModalInterface.controller(SocialModalCtrl),
					backdrop: false
				});
	
				r.result.then(function() {
						socialData.open = false;
					}, function() {
						socialData.open = false;
				});
				r.opened.then(function() {
						socialData.open = true;
					}, function() {
						socialData.open = false;
				});
			});
		};
		
		return {
			open: open,
			getSocialData: function() {
				return socialData;
			}
		};
	}]);
});