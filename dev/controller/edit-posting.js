define(['./module', 'jquery', 'angular', 'js/util/i18n', 'js/util/validation-errors',
        'js/constants/response-codes', 'js/constants/path-variables', 'js/constants/events', 'js/constants/states', 'js/constants/forms'],
		function(controller, $, ng, i18n, validation, responseCodes, pathVars, events, states, forms) {
	controller.controller('EditPostingController', ['$rootScope', '$scope', '$state', 'Browser', 'CurrentUser', 'Utils',
																										'Authentication', 'Alerts', 'MarkdownConverter', 'pyPosting',
		function($rootScope, $scope, $state, Browser, CurrentUser, Utils, Authentication, Alerts, Converter, pyPosting) {
			$scope.postingLoading = false;
			$scope.title = undefined;
			$scope.content = undefined;
			$scope.preview = undefined;
			$scope.alert = undefined;
			$scope.errors = {};
			$scope.currentUser = undefined;
			$scope.currentUsername = undefined;
			$scope.showPreview = false;
			$scope.show = false;
			
			var pscope = $scope.$parent;
			$scope.pscope = pscope;
			
			Utils.unsavedChanges($scope, forms.EDIT_POSTING);
			
			var cancel = function() {
				$scope.show = false;
			};
			
			var setAuthenticated = function(authenticated) {
				$scope.authenticated = authenticated;
				if(authenticated) {
					CurrentUser.get(function(currentUser) {
						$scope.currentUser = currentUser;
						$scope.currentUsername = currentUser.username.username;
					}, function() {
						i18n(function(t) {
							Alerts.warning(t('alerts:apiError'));
							cancel();
						});
					});
				}
			};
			setAuthenticated(Authentication.isAuthenticated());
			Authentication.manageEvent($scope, function(event, authenticated) {
				setAuthenticated(authenticated);
			});
			
			var error = function(code, dto) {
				i18n(function(t) {
					$scope.postingLoading = false;
					if(code === responseCodes.INVALID && typeof(dto) !== 'undefined') {
						validation.handleErrorsInOrder(dto, ['title', 'content', 'preview', 'imageLink', 'imageWidth', 'imageHeight'], function(field, error) {
							if(error) {
								var code = 'validation:' + validation.getValidCode(error);
								$scope.errors[field] = t(code, validation.getArguments(error));
							} else {
								$scope.errors[field] = undefined;
							}
						});
					} else if(code === responseCodes.NOT_ALLOWED) {
						$scope.alert = t('alerts:posting.editNotAllowed');
					} else {
						$scope.alert = t('alerts:posting.editError');
					}
				});
			};
			
			var success = function(code, dto, page) {
				$scope.postingLoading = false;
				$rootScope.$broadcast(events.UNSAVED_CHANGES_COMPLETE);
				$scope.show = false;
				if(ng.isDefined(pscope.posting)) {
					if($scope.title === '') {
						$scope.title = undefined;
					}
					if($scope.content === '') {
						$scope.content = undefined;
					}
					if($scope.preview === '') {
						$scope.preview = undefined;
					}
					pscope.posting.title = $scope.title;
					pscope.posting.content = $scope.content;
					pscope.posting.preview = $scope.preview;
					pscope.posting.imageLink = $scope.imageLink;
					pscope.posting.imageWidth = $scope.imageWidth;
					pscope.posting.imageHeight = $scope.imageHeight;
				}
			};
			
			var apiError = function() {
				i18n(function(t) {
					$scope.postingLoading = false;
					$scope.alert = t('alerts:apiError');
				});
			};
			
			$scope.editPosting = function() {
				$scope.postingLoading = true;
				$scope.errors = {};
				$scope.alert = undefined;
				if(ng.isDefined(pscope.postingId)) {
					var height, width;
					if(ng.isDefined($scope.imageHeight)) {
						height = parseInt($scope.imageHeight);
					}
					if(ng.isDefined($scope.imageWidth)) {
						width = parseInt($scope.imageWidth);
					}
					pyPosting.edit(success, error, apiError, pscope.postingId, $scope.title, $scope.content, $scope.preview, $scope.imageLink, width, height);
				}
			};
			
			Converter.manageEvent($scope, function() {
				var content = $scope.content;
				if(typeof(content) === 'undefined') {
					content = '';
				}
				$scope.contentPreview = content;
			});
			
			$scope.open = function() {
				if(ng.isDefined(pscope.posting)) {
					$scope.show = true;
					$scope.title = pscope.posting.title;
					$scope.content = pscope.posting.content;
					$scope.$broadcast(events.SET_EDITOR, $scope.content);
					$scope.preview = pscope.posting.preview;
					$scope.imageLink = pscope.posting.imageLink;
					$scope.imageWidth = pscope.posting.imageWidth;
					$scope.imageHeight = pscope.posting.imageHeight;
				}
			};
			
			$scope.cancel = function() {
				cancel();
			};
		}
	]);
});